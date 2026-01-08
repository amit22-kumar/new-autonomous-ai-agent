"""
Report Models
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class HealthIndicator(str, Enum):
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"

class Risk(BaseModel):
    risk_id: str
    category: str
    description: str
    probability: RiskLevel
    impact: RiskLevel
    risk_score: int
    mitigation_strategy: Optional[str] = None
    contingency_plan: Optional[str] = None
    owner: Optional[str] = None
    status: str = "identified"
    
    class Config:
        use_enum_values = True

class MetricsSummary(BaseModel):
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    blocked_tasks: int
    completion_percentage: float
    total_estimated_hours: float
    hours_completed: float
    hours_remaining: float
    on_time_percentage: float
    average_task_completion_days: Optional[float] = None

class Report(BaseModel):
    report_id: str
    project_id: str
    report_type: str
    generated_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    report_date: str
    executive_summary: str
    health_indicator: HealthIndicator
    overall_status: str
    metrics: MetricsSummary
    key_achievements: List[str] = Field(default_factory=list)
    completed_milestones: List[str] = Field(default_factory=list)
    in_progress_items: List[str] = Field(default_factory=list)
    upcoming_milestones: List[str] = Field(default_factory=list)
    risks: List[Risk] = Field(default_factory=list)
    blockers: List[str] = Field(default_factory=list)
    issues: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)
    full_report_markdown: Optional[str] = None
    attachments: List[str] = Field(default_factory=list)
    
    class Config:
        use_enum_values = True

class ReportCreate(BaseModel):
    project_id: str
    report_type: str = "weekly"
    custom_sections: Optional[List[str]] = None
    
    class Config:
        use_enum_values = True