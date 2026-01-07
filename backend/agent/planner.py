
import json
from typing import List, Dict, Any
import anthropic

class TaskPlanner:
    """
    Creates detailed execution plans from goal understanding
    """
    
    def __init__(self, client: anthropic.Anthropic):
        self.client = client
    
    def create_plan(self, goal_understanding: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate a step-by-step execution plan
        """
        system_prompt = """You are an expert task planner for a research agent.

Given a research goal, create a detailed step-by-step plan.

Each step should have:
- description: Clear description of what to do
- tool: Which tool to use (web_search, web_fetch, analyze, synthesize)
- inputs: What inputs are needed
- expected_output: What the step should produce
- dependencies: Which previous steps this depends on (array of step numbers)
- critical: Whether failure of this step should stop execution (boolean)

Available tools:
- web_search: Search the internet for information
- web_fetch: Fetch and read specific web pages
- analyze: Analyze data or information
- synthesize: Combine information from multiple sources

Return as JSON array of steps. Be thorough but efficient (5-10 steps typically).

Example output:
[
  {
    "step_number": 1,
    "description": "Search for current market size of electric vehicles in Europe",
    "tool": "web_search",
    "inputs": {"query": "electric vehicle market size Europe 2024"},
    "expected_output": "Market size statistics and trends",
    "dependencies": [],
    "critical": true
  }
]
"""
        
        prompt = f"""Goal Understanding:
{json.dumps(goal_understanding, indent=2)}

Create a detailed execution plan for this research goal. Return ONLY the JSON array, no other text."""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            system=system_prompt,
            messages=[{"role": "user", "content": prompt}]
        )
        
        try:
            # Extract JSON from response
            text = response.content[0].text
            # Find JSON array in the response
            start = text.find('[')
            end = text.rfind(']') + 1
            if start != -1 and end != 0:
                json_str = text[start:end]
                plan = json.loads(json_str)
            else:
                plan = json.loads(text)
            
            return plan
        except Exception as e:
            # Fallback: create a basic plan
            return self._create_fallback_plan(goal_understanding)
    
    def _create_fallback_plan(self, goal_understanding: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create a basic plan if JSON parsing fails"""
        topics = goal_understanding.get("topics", [])
        
        plan = [
            {
                "step_number": 1,
                "description": f"Search for information about {goal_understanding['objective']}",
                "tool": "web_search",
                "inputs": {"query": goal_understanding['objective']},
                "expected_output": "Initial research findings",
                "dependencies": [],
                "critical": True
            }
        ]
        
        for i, topic in enumerate(topics[:3], 2):
            plan.append({
                "step_number": i,
                "description": f"Deep dive into {topic}",
                "tool": "web_search",
                "inputs": {"query": topic},
                "expected_output": f"Detailed information about {topic}",
                "dependencies": [1],
                "critical": False
            })
        
        plan.append({
            "step_number": len(plan) + 1,
            "description": "Synthesize all findings",
            "tool": "synthesize",
            "inputs": {"sources": "all_previous_steps"},
            "expected_output": "Comprehensive summary",
            "dependencies": list(range(1, len(plan) + 1)),
            "critical": True
        })
        
        return plan
