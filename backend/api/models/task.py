"""
Task Models
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class TaskStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"
    AT_RISK = "at_risk"

class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class Task(BaseModel):
    task_id: str
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.NOT_STARTED
    priority: Priority = Priority.MEDIUM
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    deadline: Optional[str] = None
    dependencies: List[str] = Field(default_factory=list)
    assignee: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    deliverables: List[str] = Field(default_factory=list)
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    
    class Config:
        use_enum_values = True

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    estimated_hours: Optional[float] = None
    deadline: Optional[str] = None
    dependencies: List[str] = Field(default_factory=list)
    assignee: Optional[str] = None
    
    class Config:
        use_enum_values = True

class TaskUpdate(BaseModel):
    task_id: str
    status: Optional[TaskStatus] = None
    actual_hours: Optional[float] = None
    notes: Optional[str] = None
    assignee: Optional[str] = None
    
    class Config:
        use_enum_values = True