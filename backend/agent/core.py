
import anthropic
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime
from .planner import TaskPlanner
from .executor import TaskExecutor
from .tools import ToolRegistry

class ResearchAgent:
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.planner = TaskPlanner(self.client)
        self.executor = TaskExecutor(self.client)
        self.tool_registry = ToolRegistry()
        self.conversation_history = []
        self.current_goal = None
        self.execution_log = []
        
    def understand_goal(self, goal: str) -> Dict[str, Any]:
       
        system_prompt = """You are an AI agent that understands research goals.
         Analyze the goal and extract:
        1. Main objective
        2. Key topics/entities
        3. Expected deliverable type (report, summary, analysis, etc.)
        4. Scope and constraints
        5. Success criteria
        
        Return as JSON with keys: objective, topics, deliverable_type, scope, success_criteria"""
        
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=system_prompt,
            messages=[{
                "role": "user",
                "content": f"Goal: {goal}\n\nAnalyze this goal and return the structured information as JSON."
            }]
        )
        
        try:
            understanding = json.loads(response.content[0].text)
        except:
            # Fallback parsing
            understanding = {
                "objective": goal,
                "topics": [],
                "deliverable_type": "report",
                "scope": "comprehensive",
                "success_criteria": ["Complete research", "Accurate information", "Well-structured output"]
            }
        
        self.current_goal = understanding
        self.log_event("goal_understood", understanding)
        return understanding
    
    def create_plan(self, goal_understanding: Dict[str, Any]) -> List[Dict[str, Any]]:
        
        plan = self.planner.create_plan(goal_understanding)
        self.log_event("plan_created", {"steps": len(plan), "plan": plan})
        return plan
    
    async def execute_plan(self, plan: List[Dict[str, Any]], progress_callback=None) -> Dict[str, Any]:
       
        results = {
            "steps_completed": 0,
            "total_steps": len(plan),
            "step_results": [],
            "final_output": None,
            "status": "in_progress"
        }
        
        for i, step in enumerate(plan):
            self.log_event("step_started", step)
            
            try:
                step_result = await self.executor.execute_step(
                    step, 
                    self.tool_registry,
                    context=results["step_results"]
                )
                
                results["step_results"].append({
                    "step_number": i + 1,
                    "step": step,
                    "result": step_result,
                    "status": "completed",
                    "timestamp": datetime.now().isoformat()
                })
                
                results["steps_completed"] = i + 1
                
                if progress_callback:
                    await progress_callback(results)
                    
                self.log_event("step_completed", step_result)
                
            except Exception as e:
                error_result = {
                    "step_number": i + 1,
                    "step": step,
                    "error": str(e),
                    "status": "failed",
                    "timestamp": datetime.now().isoformat()
                }
                results["step_results"].append(error_result)
                self.log_event("step_failed", error_result)
                
                # Try to recover or continue
                if not step.get("critical", True):
                    continue
                else:
                    results["status"] = "failed"
                    return results
        
        results["status"] = "completed"
        return results
    
    def synthesize_results(self, execution_results: Dict[str, Any]) -> str:
        
        system_prompt = """You are creating the final deliverable for a research task.
        
        Synthesize all the research findings into a comprehensive, well-structured output.
        Use markdown formatting for clarity.
        
        Include:
        - Executive Summary
        - Main Findings (organized by topic)
        - Key Statistics and Data Points
        - Sources and References
        - Conclusion
        """
        
        
        findings = []
        for step_result in execution_results["step_results"]:
            if step_result["status"] == "completed":
                findings.append(f"## {step_result['step']['description']}\n\n{step_result['result']}")
        
        content = "\n\n".join(findings)
        
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            system=system_prompt,
            messages=[{
                "role": "user",
                "content": f"Original Goal: {self.current_goal['objective']}\n\nResearch Findings:\n\n{content}\n\nCreate the final comprehensive report."
            }]
        )
        
        final_output = response.content[0].text
        self.log_event("results_synthesized", {"length": len(final_output)})
        return final_output
    
    async def run(self, goal: str, progress_callback=None) -> Dict[str, Any]:
      
        try:
            
            goal_understanding = self.understand_goal(goal)
            if progress_callback:
                await progress_callback({"stage": "understanding", "data": goal_understanding})
            
           
            plan = self.create_plan(goal_understanding)
            if progress_callback:
                await progress_callback({"stage": "planning", "data": plan})
            
            
            execution_results = await self.execute_plan(plan, progress_callback)
            
            
            final_output = self.synthesize_results(execution_results)
            execution_results["final_output"] = final_output
            
            
            return {
                "success": True,
                "goal": goal,
                "understanding": goal_understanding,
                "plan": plan,
                "execution": execution_results,
                "output": final_output,
                "log": self.execution_log
            }
            
        except Exception as e:
            self.log_event("agent_error", {"error": str(e)})
            return {
                "success": False,
                "error": str(e),
                "log": self.execution_log
            }
    
    def log_event(self, event_type: str, data: Any):
        
        self.execution_log.append({
            "timestamp": datetime.now().isoformat(),
            "event": event_type,
            "data": data
        })
