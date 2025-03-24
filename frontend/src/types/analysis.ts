export interface CategoryScores {
    naming_conventions: number;
    function_modularity: number;
    documentation: number;
    formatting: number;
    reusability: number;
    best_practices: number;
}

export interface Violation {
    message: string;
    line: number;
    severity: string | number;
    rule?: string;
}

export interface Recommendation {
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    suggestion: string;
    example_violation?: string;
}

export interface GroqInsights {
    code_quality_insights: string[];
    refactoring_suggestions: string[];
    best_practices: string[];
    security_concerns: string[];
    performance_optimizations: string[];
}

export interface GroqAnalysis {
    status: 'success' | 'error' | 'skipped';
    insights?: GroqInsights;
    message?: string;
}

export interface DetailedAnalysis {
    [category: string]: {
        violation_count: number;
        severity_breakdown: {
            error: number;
            warning: number;
            info: number;
        };
        most_common_issues: string[];
    };
}

export interface AnalysisResult {
    total_score: number;
    category_scores: CategoryScores;
    detailed_analysis: DetailedAnalysis;
    recommendations: Recommendation[];
    groq_analysis?: GroqAnalysis;
    enhanced_recommendations?: Recommendation[];
}

export interface AnalysisResponse {
    message: string;
    filename: string;
    analysis: AnalysisResult;
    has_ai_insights: boolean;
} 