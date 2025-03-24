from typing import Dict, Any, List, Tuple
import re

class CodeAnalyzer:
    """Handles detailed code analysis and scoring logic."""
    
    def __init__(self):
        self.category_weights = {
            "naming_conventions": 10,
            "function_modularity": 20,
            "documentation": 20,
            "formatting": 15,
            "reusability": 15,
            "best_practices": 20
        }
        
    def analyze_violations(self, violations: List[Dict[str, Any]], file_type: str) -> Dict[str, Any]:
        """
        Analyze violations and generate detailed report with scores and recommendations.
        """
        # Initialize category scores with maximum values
        scores = self.category_weights.copy()
        
        # Track violations by category
        categorized_violations = {category: [] for category in self.category_weights.keys()}
        
        # Process each violation
        for violation in violations:
            category = self._determine_category(violation, file_type)
            severity = self._get_severity_weight(violation['severity'])
            
            # Calculate deduction
            deduction = self._calculate_deduction(category, severity)
            scores[category] = max(0, scores[category] - deduction)
            
            # Store violation with category
            categorized_violations[category].append(violation)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(categorized_violations)
        
        # Calculate total score
        total_score = sum(scores.values())
        
        return {
            "total_score": total_score,
            "category_scores": scores,
            "detailed_analysis": self._generate_detailed_analysis(categorized_violations),
            "recommendations": recommendations
        }
    
    def _determine_category(self, violation: Dict[str, Any], file_type: str) -> str:
        """Determine the category of a violation based on its message and file type."""
        message = violation.get('message', '').lower()
        
        # Naming conventions
        if any(term in message for term in ['name', 'naming', 'identifier', 'camelcase', 'snake_case']):
            return "naming_conventions"
            
        # Function modularity
        if any(term in message for term in ['function', 'method', 'too many', 'complex', 'length']):
            return "function_modularity"
            
        # Documentation
        if any(term in message for term in ['doc', 'comment', 'documentation', 'missing description']):
            return "documentation"
            
        # Formatting
        if any(term in message for term in ['indent', 'whitespace', 'line length', 'spacing']):
            return "formatting"
            
        # Reusability
        if any(term in message for term in ['duplicate', 'similar', 'reuse', 'redundant']):
            return "reusability"
            
        # Default to best practices
        return "best_practices"
    
    def _get_severity_weight(self, severity: Any) -> float:
        """Convert different severity formats to a consistent weight."""
        if isinstance(severity, str):
            severity_map = {
                'error': 1.0,
                'warning': 0.5,
                'info': 0.25
            }
            return severity_map.get(severity.lower(), 0.5)
        elif isinstance(severity, (int, float)):
            # ESLint uses 2 for error, 1 for warning
            severity_map = {
                2: 1.0,
                1: 0.5,
                0: 0.25
            }
            return severity_map.get(severity, 0.5)
        return 0.5
    
    def _calculate_deduction(self, category: str, severity_weight: float) -> float:
        """Calculate the score deduction for a violation."""
        base_deductions = {
            "naming_conventions": 2,
            "function_modularity": 4,
            "documentation": 3,
            "formatting": 2,
            "reusability": 3,
            "best_practices": 3
        }
        
        return base_deductions.get(category, 2) * severity_weight
    
    def _generate_detailed_analysis(self, categorized_violations: Dict[str, List[Dict]]) -> Dict[str, Any]:
        """Generate detailed analysis for each category."""
        analysis = {}
        
        for category, violations in categorized_violations.items():
            if violations:
                analysis[category] = {
                    "violation_count": len(violations),
                    "severity_breakdown": self._get_severity_breakdown(violations),
                    "most_common_issues": self._get_most_common_issues(violations)
                }
            else:
                analysis[category] = {
                    "violation_count": 0,
                    "severity_breakdown": {"error": 0, "warning": 0, "info": 0},
                    "most_common_issues": []
                }
        
        return analysis
    
    def _get_severity_breakdown(self, violations: List[Dict]) -> Dict[str, int]:
        """Calculate the breakdown of violation severities."""
        breakdown = {"error": 0, "warning": 0, "info": 0}
        
        for violation in violations:
            severity = violation.get('severity')
            if isinstance(severity, (int, float)):
                if severity == 2:
                    breakdown["error"] += 1
                elif severity == 1:
                    breakdown["warning"] += 1
                else:
                    breakdown["info"] += 1
            elif isinstance(severity, str):
                breakdown[severity.lower()] = breakdown.get(severity.lower(), 0) + 1
        
        return breakdown
    
    def _get_most_common_issues(self, violations: List[Dict]) -> List[str]:
        """Identify the most common types of issues."""
        issue_types = {}
        
        for violation in violations:
            message = violation.get('message', '')
            # Extract the main issue type from the message
            issue_type = re.split(r'[:.()]', message)[0].strip()
            issue_types[issue_type] = issue_types.get(issue_type, 0) + 1
        
        # Sort by frequency and return top 3
        sorted_issues = sorted(issue_types.items(), key=lambda x: x[1], reverse=True)
        return [issue[0] for issue in sorted_issues[:3]]
    
    def _generate_recommendations(self, categorized_violations: Dict[str, List[Dict]]) -> List[Dict[str, Any]]:
        """Generate actionable recommendations based on violations."""
        recommendations = []
        
        # Sort categories by violation count and severity
        sorted_categories = sorted(
            categorized_violations.items(),
            key=lambda x: (len(x[1]), sum(self._get_severity_weight(v['severity']) for v in x[1])),
            reverse=True
        )
        
        for category, violations in sorted_categories:
            if violations:
                recommendations.append({
                    "category": category,
                    "priority": "High" if len(violations) >= 3 else "Medium" if len(violations) >= 1 else "Low",
                    "suggestion": self._get_category_recommendation(category, violations),
                    "example_violation": violations[0]['message'] if violations else None
                })
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def _get_category_recommendation(self, category: str, violations: List[Dict]) -> str:
        """Generate specific recommendations based on category and violations."""
        recommendations = {
            "naming_conventions": "Consider following consistent naming conventions. Use snake_case for Python and camelCase for JavaScript.",
            "function_modularity": "Break down large functions into smaller, more manageable pieces. Aim for functions with a single responsibility.",
            "documentation": "Add descriptive docstrings and comments to explain complex logic and function purposes.",
            "formatting": "Use consistent indentation and line lengths. Consider using a code formatter.",
            "reusability": "Extract repeated code into reusable functions or components.",
            "best_practices": "Follow language-specific best practices and patterns."
        }
        
        base_recommendation = recommendations.get(category, "Review and improve code quality.")
        
        # Add specific details based on violations
        if violations:
            common_issues = self._get_most_common_issues(violations)
            if common_issues:
                base_recommendation += f" Focus on fixing: {', '.join(common_issues)}."
        
        return base_recommendation 