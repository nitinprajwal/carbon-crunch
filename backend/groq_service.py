import os
from typing import Dict, Any, Optional, List
from groq import Groq

class GroqService:
    """Service to handle Groq AI integration for enhanced code analysis."""
    
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY')
        self.groq_client = Groq(api_key=self.api_key) if self.api_key else None
        
    def is_configured(self) -> bool:
        """Check if Groq API is properly configured."""
        return bool(self.api_key)
    
    def enhance_analysis(self, code: str, analysis_result: Dict[str, Any], file_type: str) -> Dict[str, Any]:
        """
        Enhance code analysis using Groq AI.
        
        Args:
            code: The source code being analyzed
            analysis_result: The initial analysis results from our linting tools
            file_type: The type of file being analyzed (.py, .js, .jsx)
            
        Returns:
            Enhanced analysis results with Groq AI insights
        """
        if not self.is_configured():
            return {
                **analysis_result,
                "groq_analysis": {
                    "status": "skipped",
                    "message": "Groq API key not configured"
                }
            }
            
        try:
            # Prepare the prompt for Groq
            prompt = self._create_analysis_prompt(code, analysis_result, file_type)
            
            # Call Groq API
            response = self._call_groq_api(prompt)
            
            if response:
                # Parse and structure Groq's response
                groq_insights = self._process_groq_response(response)
                
                # Merge Groq insights with original analysis
                enhanced_result = self._merge_analysis_results(analysis_result, groq_insights)
                
                return enhanced_result
            
            return {
                **analysis_result,
                "groq_analysis": {
                    "status": "error",
                    "message": "Failed to get response from Groq API"
                }
            }
            
        except Exception as e:
            return {
                **analysis_result,
                "groq_analysis": {
                    "status": "error",
                    "message": f"Error during Groq analysis: {str(e)}"
                }
            }
    
    def _create_analysis_prompt(self, code: str, analysis_result: Dict[str, Any], file_type: str) -> str:
        """Create a detailed prompt for Groq AI."""
        violations = analysis_result.get("violations", [])
        recommendations = analysis_result.get("recommendations", [])
        
        prompt = f"""Analyze this {file_type} code and provide insights. Format your response in markdown with appropriate headings and code blocks.

Code:
```{file_type}
{code}
```

Current Analysis:
- Score: {analysis_result.get('total_score', 0)}/100
- Key Issues:
{self._format_violations(violations)}

Current Recommendations:
{self._format_recommendations(recommendations)}

Please provide the following sections, using markdown formatting:

## Code Quality Insights
(List additional code quality insights not covered by the linter)

## Refactoring Suggestions
(Provide specific refactoring suggestions with code examples in markdown code blocks)

## Best Practices
(List relevant best practices for this code)

## Security Concerns
(List potential security issues)

## Performance Optimizations
(List performance optimization opportunities)

Focus on practical, actionable improvements that would make the code more maintainable, efficient, and secure.
Use markdown code blocks for any code examples."""

        return prompt
    
    def _call_groq_api(self, prompt: str) -> Optional[Dict[str, Any]]:
        """Make the actual API call to Groq."""
        if not self.groq_client:
            return None
            
        try:
            completion = self.groq_client.chat.completions.create(
                messages=[{
                    "role": "user",
                    "content": prompt
                }],
                model="qwen-qwq-32b",
                temperature=0.6,
                max_tokens=4096,
                top_p=0.95,
                stream=False
            )
            
            return {
                "choices": [{
                    "message": {
                        "content": completion.choices[0].message.content
                    }
                }]
            }
            
        except Exception as e:
            print(f"Error calling Groq API: {str(e)}")
            return None
    
    def _process_groq_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """Process and structure Groq's response."""
        try:
            # Extract the main content from Groq's response
            content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            # Parse the content into structured sections
            sections = self._parse_response_sections(content)
            
            return {
                "status": "success",
                "insights": sections
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"Error processing Groq response: {str(e)}"
            }
    
    def _parse_response_sections(self, content: str) -> Dict[str, Any]:
        """Parse Groq's response into structured sections."""
        sections = {
            "code_quality_insights": [],
            "refactoring_suggestions": [],
            "best_practices": [],
            "security_concerns": [],
            "performance_optimizations": []
        }
        
        current_section = None
        current_content = []
        
        for line in content.split('\n'):
            line = line.rstrip()
            
            # Check for section headers
            if line.startswith('## Code Quality'):
                current_section = "code_quality_insights"
                current_content = []
            elif line.startswith('## Refactoring'):
                current_section = "refactoring_suggestions"
                current_content = []
            elif line.startswith('## Best Practices'):
                current_section = "best_practices"
                current_content = []
            elif line.startswith('## Security'):
                current_section = "security_concerns"
                current_content = []
            elif line.startswith('## Performance'):
                current_section = "performance_optimizations"
                current_content = []
            elif current_section and line:
                current_content.append(line)
            elif current_section and not line and current_content:
                # When we hit an empty line and have content, join it all together
                full_content = '\n'.join(current_content).strip()
                if full_content:
                    sections[current_section].append(full_content)
                current_content = []
        
        # Don't forget the last section
        if current_section and current_content:
            full_content = '\n'.join(current_content).strip()
            if full_content:
                sections[current_section].append(full_content)
        
        return sections
    
    def _merge_analysis_results(self, original_analysis: Dict[str, Any], groq_insights: Dict[str, Any]) -> Dict[str, Any]:
        """Merge original analysis with Groq insights."""
        return {
            **original_analysis,
            "groq_analysis": groq_insights,
            "enhanced_recommendations": self._combine_recommendations(
                original_analysis.get("recommendations", []),
                groq_insights.get("insights", {})
            )
        }
    
    def _combine_recommendations(self, original_recommendations: List[Dict[str, Any]], groq_insights: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Combine original recommendations with Groq insights."""
        enhanced_recommendations = original_recommendations.copy()
        
        # Add Groq's insights as additional recommendations
        for category, items in groq_insights.items():
            if items:
                enhanced_recommendations.extend([
                    {
                        "category": category.replace('_', ' ').title(),
                        "priority": "Medium",
                        "suggestion": item,
                        "source": "Groq AI"
                    }
                    for item in items[:2]  # Limit to top 2 items per category
                ])
        
        # Sort by priority and limit to top 10
        priority_order = {"High": 3, "Medium": 2, "Low": 1}
        enhanced_recommendations.sort(
            key=lambda x: (priority_order.get(x.get("priority", "Low"), 0)),
            reverse=True
        )
        
        return enhanced_recommendations[:10]
    
    def _format_violations(self, violations: List[Dict[str, Any]]) -> str:
        """Format violations for the prompt."""
        if not violations:
            return "No violations found."
            
        return "\n".join(
            f"- Line {v.get('line')}: {v.get('message')}"
            for v in violations[:5]
        )
    
    def _format_recommendations(self, recommendations: List[Dict[str, Any]]) -> str:
        """Format recommendations for the prompt."""
        if not recommendations:
            return "No recommendations available."
            
        return "\n".join(
            f"- [{r.get('priority', 'Medium')}] {r.get('suggestion', '')}"
            for r in recommendations
        ) 