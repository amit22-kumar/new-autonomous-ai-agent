
import httpx
from bs4 import BeautifulSoup
import json
from typing import Dict, Any, List, Optional
import anthropic

class ToolRegistry:
    """
    Registry of available tools for the agent
    """
    
    def __init__(self):
        self.tools = {
            "web_search": self.web_search,
            "web_fetch": self.web_fetch,
            "analyze": self.analyze,
            "synthesize": self.synthesize
        }
    
    def get_tool(self, tool_name: str):
        return self.tools.get(tool_name)
    
    async def web_search(
        self, 
        inputs: Dict[str, Any], 
        context: List[Dict[str, Any]], 
        client: anthropic.Anthropic
    ) -> str:
        """
        Simulate web search (in production, use actual search API)
        """
        query = inputs.get("query", "")
        
       
        system_prompt = """You are simulating web search results.
        
Provide realistic, factual search results for the given query.
Include 3-5 relevant findings with brief descriptions.
Format as a structured summary."""

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            system=system_prompt,
            messages=[{
                "role": "user",
                "content": f"Search query: {query}\n\nProvide relevant, factual information."
            }]
        )
        
        return response.content[0].text
    
    async def web_fetch(
        self, 
        inputs: Dict[str, Any], 
        context: List[Dict[str, Any]], 
        client: anthropic.Anthropic
    ) -> str:
        """
        Fetch content from a specific URL
        """
        url = inputs.get("url", "")
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as http_client:
                response = await http_client.get(url)
                response.raise_for_status()
                
                # Parse HTML
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extract main content (simplified)
                for script in soup(["script", "style"]):
                    script.decompose()
                
                text = soup.get_text()
                lines = (line.strip() for line in text.splitlines())
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                text = ' '.join(chunk for chunk in chunks if chunk)
                
                # Limit length
                return text[:3000]
        except Exception as e:
            return f"Error fetching URL: {str(e)}"
    
    async def analyze(
        self, 
        inputs: Dict[str, Any], 
        context: List[Dict[str, Any]], 
        client: anthropic.Anthropic
    ) -> str:
        """
        Analyze information using Claude
        """
        data = inputs.get("data", "")
        analysis_type = inputs.get("type", "general")
        
        system_prompt = f"""You are analyzing research data.
        
Analysis type: {analysis_type}

Provide insights, patterns, key findings, and conclusions.
Be specific and data-driven."""

        
        context_str = ""
        if context:
            recent_results = context[-3:]  
            context_str = "\n\n".join([
                f"Previous finding: {r.get('result', '')[:500]}" 
                for r in recent_results if r.get('status') == 'completed'
            ])
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=system_prompt,
            messages=[{
                "role": "user",
                "content": f"Context:\n{context_str}\n\nData to analyze:\n{data}\n\nProvide analysis."
            }]
        )
        
        return response.content[0].text
    
    async def synthesize(
        self, 
        inputs: Dict[str, Any], 
        context: List[Dict[str, Any]], 
        client: anthropic.Anthropic
    ) -> str:
        """
        Synthesize information from multiple sources
        """
        system_prompt = """You are synthesizing research findings.

Combine all the information into a coherent, comprehensive summary.
Identify common themes, contradictions, and key insights.
Structure the synthesis logically."""

        
        findings = []
        if context:
            for step_result in context:
                if step_result.get('status') == 'completed':
                    result = step_result.get('result', '')
                    if result:
                        findings.append(result)
        
        all_findings = "\n\n---\n\n".join(findings)
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            system=system_prompt,
            messages=[{
                "role": "user",
                "content": f"Findings to synthesize:\n\n{all_findings}\n\nCreate comprehensive synthesis."
            }]
        )
        
        return response.content[0].text

