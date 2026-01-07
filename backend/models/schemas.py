
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class GoalRequest(BaseModel):
    goal: str = Field(..., description="The research goal to accomplish")
    
class StepResult(BaseModel):
    step_number: int
    description: str
    status: str
    result: Optional[str] = None
    error: Optional[str] = None
    timestamp: str

class AgentResponse(BaseModel):
    success: bool
    goal: str
    understanding: Optional[Dict[str, Any]] = None
    plan: Optional[List[Dict[str, Any]]] = None
    execution: Optional[Dict[str, Any]] = None
    output: Optional[str] = None
    error: Optional[str] = None
    log: List[Dict[str, Any]] = []

class ProgressUpdate(BaseModel):
    stage: str
    data: Any
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())

