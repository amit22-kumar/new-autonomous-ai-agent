"""
Report Generator Module
Generates comprehensive project status reports
"""
from anthropic import Anthropic
from typing import Dict, List, Optional
from datetime import datetime
import json

class ReportGenerator:
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
        
    def generate_status_report(self, project_data: Dict, report_type: str = "weekly") -> str:
        """
        Generate a comprehensive status report
        report_type: weekly, monthly, executive, detailed
        """
        prompt = f"""Generate a {report_type} project status report for:

{json.dumps(project_data, indent=2)}

Create a professional, well-structured report with:

# PROJECT STATUS REPORT
**Report Date:** {datetime.now().strftime("%Y-%m-%d")}
**Report Type:** {report_type.title()}

## EXECUTIVE SUMMARY
- One paragraph overview of project status
- Key achievements this period
- Major concerns or blockers
- Overall health indicator (Green/Yellow/Red)

## PROJECT OVERVIEW
- Project name and description
- Timeline: Start date, current date, end date
- Overall completion percentage
- Budget status (if available)

## PROGRESS UPDATE
### Completed This Period
- List major accomplishments
- Milestones achieved

### In Progress
- Current activities
- Expected completion dates

### Upcoming
- Next major tasks
- Upcoming milestones

## METRICS & KPIs
- Tasks completed: X/Y (Z%)
- Hours spent: X/Y (Z%)
- Milestones achieved: X/Y
- Average task completion rate
- Schedule variance
- Velocity trend

## PHASE STATUS
For each phase:
- Phase name and status
- Completion percentage
- Key deliverables status

## RISKS & ISSUES
### Active Blockers
- List each blocker with severity and mitigation plan

### Identified Risks
- Risk description, probability, impact, mitigation

### Dependencies
- External dependencies and their status

## RESOURCE UTILIZATION
- Team member allocation
- Resource constraints
- Skills gaps

## SCHEDULE ANALYSIS
- On-time tasks: X%
- Delayed tasks: Y
- Average delay: Z days
- Critical path status

## QUALITY METRICS (if applicable)
- Defects/issues found
- Test coverage
- Code review status

## RECOMMENDATIONS
- Immediate actions needed
- Process improvements
- Resource adjustments

## NEXT PERIOD GOALS
- Key objectives for next period
- Expected deliverables
- Milestones to achieve

## APPENDIX
- Detailed task list with statuses
- Timeline/Gantt chart data

Format the report in clear, professional markdown."""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def generate_executive_summary(self, project_data: Dict) -> Dict:
        """
        Generate a brief executive summary
        """
        prompt = f"""Create a concise executive summary for:

{json.dumps(project_data, indent=2)}

Return JSON:
{{
  "executive_summary": {{
    "project_name": "string",
    "overall_status": "on_track|at_risk|delayed|critical",
    "health_indicator": "green|yellow|red",
    "completion_percentage": number,
    "key_achievements": ["string (max 3)"],
    "major_concerns": ["string (max 3)"],
    "next_milestone": {{
      "name": "string",
      "date": "YYYY-MM-DD",
      "confidence": "high|medium|low"
    }},
    "resource_status": "adequate|constrained|critical",
    "budget_status": "on_budget|over_budget|under_budget",
    "recommendation": "continue|adjust|escalate",
    "executive_message": "One paragraph summary for leadership"
  }}
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def identify_risks_and_bottlenecks(self, project_data: Dict) -> Dict:
        """
        Identify and analyze project risks and bottlenecks
        """
        prompt = f"""Analyze risks and bottlenecks for:

{json.dumps(project_data, indent=2)}

Return comprehensive risk analysis:
{{
  "risk_summary": {{
    "overall_risk_level": "low|medium|high|critical",
    "total_risks": number,
    "high_priority_risks": number
  }},
  "risks": [
    {{
      "risk_id": "string",
      "category": "schedule|resource|technical|external|quality",
      "description": "string",
      "probability": "low|medium|high",
      "impact": "low|medium|high",
      "risk_score": number,
      "mitigation_strategy": "string",
      "contingency_plan": "string",
      "owner": "string",
      "status": "identified|monitoring|mitigating|closed"
    }}
  ],
  "bottlenecks": [
    {{
      "type": "resource|skill|process|dependency",
      "description": "string",
      "affected_areas": ["string"],
      "impact_on_timeline": "string",
      "recommended_solution": "string"
    }}
  ],
  "dependencies": [
    {{
      "dependency": "string",
      "type": "internal|external",
      "status": "on_track|at_risk|blocked",
      "impact_if_delayed": "string"
    }}
  ],
  "red_flags": [
    {{
      "flag": "string",
      "severity": "high|medium|low",
      "recommended_action": "string",
      "urgency": "immediate|soon|monitor"
    }}
  ]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def create_progress_summary(self, project_data: Dict, time_period: str = "this_week") -> Dict:
        """
        Create a summary of progress for a specific time period
        """
        prompt = f"""Summarize progress for {time_period}:

{json.dumps(project_data, indent=2)}

Return JSON:
{{
  "period": "{time_period}",
  "summary": {{
    "tasks_completed": number,
    "tasks_started": number,
    "hours_logged": number,
    "milestones_achieved": number,
    "completion_percentage_change": number
  }},
  "highlights": [
    {{
      "type": "achievement|milestone|completion",
      "description": "string",
      "impact": "string"
    }}
  ],
  "challenges": [
    {{
      "challenge": "string",
      "impact": "string",
      "resolution": "string"
    }}
  ],
  "team_performance": {{
    "velocity": "increasing|stable|decreasing",
    "productivity_notes": "string",
    "morale_indicators": "string"
  }},
  "comparison_to_plan": {{
    "ahead_of_schedule": boolean,
    "variance_days": number,
    "on_track_percentage": number
  }},
  "next_period_outlook": "string"
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def generate_milestone_report(self, milestone_name: str, project_data: Dict) -> str:
        """
        Generate a detailed report for a specific milestone
        """
        prompt = f"""Generate a milestone completion report:

Milestone: {milestone_name}

Project Data:
{json.dumps(project_data, indent=2)}

Create a detailed milestone report in markdown:

# MILESTONE REPORT: [Milestone Name]

## Overview
- Milestone description
- Target date vs actual date
- Status: Achieved/In Progress/Missed

## Success Criteria
For each criterion:
- Criterion description
- Met: Yes/No
- Evidence/Notes

## Associated Deliverables
- List all deliverables
- Status of each
- Quality assessment

## Tasks Completed
- List of completed tasks
- Effort spent vs estimated
- Quality notes

## Challenges Encountered
- Describe challenges
- How they were overcome
- Lessons learned

## Impact on Project
- Schedule impact
- Budget impact
- Scope impact
- Quality impact

## Team Performance
- Team contributions
- Recognition
- Areas for improvement

## Next Steps
- Immediate actions
- Dependencies for next milestone
- Recommendations

## Metrics
- Tasks completed: X/Y
- Hours spent: X vs Y estimated
- Quality score: X/10
- Stakeholder satisfaction: X/10

## Lessons Learned
- What went well
- What could be improved
- Best practices identified"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def generate_metrics_dashboard(self, project_data: Dict) -> Dict:
        """
        Generate data for a metrics dashboard
        """
        prompt = f"""Generate dashboard metrics for:

{json.dumps(project_data, indent=2)}

Return comprehensive metrics:
{{
  "key_metrics": {{
    "overall_completion": number,
    "tasks_completed": number,
    "tasks_total": number,
    "hours_spent": number,
    "hours_estimated": number,
    "days_elapsed": number,
    "days_remaining": number,
    "budget_used_percentage": number
  }},
  "progress_indicators": {{
    "completion_trend": "accelerating|steady|slowing",
    "schedule_performance_index": number,
    "cost_performance_index": number,
    "velocity": number
  }},
  "health_indicators": {{
    "overall_health": "green|yellow|red",
    "schedule_health": "green|yellow|red",
    "resource_health": "green|yellow|red",
    "quality_health": "green|yellow|red",
    "risk_health": "green|yellow|red"
  }},
  "task_breakdown": {{
    "by_status": {{
      "not_started": number,
      "in_progress": number,
      "completed": number,
      "blocked": number
    }},
    "by_priority": {{
      "high": {{
        "total": number,
        "completed": number
      }},
      "medium": {{
        "total": number,
        "completed": number
      }},
      "low": {{
        "total": number,
        "completed": number
      }}
    }}
  }},
  "milestone_status": [
    {{
      "name": "string",
      "progress": number,
      "status": "achieved|on_track|at_risk|missed"
    }}
  ],
  "top_risks": [
    {{
      "risk": "string",
      "severity": "high|medium|low"
    }}
  ],
  "recent_activities": [
    {{
      "date": "YYYY-MM-DD",
      "activity": "string",
      "type": "completion|start|milestone|blocker"
    }}
  ]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
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