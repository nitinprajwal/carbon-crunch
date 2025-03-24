import os
from typing import List
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from linting_service import LintingService

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Code Analysis API",
    description="API for analyzing code quality with enhanced AI insights",
    version="1.0.0"
)

# Initialize linting service
linting_service = LintingService()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
ALLOWED_EXTENSIONS = {".py", ".js", ".jsx"}
TEMP_UPLOAD_DIR = "../temp_files"

# Ensure temp directory exists
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)

def validate_file_extension(filename: str) -> bool:
    """Validate if the file extension is allowed."""
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS

@app.post("/analyze-code")
async def analyze_code(file: UploadFile):
    """
    Endpoint to handle code file uploads and initiate analysis.
    Returns enhanced analysis results including AI-powered insights if available.
    """
    # Validate file extension
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types are: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Create a unique filename to avoid conflicts
    file_extension = os.path.splitext(file.filename)[1]
    temp_file_path = os.path.join(TEMP_UPLOAD_DIR, f"temp_{file.filename}")
    
    try:
        # Save the file temporarily
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Analyze the code
        analysis_result = linting_service.analyze_code(temp_file_path)
        
        # Clean up the temporary file
        os.remove(temp_file_path)
            
        return {
            "message": "Code analysis completed successfully",
            "filename": file.filename,
            "analysis": analysis_result,
            "has_ai_insights": "grok_analysis" in analysis_result
        }
        
    except Exception as e:
        # Clean up the temporary file if it exists
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
    
@app.get("/")
async def root():
    """Root endpoint for API health check."""
    return {
        "status": "healthy",
        "message": "Code Analysis API is running",
        "version": "1.0.0",
        "ai_enabled": linting_service.grok_service.is_configured()
    } 