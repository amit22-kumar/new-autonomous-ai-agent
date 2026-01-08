"""
Project Models
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ProjectStatus(str, Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class HealthIndicator(str, Enum):
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"

class Phase(BaseModel):
    phase_number: int
    name: str
    description: Optional[str] = None
    duration_weeks: float
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: str = "not_started"
    completion_percentage: float = 0.0
    milestones: List[str] = Field(default_factory=list)
    tasks: List[str] = Field(default_factory=list)

class Project(BaseModel):
    project_id: str
    name: str
    description: str
    goals: List[str]
    status: ProjectStatus = ProjectStatus.PLANNING
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    deadline: Optional[str] = None
    completion_percentage: float = 0.0
    phases: List[Phase] = Field(default_factory=list)
    team_members: List[str] = Field(default_factory=list)
    budget: Optional[float] = None
    currency: str = "USD"
    health_indicator: HealthIndicator = HealthIndicator.GREEN
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        use_enum_values = True

class ProjectCreate(BaseModel):
    name: str
    description: str
    goals: List[str]
    start_date: Optional[str] = None
    deadline: Optional[str] = None
    team_members: List[str] = Field(default_factory=list)
    budget: Optional[float] = None
    constraints: Optional[Dict[str, Any]] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    completion_percentage: Optional[float] = None
    health_indicator: Optional[HealthIndicator] = None
    
    class Config:
        use_enum_values = True