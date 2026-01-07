
import anthropic
from typing import Dict, Any, List
import asyncio

class TaskExecutor:
    """
    Executes individual steps using appropriate tools
    """
    
    def __init__(self, client: anthropic.Anthropic):
        self.client = client
    
    async def execute_step(
        self, 
        step: Dict[str, Any], 
        tool_registry,
        context: List[Dict[str, Any]] = None
    ) -> str:
        """
        Execute a single step using the specified tool
        """
        tool_name = step.get("tool")
        inputs = step.get("inputs", {})
        description = step.get("description")
        
        # Get the tool function
        tool_func = tool_registry.get_tool(tool_name)
        
        if not tool_func:
            raise ValueError(f"Tool '{tool_name}' not found")
        
        # Execute the tool
        try:
            if asyncio.iscoroutinefunction(tool_func):
                result = await tool_func(inputs, context, self.client)
            else:
                result = tool_func(inputs, context, self.client)
            
            return result
        except Exception as e:
            raise Exception(f"Error executing step '{description}': {str(e)}")

