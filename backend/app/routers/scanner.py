"""
Scanner Router - API endpoints for ticket scanning and failure ingestion
"""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import hashlib
import re
from typing import Optional

from app.models.database import get_db, UserFailure
from app.services.ocr_service import OCRService

router = APIRouter()


@router.post("/scan-ticket")
async def scan_ticket(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Scan a losing lottery ticket using OCR
    
    Extracts numbers from the ticket image and stores them as a
    "negative data point" for the inverse learning system.
    
    Supported formats: JPG, PNG, WEBP
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file.content_type} not supported. Use JPG, PNG, or WEBP."
        )
    
    # Read file content
    content = await file.read()
    
    # Process with OCR
    ocr_service = OCRService()
    result = ocr_service.extract_numbers(content)
    
    if not result["success"]:
        return {
            "success": False,
            "message": "Could not extract numbers from image. Please ensure the ticket is clearly visible.",
            "raw_text": result.get("raw_text", "")
        }
    
    # Store as user failure
    white_balls = result["white_balls"]
    powerball = result["powerball"]
    
    # Create pattern hash for deduplication tracking
    pattern_str = f"{sorted(white_balls)}-{powerball}"
    pattern_hash = hashlib.sha256(pattern_str.encode()).hexdigest()
    
    failure = UserFailure(
        white_balls=white_balls,
        powerball=powerball,
        pattern_hash=pattern_hash
    )
    db.add(failure)
    db.commit()
    
    return {
        "success": True,
        "message": "Data ingested. Entropy reduced for next calculation.",
        "extracted_numbers": {
            "white_balls": white_balls,
            "powerball": powerball
        },
        "contribution_id": failure.id
    }


@router.post("/submit-losing-numbers")
async def submit_losing_numbers(
    white_balls: list[int],
    powerball: int,
    db: Session = Depends(get_db)
):
    """
    Manually submit losing lottery numbers
    
    Alternative to ticket scanning - users can directly input their
    losing numbers to contribute to the inverse learning database.
    """
    # Validate inputs
    if len(white_balls) != 5:
        raise HTTPException(status_code=400, detail="Must provide exactly 5 white ball numbers")
    
    if not all(1 <= n <= 69 for n in white_balls):
        raise HTTPException(status_code=400, detail="White balls must be between 1 and 69")
    
    if not (1 <= powerball <= 26):
        raise HTTPException(status_code=400, detail="Powerball must be between 1 and 26")
    
    # Create pattern hash
    pattern_str = f"{sorted(white_balls)}-{powerball}"
    pattern_hash = hashlib.sha256(pattern_str.encode()).hexdigest()
    
    failure = UserFailure(
        white_balls=sorted(white_balls),
        powerball=powerball,
        pattern_hash=pattern_hash
    )
    db.add(failure)
    db.commit()
    
    return {
        "success": True,
        "message": "Numbers recorded. Your losing ticket contributes to variance reduction.",
        "contribution_id": failure.id
    }


@router.get("/failure-stats")
async def get_failure_stats(db: Session = Depends(get_db)):
    """
    Get statistics about the user failure database
    
    Shows how many losing tickets have been contributed.
    """
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    total_count = db.query(func.count(UserFailure.id)).scalar()
    
    # Recent submissions (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_count = db.query(func.count(UserFailure.id)).filter(
        UserFailure.submitted_at >= thirty_days_ago
    ).scalar()
    
    # Unique patterns
    unique_patterns = db.query(func.count(func.distinct(UserFailure.pattern_hash))).scalar()
    
    return {
        "total_submissions": total_count,
        "recent_submissions_30d": recent_count,
        "unique_patterns": unique_patterns,
        "message": f"Community has contributed {total_count} data points for inverse learning."
    }
