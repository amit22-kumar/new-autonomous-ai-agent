"""
Executor Module
Coordinates task execution and handles user requests
"""
from anthropic import Anthropic
from typing import Dict, List, Optional
import json

class TaskExecutor:
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
        
    def parse_user_intent(self, user_message: str, project_context: Optional[Dict] = None) -> Dict:
        """
        Parse user message to determine intent and required action
        """
        context_str = ""
        if project_context:
            context_str = f"\n\nCurrent Project Context:\n{json.dumps(project_context, indent=2)}"
        
        prompt = f"""Analyze this user request and determine the intent:

User Message: "{user_message}"{context_str}

Classify the intent and extract parameters:
{{
  "intent": "create_project|update_task|view_status|generate_report|create_timeline|track_progress|identify_risks|ask_question|other",
  "confidence": number,
  "entities": {{
    "project_id": "string or null",
    "task_id": "string or null",
    "milestone_name": "string or null",
    "date": "string or null",
    "status": "string or null"
  }},
  "required_action": "string",
  "parameters": {{}},
  "clarification_needed": boolean,
  "clarification_questions": ["string"]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def execute_command(self, command: Dict, project_data: Optional[Dict] = None) -> Dict:
        """
        Execute a specific command based on parsed intent
        """
        intent = command.get("intent")
        parameters = command.get("parameters", {})
        
        result = {
            "command": intent,
            "status": "pending",
            "result": None,
            "message": ""
        }
        
        try:
            if intent == "create_project":
                result["result"] = self._handle_create_project(parameters)
                result["status"] = "success"
                result["message"] = "Project creation initiated"
                
            elif intent == "update_task":
                result["result"] = self._handle_update_task(parameters, project_data)
                result["status"] = "success"
                result["message"] = "Task updated successfully"
                
            elif intent == "view_status":
                result["result"] = self._handle_view_status(project_data)
                result["status"] = "success"
                result["message"] = "Status retrieved"
                
            elif intent == "generate_report":
                result["result"] = self._handle_generate_report(parameters, project_data)
                result["status"] = "success"
                result["message"] = "Report generated"
                
            elif intent == "track_progress":
                result["result"] = self._handle_track_progress(project_data)
                result["status"] = "success"
                result["message"] = "Progress tracked"
                
            else:
                result["status"] = "unsupported"
                result["message"] = f"Intent '{intent}' not yet implemented"
                
        except Exception as e:
            result["status"] = "error"
            result["message"] = str(e)
        
        return result
    
    def validate_task_dependencies(self, task_id: str, project_data: Dict) -> Dict:
        """
        Validate if a task's dependencies are met before execution
        """
        prompt = f"""Validate dependencies for task: {task_id}

Project Data:
{json.dumps(project_data, indent=2)}

Check:
{{
  "task_id": "string",
  "can_start": boolean,
  "dependencies_met": [
    {{
      "dependency_id": "string",
      "dependency_name": "string",
      "status": "met|not_met",
      "blocker": boolean
    }}
  ],
  "missing_prerequisites": ["string"],
  "ready_to_execute": boolean,
  "blocking_reason": "string or null",
  "recommended_action": "string"
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def suggest_next_tasks(self, project_data: Dict, team_capacity: Optional[Dict] = None) -> List[Dict]:
        """
        Suggest which tasks should be worked on next
        """
        capacity_str = ""
        if team_capacity:
            capacity_str = f"\n\nTeam Capacity:\n{json.dumps(team_capacity, indent=2)}"
        
        prompt = f"""Suggest next tasks to work on:

Project Data:
{json.dumps(project_data, indent=2)}{capacity_str}

Prioritize based on:
- Dependencies (tasks whose prerequisites are complete)
- Critical path items
- Priority levels
- Deadlines
- Resource availability

Return JSON:
{{
  "recommended_tasks": [
    {{
      "task_id": "string",
      "title": "string",
      "priority": "high|medium|low",
      "reason": "string",
      "estimated_hours": number,
      "suggested_assignee": "string or null",
      "deadline": "YYYY-MM-DD",
      "dependencies_met": boolean,
      "on_critical_path": boolean
    }}
  ],
  "parallel_opportunities": [
    {{
      "tasks": ["task_id"],
      "description": "string",
      "total_hours": number
    }}
  ],
  "blocked_tasks": [
    {{
      "task_id": "string",
      "title": "string",
      "blocker": "string",
      "action_to_unblock": "string"
    }}
  ],
  "prioritization_rationale": "string"
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def handle_scope_change(self, change_request: Dict, project_data: Dict) -> Dict:
        """
        Handle scope change requests and assess impact
        """
        prompt = f"""Scope Change Request:
{json.dumps(change_request, indent=2)}

Current Project:
{json.dumps(project_data, indent=2)}

Analyze impact:
{{
  "change_summary": "string",
  "impact_analysis": {{
    "schedule_impact": {{
      "additional_days": number,
      "new_end_date": "YYYY-MM-DD",
      "affected_milestones": ["string"]
    }},
    "resource_impact": {{
      "additional_hours": number,
      "additional_team_members": number,
      "new_skills_required": ["string"]
    }},
    "budget_impact": {{
      "estimated_additional_cost": "string",
      "cost_categories": ["string"]
    }},
    "risk_impact": {{
      "new_risks": ["string"],
      "risk_level_change": "increased|decreased|unchanged"
    }}
  }},
  "affected_components": [
    {{
      "component": "string",
      "impact_description": "string",
      "requires_rework": boolean
    }}
  ],
  "recommendation": "approve|reject|modify",
  "recommendation_rationale": "string",
  "mitigation_strategies": ["string"],
  "alternative_approaches": ["string"]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    def coordinate_team_assignment(self, task_id: str, available_team: List[Dict], project_data: Dict) -> Dict:
        """
        Suggest best team member assignment for a task
        """
        prompt = f"""Task to Assign: {task_id}

Available Team:
{json.dumps(available_team, indent=2)}

Project Context:
{json.dumps(project_data, indent=2)}

Recommend assignment:
{{
  "recommended_assignee": {{
    "name": "string",
    "reason": "string",
    "skill_match": "excellent|good|adequate",
    "availability": number,
    "current_workload": "light|moderate|heavy"
  }},
  "alternative_assignees": [
    {{
      "name": "string",
      "reason": "string",
      "considerations": "string"
    }}
  ],
  "collaboration_suggestions": [
    {{
      "members": ["string"],
      "approach": "string",
      "rationale": "string"
    }}
  ],
  "skill_gaps": ["string"],
  "training_needs": ["string"]
}}"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self._parse_json_response(response.content[0].text)
    
    # Internal helper methods
    def _handle_create_project(self, parameters: Dict) -> Dict:
        return {"action": "create_project", "parameters": parameters}
    
    def _handle_update_task(self, parameters: Dict, project_data: Dict) -> Dict:
        return {"action": "update_task", "parameters": parameters}
    
    def _handle_view_status(self, project_data: Dict) -> Dict:
        return {"action": "view_status", "data": project_data}
    
    def _handle_generate_report(self, parameters: Dict, project_data: Dict) -> Dict:
        return {"action": "generate_report", "parameters": parameters}
    
    def _handle_track_progress(self, project_data: Dict) -> Dict:
        return {"action": "track_progress", "data": project_data}
    
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