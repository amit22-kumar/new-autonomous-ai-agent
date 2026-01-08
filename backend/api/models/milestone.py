"""
Milestone Models
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class MilestoneStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    ACHIEVED = "achieved"
    MISSED = "missed"
    AT_RISK = "at_risk"

class Milestone(BaseModel):
    milestone_id: str
    name: str
    description: Optional[str] = None
    target_date: str
    actual_date: Optional[str] = None
    status: MilestoneStatus = MilestoneStatus.NOT_STARTED
    completion_percentage: float = 0.0
    success_criteria: List[str] = Field(default_factory=list)
    associated_tasks: List[str] = Field(default_factory=list)
    phase: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    
    class Config:
        use_enum_values = True

class MilestoneCreate(BaseModel):
    name: str
    description: Optional[str] = None
    target_date: str
    success_criteria: List[str] = Field(default_factory=list)
    phase: Optional[str] = None
    
    class Config:
        use_enum_values = True