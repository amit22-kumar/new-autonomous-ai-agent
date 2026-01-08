"""
Project Management Agent API
FastAPI backend with WebSocket support
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import json
import os
from dotenv import load_dotenv
from datetime import datetime

# Import only what you need from models
from api.models import ProjectCreate, TaskUpdate

# Import your agent
import sys
sys.path.append('..')
from agent.core import ProjectManagementAgent

load_dotenv()

app = FastAPI(title="Project Management Agent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database in production)
projects_db = {}
active_connections: Dict[str, WebSocket] = {}
agents: Dict[str, ProjectManagementAgent] = {}

# Helper Functions
def generate_id():
    return f"proj_{datetime.now().strftime('%Y%m%d%H%M%S%f')}"

# REST API Endpoints

@app.get("/")
async def root():
    return {"message": "Project Management Agent API", "status": "running"}

@app.post("/api/projects")
async def create_project(project: ProjectCreate):
    """Create a new project and generate initial plan"""
    try:
        # Initialize agent
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")
        
        agent = ProjectManagementAgent(api_key)
        
        # Generate project ID
        project_id = generate_id()
        
        # Create initial project data (without AI plan for now to avoid errors)
        project_dict = {
            "id": project_id,
            "project_id": project_id,
            "name": project.name,
            "description": project.description,
            "goals": project.goals,
            "start_date": project.start_date,
            "deadline": project.deadline,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "status": "active",
            "completion_percentage": 0,
            "health_indicator": "green",
            "team_members": project.team_members if project.team_members else [],
            "budget": project.budget,
            "phases": [],
            "tasks": [],
            "milestones": []
        }
        
        # Try to generate AI plan, but don't fail if it errors
        try:
            goal_text = f"{project.description}. Goals: {', '.join(project.goals)}"
            plan = agent.create_project(goal_text, project.constraints)
            project_dict["plan"] = plan
        except Exception as plan_error:
            print(f"AI plan generation failed: {plan_error}")
            project_dict["plan"] = {"error": "Plan generation pending"}
        
        # Store project
        projects_db[project_id] = project_dict
        
        return {
            "project_id": project_id,
            "project": projects_db[project_id]
        }
    except Exception as e:
        print(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    """Get project details"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    return projects_db[project_id]

@app.get("/api/projects")
async def list_projects():
    """List all projects"""
    return {"projects": list(projects_db.values())}

@app.put("/api/projects/{project_id}/tasks")
async def update_task_status(project_id: str, task_update: TaskUpdate):
    """Update task status and get progress analysis"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        agent = ProjectManagementAgent(api_key)
        
        # Get analysis
        analysis = agent.update_task(
            task_update.task_id,
            task_update.status,
            projects_db[project_id],
            task_update.notes,
            task_update.actual_hours
        )
        
        # Update project
        projects_db[project_id]["last_update"] = datetime.now().isoformat()
        
        return {
            "project_id": project_id,
            "analysis": analysis
        }
    except Exception as e:
        print(f"Error updating task: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}/report")
async def generate_report(project_id: str, report_type: str = "weekly"):
    """Generate status report for project"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        agent = ProjectManagementAgent(api_key)
        
        project_data = projects_db[project_id]
        report = agent.generate_status_report(project_data, report_type)
        
        return {
            "project_id": project_id,
            "generated_at": datetime.now().isoformat(),
            "report": report,
            "completion_percentage": project_data.get("completion_percentage", 0),
            "status": project_data.get("status", "active"),
            "health_indicator": project_data.get("health_indicator", "green")
        }
    except Exception as e:
        print(f"Error generating report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    """Delete a project"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    del projects_db[project_id]
    if project_id in agents:
        del agents[project_id]
    
    return {"message": "Project deleted successfully"}

# WebSocket Endpoint
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket
    
    # Initialize agent for this session
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        await websocket.send_json({
            "type": "error",
            "message": "Please set ANTHROPIC_API_KEY environment variable"
        })
        return
    
    agents[session_id] = ProjectManagementAgent(api_key)
    
    try:
        await websocket.send_json({
            "type": "connected",
            "message": "Connected to Project Management Agent"
        })
        
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            message = data.get("message", "")
            project_id = data.get("project_id")
            
            # Get project context if available
            project_context = None
            if project_id and project_id in projects_db:
                project_context = projects_db[project_id]
            
            # Get agent response
            agent = agents[session_id]
            response = agent.chat(message, project_context)
            
            # Send response back to client
            await websocket.send_json({
                "type": "message",
                "response": response["response"],
                "usage": response["usage"]
            })
            
    except WebSocketDisconnect:
        if session_id in active_connections:
            del active_connections[session_id]
        if session_id in agents:
            del agents[session_id]
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_json({
            "type": "error",
            "message": str(e)
        })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)