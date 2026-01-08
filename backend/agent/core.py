"""
Integrated Project Management Agent Core
Coordinates all modules: planner, tracker, report generator, executor, summarizer
"""
from anthropic import Anthropic
from typing import Dict, List, Optional
import json

# Import all modules
from .planner import ProjectPlanner
from .tracker import ProgressTracker
from .report_generator import ReportGenerator
from .executor import TaskExecutor
from .summarizer import ProjectSummarizer
from .tools import DateTimeTools, CalculationTools, DataFormatter

class ProjectManagementAgent:
    """
    Main Project Management Agent
    Orchestrates all components to provide comprehensive project management capabilities
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = Anthropic(api_key=api_key)
        
        # Initialize all modules
        self.planner = ProjectPlanner(api_key)
        self.tracker = ProgressTracker(api_key)
        self.report_generator = ReportGenerator(api_key)
        self.executor = TaskExecutor(api_key)
        self.summarizer = ProjectSummarizer(api_key)
        
        # Conversation history
        self.conversation_history = []
        self.current_project_id = None
        
        # System prompt
        self.system_prompt = """You are an expert Project Management AI Agent. You help users:

1. **Plan Projects**: Break down goals into phases, milestones, and actionable tasks
2. **Create Timelines**: Generate realistic schedules with dependencies and deadlines
3. **Track Progress**: Monitor task completion, calculate metrics, identify blockers
4. **Generate Reports**: Create comprehensive status reports for various audiences

**Your Capabilities:**
- Intelligent goal decomposition
- Resource estimation and planning
- Critical path analysis
- Risk identification and mitigation
- Progress monitoring and forecasting
- Executive summaries and detailed reports

**Communication Style:**
- Be clear, structured, and actionable
- Use data to support recommendations
- Proactively identify risks and opportunities
- Adapt your communication to the audience (team, executive, stakeholder)

**When Users Request:**
- Project creation → Generate detailed project plan with phases and tasks
- Status updates → Provide current metrics and health indicators
- Task updates → Analyze impact on timeline and dependencies
- Reports → Create appropriate format based on audience
- Recommendations → Provide data-driven suggestions

Always be proactive in identifying potential issues and suggesting solutions."""

    def chat(self, user_message: str, project_context: Optional[Dict] = None) -> Dict:
        """
        Main chat interface with context-aware responses
        """
        # Parse user intent
        intent_data = self.executor.parse_user_intent(user_message, project_context)
        intent = intent_data.get("intent")
        
        # Add context to message
        full_message = user_message
        if project_context:
            full_message += f"\n\n[Project Context Available]"
        
        # Add to conversation history
        self.conversation_history.append({
            "role": "user",
            "content": full_message
        })
        
        # Get response from Claude
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            system=self.system_prompt,
            messages=self.conversation_history
        )
        
        assistant_message = response.content[0].text
        
        # Add to history
        self.conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return {
            "response": assistant_message,
            "intent": intent,
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens
            }
        }
    
    # ==================== PROJECT PLANNING ====================
    
    def create_project(self, project_goal: str, constraints: Optional[Dict] = None) -> Dict:
        """
        Create a comprehensive project plan from a goal
        """
        # Use planner to break down goals
        project_plan = self.planner.break_down_goals(project_goal, constraints)
        
        # Create timeline
        timeline = self.planner.create_timeline(project_plan)
        
        # Estimate resources
        resources = self.planner.estimate_resources(project_plan)
        
        # Identify critical path
        critical_path = self.planner.identify_critical_path(project_plan)
        
        return {
            "project_plan": project_plan,
            "timeline": timeline,
            "resources": resources,
            "critical_path": critical_path
        }
    
    def update_project_plan(self, current_plan: Dict, adjustments: Dict) -> Dict:
        """
        Update project plan based on changes
        """
        return self.planner.adjust_timeline(current_plan, adjustments)
    
    # ==================== PROGRESS TRACKING ====================
    
    def update_task(self, task_id: str, status: str, project_data: Dict,
                   notes: Optional[str] = None, actual_hours: Optional[float] = None) -> Dict:
        """
        Update task status and get impact analysis
        """
        update_result = self.tracker.update_task_status(
            task_id, status, project_data, notes, actual_hours
        )
        
        # Get updated completion percentage
        completion = self.tracker.calculate_completion_percentage(project_data)
        
        return {
            "update_result": update_result,
            "completion_metrics": completion
        }
    
    def get_project_status(self, project_data: Dict) -> Dict:
        """
        Get comprehensive project status
        """
        # Calculate completion
        completion = self.tracker.calculate_completion_percentage(project_data)
        
        # Monitor deadlines
        deadline_status = self.tracker.monitor_deadlines(project_data)
        
        # Identify blockers
        blockers = self.tracker.identify_blockers(project_data)
        
        # Get summary
        summary = self.summarizer.aggregate_metrics(project_data)
        
        return {
            "completion": completion,
            "deadline_status": deadline_status,
            "blockers": blockers,
            "metrics": summary
        }
    
    def track_milestone(self, milestone_name: str, project_data: Dict) -> Dict:
        """
        Track specific milestone completion
        """
        return self.tracker.track_milestone_completion(milestone_name, project_data)
    
    # ==================== REPORT GENERATION ====================
    
    def generate_status_report(self, project_data: Dict, report_type: str = "weekly") -> str:
        """
        Generate comprehensive status report
        """
        return self.report_generator.generate_status_report(project_data, report_type)
    
    def generate_executive_summary(self, project_data: Dict) -> Dict:
        """
        Generate executive summary
        """
        return self.report_generator.generate_executive_summary(project_data)
    
    def generate_risk_report(self, project_data: Dict) -> Dict:
        """
        Generate risk and bottleneck analysis
        """
        return self.report_generator.identify_risks_and_bottlenecks(project_data)
    
    def generate_progress_summary(self, project_data: Dict, period: str = "this_week") -> Dict:
        """
        Generate progress summary for time period
        """
        return self.report_generator.create_progress_summary(project_data, period)
    
    def generate_milestone_report(self, milestone_name: str, project_data: Dict) -> str:
        """
        Generate milestone-specific report
        """
        return self.report_generator.generate_milestone_report(milestone_name, project_data)
    
    def get_dashboard_metrics(self, project_data: Dict) -> Dict:
        """
        Get metrics for dashboard visualization
        """
        return self.report_generator.generate_metrics_dashboard(project_data)
    
    # ==================== TASK EXECUTION ====================
    
    def suggest_next_tasks(self, project_data: Dict, team_capacity: Optional[Dict] = None) -> Dict:
        """
        Suggest which tasks to work on next
        """
        return self.executor.suggest_next_tasks(project_data, team_capacity)
    
    def validate_task_dependencies(self, task_id: str, project_data: Dict) -> Dict:
        """
        Validate if task can be started
        """
        return self.executor.validate_task_dependencies(task_id, project_data)
    
    def handle_scope_change(self, change_request: Dict, project_data: Dict) -> Dict:
        """
        Analyze scope change impact
        """
        return self.executor.handle_scope_change(change_request, project_data)
    
    def assign_task(self, task_id: str, available_team: List[Dict], project_data: Dict) -> Dict:
        """
        Suggest best team member for task
        """
        return self.executor.coordinate_team_assignment(task_id, available_team, project_data)
    
    # ==================== SUMMARIZATION ====================
    
    def summarize_for_audience(self, project_data: Dict, audience: str = "team") -> str:
        """
        Create audience-specific summary
        audience: team, executive, stakeholder, technical
        """
        return self.summarizer.summarize_project_status(project_data, audience)
    
    def get_quick_summary(self, project_data: Dict) -> str:
        """
        Get brief executive brief (elevator pitch)
        """
        return self.summarizer.create_executive_brief(project_data)
    
    def summarize_phase(self, phase_name: str, project_data: Dict) -> Dict:
        """
        Summarize specific project phase
        """
        return self.summarizer.summarize_phase(phase_name, project_data)
    
    def get_highlights(self, project_data: Dict, period: str = "this_week") -> Dict:
        """
        Get key highlights for period
        """
        return self.summarizer.generate_highlights(project_data, period)
    
    def create_stakeholder_update(self, project_data: Dict, 
                                  stakeholder_interests: List[str]) -> str:
        """
        Create tailored stakeholder update
        """
        return self.summarizer.create_stakeholder_update(project_data, stakeholder_interests)
    
    # ==================== ANALYTICS ====================
    
    def get_burndown_data(self, project_data: Dict, 
                         historical_data: Optional[List] = None) -> Dict:
        """
        Generate burndown chart data
        """
        return self.tracker.generate_burndown_data(project_data, historical_data)
    
    def compare_progress_over_time(self, historical_data: List[Dict]) -> Dict:
        """
        Compare project progress over time
        """
        return self.summarizer.compare_progress_over_time(historical_data)
    
    def analyze_team_performance(self, project_data: Dict, 
                                team_data: Optional[Dict] = None) -> Dict:
        """
        Analyze team performance
        """
        return self.summarizer.summarize_team_performance(project_data, team_data)
    
    # ==================== UTILITIES ====================
    
    def reset_conversation(self):
        """Reset conversation history"""
        self.conversation_history = []
        self.current_project_id = None
    
    def set_current_project(self, project_id: str):
        """Set current project context"""
        self.current_project_id = project_id
    
    def get_conversation_history(self) -> List[Dict]:
        """Get conversation history"""
        return self.conversation_history