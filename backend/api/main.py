from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import json
from typing import Dict
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent.core import ResearchAgent
from models.schemas import GoalRequest, AgentResponse

app = FastAPI(title="Research Agent API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active agents (in production, use proper session management)
active_agents: Dict[str, ResearchAgent] = {}

@app.get("/")
async def root():
    return {
        "message": "Research Agent API",
        "version": "1.0.0",
        "endpoints": {
            "POST /agent/run": "Run agent with a goal",
            "WebSocket /ws/{session_id}": "Real-time agent execution"
        }
    }

@app.post("/agent/run", response_model=AgentResponse)
async def run_agent(request: GoalRequest):
    """
    Run the agent with a given goal (synchronous)
    """
    try:
        agent = ResearchAgent()
        result = await agent.run(request.goal)
        return AgentResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time agent execution with progress updates
    """
    await websocket.accept()
    
    try:
        # Receive the goal
        data = await websocket.receive_text()
        goal_data = json.loads(data)
        goal = goal_data.get("goal", "")
        
        if not goal:
            await websocket.send_json({
                "type": "error",
                "message": "No goal provided"
            })
            return
        
        # Create agent
        agent = ResearchAgent()
        active_agents[session_id] = agent
        
        # Progress callback
        async def progress_callback(update):
            await websocket.send_json({
                "type": "progress",
                "data": update
            })
        
        # Send start message
        await websocket.send_json({
            "type": "started",
            "message": "Agent execution started",
            "goal": goal
        })
        
        # Run agent
        result = await agent.run(goal, progress_callback)
        
        # Send completion
        await websocket.send_json({
            "type": "completed",
            "data": result
        })
        
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "message": str(e)
        })
    finally:
        if session_id in active_agents:
            del active_agents[session_id]

@app.get("/health")
async def health_check():
    return {"status": "healthy", "active_sessions": len(active_agents)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

