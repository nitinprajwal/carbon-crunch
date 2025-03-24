import os
import json
import subprocess
from typing import Dict, Any, List
from code_analyzer import CodeAnalyzer
from groq_service import GroqService

class LintingService:
    def __init__(self):
        self.config_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config')
        self.pylintrc_path = os.path.join(self.config_dir, '.pylintrc')
        self.eslintrc_path = os.path.join(self.config_dir, '.eslintrc.json')
        self.code_analyzer = CodeAnalyzer()
        self.groq_service = GroqService()
        
    def _run_pylint(self, file_path: str) -> List[Dict[str, Any]]:
        """Run Pylint on Python files."""
        try:
            result = subprocess.run(
                ['pylint', '--rcfile', self.pylintrc_path, '--output-format=json', file_path],
                capture_output=True,
                text=True
            )
            
            if result.stdout:
                return json.loads(result.stdout)
            return []
            
        except Exception as e:
            print(f"Error running Pylint: {str(e)}")
            return []

    def _run_eslint(self, file_path: str) -> List[Dict[str, Any]]:
        """Run ESLint on JavaScript/React files."""
        try:
            npm_path = 'npm.cmd' if os.name == 'nt' else 'npm'
            result = subprocess.run(
                [npm_path, 'run', 'lint', '--', '--format', 'json', file_path],
                capture_output=True,
                text=True,
                cwd=self.config_dir
            )
            
            if result.stdout:
                return json.loads(result.stdout)
            return []
            
        except Exception as e:
            print(f"Error running ESLint: {str(e)}")
            return []

    def analyze_code(self, file_path: str) -> Dict[str, Any]:
        """Analyze code file based on its extension."""
        _, ext = os.path.splitext(file_path)
        
        # Read the file content
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                code_content = f.read()
        except Exception as e:
            print(f"Error reading file: {str(e)}")
            code_content = ""
        
        violations = []
        
        if ext == '.py':
            lint_result = self._run_pylint(file_path)
            violations = [
                {
                    "message": issue['message'],
                    "line": issue['line'],
                    "severity": issue['type'],
                    "rule": issue['message-id']
                }
                for issue in lint_result
            ]
                    
        elif ext in ['.js', '.jsx']:
            lint_result = self._run_eslint(file_path)
            for result in lint_result:
                violations.extend([
                    {
                        "message": message['message'],
                        "line": message['line'],
                        "severity": message['severity'],
                        "rule": message['ruleId']
                    }
                    for message in result.get('messages', [])
                ])
        
        # Get initial analysis from code analyzer
        analysis_result = self.code_analyzer.analyze_violations(violations, ext)
        
        # Enhance analysis with Groq if available
        if code_content and self.groq_service.is_configured():
            enhanced_result = self.groq_service.enhance_analysis(
                code_content,
                analysis_result,
                ext
            )
            return enhanced_result
        
        return analysis_result
    
    def _categorize_pylint_message(self, message_id: str) -> str:
        """Categorize Pylint messages into our scoring categories."""
        categories = {
            "C0103": "naming_conventions",  # Invalid name
            "C0116": "documentation",       # Missing function docstring
            "C0301": "formatting",          # Line too long
            "R0201": "best_practices",      # Method could be a function
            "R0913": "function_modularity", # Too many arguments
            "R0914": "function_modularity", # Too many local variables
            "W0611": "best_practices",      # Unused import
            "R0801": "reusability",         # Similar lines
        }
        return categories.get(message_id, "best_practices")
    
    def _categorize_eslint_message(self, rule_id: str) -> str:
        """Categorize ESLint messages into our scoring categories."""
        categories = {
            "camelcase": "naming_conventions",
            "max-len": "formatting",
            "no-unused-vars": "best_practices",
            "react/prop-types": "documentation",
            "max-lines-per-function": "function_modularity",
            "complexity": "function_modularity",
            "no-duplicate-imports": "reusability",
        }
        return categories.get(rule_id, "best_practices")
    
    def _calculate_deduction(self, category: str, severity: str) -> float:
        """Calculate score deduction based on violation category and severity."""
        base_deductions = {
            "naming_conventions": 2,
            "function_modularity": 4,
            "documentation": 3,
            "formatting": 2,
            "reusability": 3,
            "best_practices": 3
        }
        
        severity_multiplier = 1.5 if severity in ['error', 2] else 1.0
        return base_deductions.get(category, 2) * severity_multiplier 