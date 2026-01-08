"""
Planner Module
Breaks down project goals into milestones, tasks, and timelines
"""
from anthropic import Anthropic
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import json

class ProjectPlanner:
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
        
    def break_down_goals(self, project_goal: str, constraints: Optional[Dict] = None) -> Dict:
        """
        Break down high-level project goals into phases, milestones, and tasks
        """
        constraint_text = ""
        if constraints:
            constraint_text = f"\n\nConstraints:\n{json.dumps(constraints, indent=2)}"
        
        prompt = f"""You are a project planning expert. Break down the following project goal into a detailed plan:

Project Goal: {project_goal}{constraint_text}

Provide a comprehensive breakdown including:
1. Project phases (3-6 major phases)
2. Milestones for each phase
3. Detailed tasks with:
   - Clear, actionable descriptions
   - Priority levels (high/medium/low)
   - Estimated effort in hours
   - Dependencies on other tasks
   - Skills/resources required

Format your response as JSON:
{{
  "project_name": "string",
  "total_estimated_weeks": number,
  "phases": [
    {{
      "phase_number": number,
      "name": "string",
      "description": "string",
      "duration_weeks": number,
      "milestones": [
        {{
          "name": "string",
          "description": "string",
          "target_week": number,
          "success_criteria": ["string"]
        }}
      ],
      "tasks": [
        {{
          "task_id": "string",
          "title": "string",
          "description": "string",
          "priority": "high|medium|low",
          "estimated_hours": number,
          "dependencies": ["task_id"],
          "required_skills": ["string"],
          "deliverables": ["string"]
        }}
      ]
    }}
  ],
  "critical_path": ["task_id"],
  "key_risks": ["string"],
  "resource_requirements": {{
    "team_size": number,
    "key_roles": ["string"]
  }}
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def create_timeline(self, project_plan: Dict, start_date: Optional[str] = None) -> Dict:
        """
        Create a detailed timeline with dates from the project plan
        """
        if not start_date:
            start_date = datetime.now().strftime("%Y-%m-%d")
        
        prompt = f"""Given this project plan and start date {start_date}, create a detailed timeline:

{json.dumps(project_plan, indent=2)}

Generate a timeline in JSON format:
{{
  "project_timeline": {{
    "start_date": "{start_date}",
    "end_date": "YYYY-MM-DD",
    "total_weeks": number,
    "phases": [
      {{
        "phase_name": "string",
        "start_date": "YYYY-MM-DD",
        "end_date": "YYYY-MM-DD",
        "milestones": [
          {{
            "name": "string",
            "target_date": "YYYY-MM-DD",
            "buffer_days": number
          }}
        ],
        "tasks": [
          {{
            "task_id": "string",
            "title": "string",
            "start_date": "YYYY-MM-DD",
            "end_date": "YYYY-MM-DD",
            "duration_days": number
          }}
        ]
      }}
    ],
    "critical_milestones": [
      {{
        "name": "string",
        "date": "YYYY-MM-DD",
        "importance": "string"
      }}
    ]
  }}
}}

Ensure tasks are scheduled considering:
- Dependencies (dependent tasks start after prerequisites)
- Resource availability (don't overload parallel tasks)
- Buffer time for high-risk tasks (add 20% buffer)"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=6000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def estimate_resources(self, project_plan: Dict) -> Dict:
        """
        Estimate required resources, effort, and team composition
        """
        prompt = f"""Analyze this project plan and provide resource estimates:

{json.dumps(project_plan, indent=2)}

Provide estimates in JSON format:
{{
  "effort_summary": {{
    "total_hours": number,
    "total_weeks": number,
    "phases": [
      {{
        "phase_name": "string",
        "hours": number,
        "weeks": number
      }}
    ]
  }},
  "team_requirements": {{
    "recommended_team_size": number,
    "roles": [
      {{
        "role": "string",
        "count": number,
        "skills": ["string"],
        "allocation_percentage": number
      }}
    ]
  }},
  "budget_estimate": {{
    "hours_by_priority": {{
      "high": number,
      "medium": number,
      "low": number
    }},
    "phases": [
      {{
        "phase_name": "string",
        "hours": number
      }}
    ]
  }},
  "risks": [
    {{
      "risk": "string",
      "impact": "high|medium|low",
      "mitigation": "string"
    }}
  ]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def adjust_timeline(self, current_plan: Dict, adjustments: Dict) -> Dict:
        """
        Adjust timeline based on changes (delays, scope changes, resource changes)
        """
        prompt = f"""Current project plan:
{json.dumps(current_plan, indent=2)}

Requested adjustments:
{json.dumps(adjustments, indent=2)}

Create an updated timeline that accommodates these changes while:
- Maintaining critical dependencies
- Identifying new risks introduced by changes
- Suggesting mitigation strategies
- Recalculating end dates and milestones

Return updated plan in the same JSON structure as the original."""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=6000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def identify_critical_path(self, project_plan: Dict) -> List[str]:
        """
        Identify the critical path through the project
        """
        prompt = f"""Analyze this project plan and identify the critical path:

{json.dumps(project_plan, indent=2)}

Return JSON:
{{
  "critical_path": [
    {{
      "task_id": "string",
      "task_title": "string",
      "reason": "string",
      "impact_if_delayed": "string"
    }}
  ],
  "parallel_opportunities": [
    {{
      "tasks": ["task_id"],
      "description": "string"
    }}
  ],
  "bottlenecks": ["string"]
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
            # Find JSON in the response
            start_idx = text.find('{')
            end_idx = text.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = text[start_idx:end_idx]
                return json.loads(json_str)
        except Exception as e:
            print(f"Error parsing JSON: {e}")
        
        return {"raw_response": text, "error": "Failed to parse JSON"}