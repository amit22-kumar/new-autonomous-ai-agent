"""
Summarizer Module
Summarizes project data and creates executive summaries
"""
from anthropic import Anthropic
from typing import Dict, List, Optional
import json

class ProjectSummarizer:
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
        
    def summarize_project_status(self, project_data: Dict, audience: str = "team") -> str:
        """
        Create a summary tailored to specific audience
        audience: team, executive, stakeholder, technical
        """
        prompt = f"""Create a {audience}-focused summary of this project:

{json.dumps(project_data, indent=2)}

Tailor the summary for {audience} audience:
- Team: Focus on tasks, progress, blockers, next steps
- Executive: Focus on high-level status, risks, budget, timeline
- Stakeholder: Focus on deliverables, milestones, business value
- Technical: Focus on technical details, architecture, technical debt

Provide a clear, concise summary (2-3 paragraphs) that addresses their primary concerns."""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def aggregate_metrics(self, project_data: Dict) -> Dict:
        """
        Aggregate key metrics from project data
        """
        prompt = f"""Aggregate key metrics from this project:

{json.dumps(project_data, indent=2)}

Return comprehensive metrics:
{{
  "summary_metrics": {{
    "total_tasks": number,
    "completed_tasks": number,
    "in_progress_tasks": number,
    "blocked_tasks": number,
    "completion_percentage": number,
    "total_estimated_hours": number,
    "hours_completed": number,
    "hours_remaining": number,
    "total_phases": number,
    "completed_phases": number,
    "total_milestones": number,
    "achieved_milestones": number
  }},
  "timeline_metrics": {{
    "project_start_date": "YYYY-MM-DD",
    "current_date": "YYYY-MM-DD",
    "planned_end_date": "YYYY-MM-DD",
    "projected_end_date": "YYYY-MM-DD",
    "elapsed_days": number,
    "remaining_days": number,
    "schedule_variance_days": number,
    "on_schedule": boolean
  }},
  "performance_metrics": {{
    "tasks_completed_per_week": number,
    "average_task_completion_time": number,
    "velocity_trend": "increasing|stable|decreasing",
    "efficiency_score": number
  }},
  "quality_metrics": {{
    "tasks_completed_on_time": number,
    "tasks_completed_late": number,
    "rework_percentage": number,
    "quality_score": number
  }},
  "risk_metrics": {{
    "total_risks": number,
    "high_priority_risks": number,
    "medium_priority_risks": number,
    "low_priority_risks": number,
    "overall_risk_level": "low|medium|high|critical"
  }},
  "resource_metrics": {{
    "team_size": number,
    "team_utilization_percentage": number,
    "overtime_hours": number,
    "resource_constraints": number
  }}
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def create_executive_brief(self, project_data: Dict, max_length: int = 250) -> str:
        """
        Create a very brief executive summary (elevator pitch style)
        """
        prompt = f"""Create a brief executive summary (max {max_length} words) for:

{json.dumps(project_data, indent=2)}

The summary should be suitable for a quick elevator pitch or email. Include:
1. Project name and goal
2. Current status (one sentence)
3. Key achievement or concern
4. Next critical milestone
5. Overall health indicator

Keep it concise, clear, and actionable."""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def summarize_phase(self, phase_name: str, project_data: Dict) -> Dict:
        """
        Summarize a specific project phase
        """
        prompt = f"""Summarize the phase: {phase_name}

Project Data:
{json.dumps(project_data, indent=2)}

Return JSON:
{{
  "phase_summary": {{
    "phase_name": "string",
    "status": "not_started|in_progress|completed",
    "completion_percentage": number,
    "start_date": "YYYY-MM-DD or null",
    "end_date": "YYYY-MM-DD or null",
    "duration_weeks": number,
    "overview": "string (2-3 sentences)"
  }},
  "tasks": {{
    "total": number,
    "completed": number,
    "in_progress": number,
    "not_started": number,
    "blocked": number
  }},
  "milestones": [
    {{
      "name": "string",
      "status": "achieved|pending|at_risk",
      "date": "YYYY-MM-DD"
    }}
  ],
  "key_deliverables": [
    {{
      "deliverable": "string",
      "status": "completed|in_progress|not_started",
      "quality": "excellent|good|needs_improvement"
    }}
  ],
  "challenges": ["string"],
  "achievements": ["string"],
  "next_steps": ["string"],
  "health_indicator": "green|yellow|red"
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def compare_progress_over_time(self, historical_data: List[Dict]) -> Dict:
        """
        Compare project progress over time using historical snapshots
        """
        prompt = f"""Analyze progress over time from these snapshots:

{json.dumps(historical_data, indent=2)}

Return comparison analysis:
{{
  "trend_analysis": {{
    "overall_trend": "accelerating|steady|slowing|stalled",
    "completion_rate_trend": "improving|stable|declining",
    "velocity_trend": "increasing|stable|decreasing"
  }},
  "period_comparisons": [
    {{
      "period": "string",
      "tasks_completed": number,
      "completion_percentage": number,
      "velocity": number,
      "issues_encountered": number
    }}
  ],
  "notable_changes": [
    {{
      "change": "string",
      "date": "YYYY-MM-DD",
      "impact": "positive|negative|neutral",
      "description": "string"
    }}
  ],
  "predictions": {{
    "projected_completion_date": "YYYY-MM-DD",
    "confidence": "high|medium|low",
    "based_on": "string"
  }},
  "recommendations": ["string"]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def generate_highlights(self, project_data: Dict, period: str = "this_week") -> List[str]:
        """
        Generate key highlights for a time period
        """
        prompt = f"""Generate key highlights for {period}:

{json.dumps(project_data, indent=2)}

Return JSON:
{{
  "highlights": [
    {{
      "type": "achievement|milestone|completion|issue|risk",
      "title": "string",
      "description": "string (one sentence)",
      "importance": "high|medium|low"
    }}
  ],
  "top_3_achievements": ["string"],
  "top_3_concerns": ["string"],
  "key_decisions_made": ["string"],
  "upcoming_focus_areas": ["string"]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def create_stakeholder_update(self, project_data: Dict, stakeholder_interests: List[str]) -> str:
        """
        Create an update tailored to stakeholder interests
        """
        interests_str = ", ".join(stakeholder_interests)
        
        prompt = f"""Create a stakeholder update focusing on: {interests_str}

Project Data:
{json.dumps(project_data, indent=2)}

Write a professional update (3-4 paragraphs) that:
1. Addresses stakeholder interests directly
2. Provides relevant metrics and evidence
3. Highlights business value delivered
4. Discusses any concerns transparently
5. Outlines next steps and expectations

Tone: Professional, transparent, solution-oriented"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def summarize_team_performance(self, project_data: Dict, team_data: Optional[Dict] = None) -> Dict:
        """
        Summarize team performance and contributions
        """
        team_str = ""
        if team_data:
            team_str = f"\n\nTeam Data:\n{json.dumps(team_data, indent=2)}"
        
        prompt = f"""Summarize team performance:

Project Data:
{json.dumps(project_data, indent=2)}{team_str}

Return JSON:
{{
  "team_performance": {{
    "overall_rating": "excellent|good|satisfactory|needs_improvement",
    "productivity_level": "high|medium|low",
    "collaboration_quality": "excellent|good|needs_improvement",
    "velocity": number,
    "velocity_trend": "increasing|stable|decreasing"
  }},
  "individual_contributions": [
    {{
      "member": "string",
      "tasks_completed": number,
      "contribution_level": "high|medium|low",
      "key_achievements": ["string"],
      "areas_for_growth": ["string"]
    }}
  ],
  "team_strengths": ["string"],
  "team_challenges": ["string"],
  "morale_indicators": {{
    "estimated_morale": "high|medium|low",
    "indicators": ["string"]
  }},
  "recommendations": ["string"]
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