"""
Tools Module
Utility functions for date/time calculations, data formatting, and helpers
"""
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import json
import re

class DateTimeTools:
    """Date and time utility functions"""
    
    @staticmethod
    def parse_date(date_str: str) -> datetime:
        """Parse date string to datetime object"""
        formats = [
            "%Y-%m-%d",
            "%Y/%m/%d",
            "%d-%m-%Y",
            "%d/%m/%Y",
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%dT%H:%M:%S"
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        raise ValueError(f"Unable to parse date: {date_str}")
    
    @staticmethod
    def format_date(date_obj: datetime, format_str: str = "%Y-%m-%d") -> str:
        """Format datetime object to string"""
        return date_obj.strftime(format_str)
    
    @staticmethod
    def add_days(date_str: str, days: int) -> str:
        """Add days to a date"""
        date_obj = DateTimeTools.parse_date(date_str)
        new_date = date_obj + timedelta(days=days)
        return DateTimeTools.format_date(new_date)
    
    @staticmethod
    def add_weeks(date_str: str, weeks: int) -> str:
        """Add weeks to a date"""
        return DateTimeTools.add_days(date_str, weeks * 7)
    
    @staticmethod
    def calculate_business_days(start_date: str, end_date: str) -> int:
        """Calculate business days between two dates (excluding weekends)"""
        start = DateTimeTools.parse_date(start_date)
        end = DateTimeTools.parse_date(end_date)
        
        business_days = 0
        current = start
        
        while current <= end:
            if current.weekday() < 5:  # Monday = 0, Friday = 4
                business_days += 1
            current += timedelta(days=1)
        
        return business_days
    
    @staticmethod
    def get_date_range(start_date: str, end_date: str) -> List[str]:
        """Get list of dates between start and end"""
        start = DateTimeTools.parse_date(start_date)
        end = DateTimeTools.parse_date(end_date)
        
        dates = []
        current = start
        
        while current <= end:
            dates.append(DateTimeTools.format_date(current))
            current += timedelta(days=1)
        
        return dates
    
    @staticmethod
    def is_overdue(deadline: str, current_date: Optional[str] = None) -> bool:
        """Check if a deadline is overdue"""
        if not current_date:
            current_date = datetime.now().strftime("%Y-%m-%d")
        
        deadline_dt = DateTimeTools.parse_date(deadline)
        current_dt = DateTimeTools.parse_date(current_date)
        
        return current_dt > deadline_dt
    
    @staticmethod
    def days_until(target_date: str, from_date: Optional[str] = None) -> int:
        """Calculate days until target date"""
        if not from_date:
            from_date = datetime.now().strftime("%Y-%m-%d")
        
        target = DateTimeTools.parse_date(target_date)
        current = DateTimeTools.parse_date(from_date)
        
        delta = target - current
        return delta.days
    
    @staticmethod
    def weeks_until(target_date: str, from_date: Optional[str] = None) -> float:
        """Calculate weeks until target date"""
        days = DateTimeTools.days_until(target_date, from_date)
        return days / 7.0


class DataFormatter:
    """Data formatting utilities"""
    
    @staticmethod
    def format_percentage(value: float, decimals: int = 1) -> str:
        """Format number as percentage"""
        return f"{value:.{decimals}f}%"
    
    @staticmethod
    def format_hours(hours: float) -> str:
        """Format hours in readable format"""
        if hours < 1:
            return f"{int(hours * 60)} minutes"
        elif hours < 8:
            return f"{hours:.1f} hours"
        else:
            days = hours / 8
            return f"{days:.1f} days ({hours:.0f} hours)"
    
    @staticmethod
    def format_currency(amount: float, currency: str = "USD") -> str:
        """Format currency"""
        symbols = {"USD": "$", "EUR": "€", "GBP": "£"}
        symbol = symbols.get(currency, currency)
        return f"{symbol}{amount:,.2f}"
    
    @staticmethod
    def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
        """Truncate text to max length"""
        if len(text) <= max_length:
            return text
        return text[:max_length - len(suffix)] + suffix
    
    @staticmethod
    def format_list(items: List[str], max_items: int = 5) -> str:
        """Format list with ellipsis if too long"""
        if len(items) <= max_items:
            return ", ".join(items)
        
        visible = items[:max_items]
        remaining = len(items) - max_items
        return f"{', '.join(visible)}, and {remaining} more"
    
    @staticmethod
    def pretty_json(data: Dict) -> str:
        """Pretty print JSON"""
        return json.dumps(data, indent=2, sort_keys=True)


class ValidationTools:
    """Validation utilities"""
    
    @staticmethod
    def validate_status(status: str) -> bool:
        """Validate task status"""
        valid_statuses = ["not_started", "in_progress", "completed", "blocked", "at_risk"]
        return status.lower() in valid_statuses
    
    @staticmethod
    def validate_priority(priority: str) -> bool:
        """Validate priority level"""
        valid_priorities = ["high", "medium", "low"]
        return priority.lower() in valid_priorities
    
    @staticmethod
    def validate_date_format(date_str: str) -> bool:
        """Validate date format"""
        try:
            DateTimeTools.parse_date(date_str)
            return True
        except ValueError:
            return False
    
    @staticmethod
    def validate_percentage(value: float) -> bool:
        """Validate percentage value"""
        return 0 <= value <= 100
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None


class CalculationTools:
    """Calculation utilities"""
    
    @staticmethod
    def calculate_completion_percentage(completed: int, total: int) -> float:
        """Calculate completion percentage"""
        if total == 0:
            return 0.0
        return round((completed / total) * 100, 1)
    
    @staticmethod
    def calculate_variance(actual: float, planned: float) -> float:
        """Calculate variance (actual - planned)"""
        return actual - planned
    
    @staticmethod
    def calculate_variance_percentage(actual: float, planned: float) -> float:
        """Calculate variance as percentage"""
        if planned == 0:
            return 0.0
        return round(((actual - planned) / planned) * 100, 1)
    
    @staticmethod
    def calculate_velocity(tasks_completed: int, time_period_days: int) -> float:
        """Calculate velocity (tasks per week)"""
        if time_period_days == 0:
            return 0.0
        weeks = time_period_days / 7
        return round(tasks_completed / weeks, 2) if weeks > 0 else 0.0
    
    @staticmethod
    def calculate_burn_rate(hours_spent: float, days_elapsed: int) -> float:
        """Calculate burn rate (hours per day)"""
        if days_elapsed == 0:
            return 0.0
        return round(hours_spent / days_elapsed, 2)
    
    @staticmethod
    def estimate_remaining_time(total_hours: float, hours_completed: float, 
                               burn_rate: float) -> float:
        """Estimate remaining days based on burn rate"""
        if burn_rate == 0:
            return 0.0
        remaining_hours = total_hours - hours_completed
        return round(remaining_hours / burn_rate, 1)
    
    @staticmethod
    def calculate_critical_path_slack(task_duration: float, available_time: float) -> float:
        """Calculate slack time for critical path"""
        return available_time - task_duration
    
    @staticmethod
    def calculate_risk_score(probability: str, impact: str) -> int:
        """Calculate risk score from probability and impact"""
        prob_values = {"low": 1, "medium": 2, "high": 3}
        impact_values = {"low": 1, "medium": 2, "high": 3}
        
        prob = prob_values.get(probability.lower(), 2)
        imp = impact_values.get(impact.lower(), 2)
        
        return prob * imp


class DataStructureHelpers:
    """Data structure manipulation helpers"""
    
    @staticmethod
    def flatten_list(nested_list: List[Any]) -> List[Any]:
        """Flatten nested list"""
        result = []
        for item in nested_list:
            if isinstance(item, list):
                result.extend(DataStructureHelpers.flatten_list(item))
            else:
                result.append(item)
        return result
    
    @staticmethod
    def group_by(items: List[Dict], key: str) -> Dict[str, List[Dict]]:
        """Group list of dicts by key"""
        grouped = {}
        for item in items:
            group_key = item.get(key)
            if group_key not in grouped:
                grouped[group_key] = []
            grouped[group_key].append(item)
        return grouped
    
    @staticmethod
    def sort_by_priority(tasks: List[Dict]) -> List[Dict]:
        """Sort tasks by priority (high > medium > low)"""
        priority_order = {"high": 1, "medium": 2, "low": 3}
        return sorted(tasks, key=lambda x: priority_order.get(x.get("priority", "low"), 3))
    
    @staticmethod
    def filter_by_status(items: List[Dict], status: str) -> List[Dict]:
        """Filter items by status"""
        return [item for item in items if item.get("status") == status]
    
    @staticmethod
    def extract_field(items: List[Dict], field: str) -> List[Any]:
        """Extract specific field from list of dicts"""
        return [item.get(field) for item in items if field in item]
    
    @staticmethod
    def merge_dicts(dict1: Dict, dict2: Dict) -> Dict:
        """Merge two dictionaries (dict2 overwrites dict1)"""
        merged = dict1.copy()
        merged.update(dict2)
        return merged


class IDGenerator:
    """ID generation utilities"""
    
    @staticmethod
    def generate_task_id(prefix: str = "task") -> str:
        """Generate unique task ID"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return f"{prefix}_{timestamp}"
    
    @staticmethod
    def generate_project_id(prefix: str = "proj") -> str:
        """Generate unique project ID"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return f"{prefix}_{timestamp}"
    
    @staticmethod
    def generate_milestone_id(prefix: str = "milestone") -> str:
        """Generate unique milestone ID"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return f"{prefix}_{timestamp}"


# Export all tools
__all__ = [
    'DateTimeTools',
    'DataFormatter',
    'ValidationTools',
    'CalculationTools',
    'DataStructureHelpers',
    'IDGenerator'
]