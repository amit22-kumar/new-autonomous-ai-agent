"""
Tracker Module
Tracks project progress, task status, and milestone completion
"""
from anthropic import Anthropic
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import json

class ProgressTracker:
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
        
    def update_task_status(self, task_id: str, status: str, project_data: Dict, 
                          notes: Optional[str] = None, actual_hours: Optional[float] = None) -> Dict:
        """
        Update task status and analyze impact on project
        Status: not_started, in_progress, completed, blocked, at_risk
        """
        prompt = f"""Task Update:
- Task ID: {task_id}
- New Status: {status}
- Notes: {notes or 'None'}
- Actual Hours: {actual_hours or 'Not provided'}

Current Project State:
{json.dumps(project_data, indent=2)}

Analyze this update and provide:
1. Impact on dependent tasks
2. Impact on milestone dates
3. Overall project completion percentage
4. Whether this affects the critical path
5. Recommended actions

Return JSON:
{{
  "task_update": {{
    "task_id": "string",
    "previous_status": "string",
    "new_status": "string",
    "updated_at": "ISO timestamp"
  }},
  "impact_analysis": {{
    "affected_tasks": [
      {{
        "task_id": "string",
        "impact": "string",
        "action_needed": "string"
      }}
    ],
    "milestone_impact": [
      {{
        "milestone": "string",
        "original_date": "YYYY-MM-DD",
        "projected_date": "YYYY-MM-DD",
        "delay_days": number
      }}
    ],
    "critical_path_affected": boolean
  }},
  "project_metrics": {{
    "completion_percentage": number,
    "tasks_completed": number,
    "tasks_in_progress": number,
    "tasks_blocked": number,
    "tasks_not_started": number
  }},
  "recommendations": ["string"],
  "alerts": [
    {{
      "severity": "high|medium|low",
      "message": "string"
    }}
  ]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def calculate_completion_percentage(self, project_data: Dict) -> Dict:
        """
        Calculate project completion based on tasks, milestones, and phases
        """
        prompt = f"""Calculate completion metrics for this project:

{json.dumps(project_data, indent=2)}

Return detailed completion metrics in JSON:
{{
  "overall_completion": {{
    "percentage": number,
    "completed_tasks": number,
    "total_tasks": number,
    "completed_hours": number,
    "total_estimated_hours": number
  }},
  "by_phase": [
    {{
      "phase_name": "string",
      "completion_percentage": number,
      "status": "not_started|in_progress|completed"
    }}
  ],
  "by_priority": {{
    "high": {{
      "completed": number,
      "total": number,
      "percentage": number
    }},
    "medium": {{
      "completed": number,
      "total": number,
      "percentage": number
    }},
    "low": {{
      "completed": number,
      "total": number,
      "percentage": number
    }}
  }},
  "milestone_progress": [
    {{
      "milestone": "string",
      "completion_percentage": number,
      "status": "achieved|on_track|at_risk|missed"
    }}
  ],
  "velocity": {{
    "tasks_per_week": number,
    "hours_per_week": number,
    "trend": "increasing|stable|decreasing"
  }}
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def monitor_deadlines(self, project_data: Dict, current_date: Optional[str] = None) -> Dict:
        """
        Monitor deadlines and identify overdue or at-risk items
        """
        if not current_date:
            current_date = datetime.now().strftime("%Y-%m-%d")
        
        prompt = f"""Current Date: {current_date}

Project Data:
{json.dumps(project_data, indent=2)}

Analyze deadlines and return JSON:
{{
  "overdue_tasks": [
    {{
      "task_id": "string",
      "task_title": "string",
      "deadline": "YYYY-MM-DD",
      "days_overdue": number,
      "priority": "string",
      "impact": "string"
    }}
  ],
  "at_risk_tasks": [
    {{
      "task_id": "string",
      "task_title": "string",
      "deadline": "YYYY-MM-DD",
      "days_remaining": number,
      "completion_percentage": number,
      "risk_level": "high|medium|low",
      "reason": "string"
    }}
  ],
  "upcoming_deadlines": [
    {{
      "task_id": "string",
      "task_title": "string",
      "deadline": "YYYY-MM-DD",
      "days_remaining": number,
      "status": "string"
    }}
  ],
  "milestone_status": [
    {{
      "milestone": "string",
      "target_date": "YYYY-MM-DD",
      "status": "on_track|at_risk|delayed",
      "completion_percentage": number
    }}
  ],
  "overall_schedule_health": {{
    "status": "on_track|minor_delays|significant_delays|critical",
    "on_time_percentage": number,
    "average_delay_days": number
  }},
  "recommendations": ["string"]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def track_milestone_completion(self, milestone_name: str, project_data: Dict) -> Dict:
        """
        Track completion of a specific milestone
        """
        prompt = f"""Milestone: {milestone_name}

Project Data:
{json.dumps(project_data, indent=2)}

Analyze milestone completion:
{{
  "milestone": {{
    "name": "string",
    "target_date": "YYYY-MM-DD",
    "actual_completion_date": "YYYY-MM-DD or null",
    "status": "completed|in_progress|not_started"
  }},
  "completion_criteria": [
    {{
      "criterion": "string",
      "met": boolean,
      "evidence": "string"
    }}
  ],
  "associated_tasks": [
    {{
      "task_id": "string",
      "title": "string",
      "status": "string",
      "completion_percentage": number
    }}
  ],
  "completion_percentage": number,
  "blockers": ["string"],
  "next_steps": ["string"],
  "ready_to_mark_complete": boolean,
  "recommendation": "string"
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def identify_blockers(self, project_data: Dict) -> List[Dict]:
        """
        Identify blockers and bottlenecks in the project
        """
        prompt = f"""Analyze this project for blockers and bottlenecks:

{json.dumps(project_data, indent=2)}

Return JSON:
{{
  "blockers": [
    {{
      "blocker_id": "string",
      "type": "technical|resource|dependency|external",
      "description": "string",
      "affected_tasks": ["task_id"],
      "severity": "high|medium|low",
      "estimated_delay": "string",
      "resolution_strategies": ["string"],
      "owner": "string or null"
    }}
  ],
  "bottlenecks": [
    {{
      "type": "resource|skill|process",
      "description": "string",
      "impact": "string",
      "mitigation": "string"
    }}
  ],
  "dependencies_at_risk": [
    {{
      "dependency": "string",
      "risk": "string",
      "contingency_plan": "string"
    }}
  ]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def generate_burndown_data(self, project_data: Dict, historical_data: Optional[List] = None) -> Dict:
        """
        Generate burndown chart data
        """
        prompt = f"""Generate burndown chart data for this project:

{json.dumps(project_data, indent=2)}

Historical Data:
{json.dumps(historical_data or [], indent=2)}

Return JSON:
{{
  "burndown": {{
    "total_tasks": number,
    "total_hours": number,
    "data_points": [
      {{
        "date": "YYYY-MM-DD",
        "remaining_tasks": number,
        "remaining_hours": number,
        "completed_tasks": number,
        "completed_hours": number
      }}
    ],
    "ideal_line": [
      {{
        "date": "YYYY-MM-DD",
        "ideal_remaining": number
      }}
    ],
    "projected_completion_date": "YYYY-MM-DD",
    "on_track": boolean,
    "variance_percentage": number
  }}
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def _parse_json_response(self, text: str) -> Dict:
        """Extract and parse JSON from Claude's response"""
        try:
            start_idx = text.find('{')
            end_idx = text.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = text[start_idx:end_idx]
                return json.loads(json_str)
        except Exception as e:
            print(f"Error parsing JSON: {e}")
        
        return {"raw_response": text, "error": "Failed to parse JSON"}