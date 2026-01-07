"""
Generate Router - API endpoints for number generation
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
import hashlib

from app.filters.entropy_filters import EntropyFilters, PowerballConfig
from app.models.database import get_db, UserFailure
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/generate-optimized-set")
async def generate_optimized_set(
    count: int = Query(default=10, ge=1, le=50, description="Number of combinations"),
    include_stats: bool = Query(default=True, description="Include filter statistics"),
    db: Session = Depends(get_db)
):
    """
    Generate optimized lottery combinations using entropy filters
    
    This endpoint applies mathematical filters to reduce the combination pool:
    - Sum Total Analysis: Filters based on historical sum patterns
    - Low/High Ratio: Ensures balanced number distribution
    - Odd/Even Parity: Prevents all-odd or all-even sets
    - Consecutive Filter: Limits consecutive number sequences
    
    **DISCLAIMER**: This is for entertainment purposes only. 
    No filtering system can improve actual lottery odds.
    """
    # Initialize filters
    config = PowerballConfig()
    filters = EntropyFilters(config)
    
    # Get recent user failures for exclusion (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_failures = db.query(UserFailure).filter(
        UserFailure.submitted_at >= thirty_days_ago
    ).all()
    
    # Build exclusion set from high-frequency patterns
    exclusions = set()
    failure_counts = {}
    for failure in recent_failures:
        key = tuple(sorted(failure.white_balls))
        failure_counts[key] = failure_counts.get(key, 0) + 1
    
    # Exclude patterns that appear 3+ times in failures
    for pattern, count in failure_counts.items():
        if count >= 3:
            exclusions.add(pattern)
    
    # Generate optimized combinations
    combinations = filters.generate_optimized_set(
        count=count,
        exclusions=exclusions
    )
    
    response = {
        "combinations": combinations,
        "count": len(combinations),
        "lottery": "Powerball (US)",
        "disclaimer": "Strategy optimized for variance reduction. "
                      "Actual lottery outcomes remain entirely random."
    }
    
    if include_stats:
        response["optimization_stats"] = filters.calculate_theoretical_reduction()
        response["exclusions_applied"] = len(exclusions)
    
    return response


@router.get("/filter-stats")
async def get_filter_stats():
    """
    Get theoretical reduction statistics for all filters
    
    Returns estimated odds reduction based on combinatorial analysis.
    """
    config = PowerballConfig()
    filters = EntropyFilters(config)
    
    return {
        "lottery_config": {
            "name": "Powerball (US)",
            "white_balls": f"{config.white_ball_count} from {config.white_ball_min}-{config.white_ball_max}",
            "powerball": f"1 from {config.powerball_min}-{config.powerball_max}",
            "total_combinations": f"{config.total_combinations:,}"
        },
        "reduction_analysis": filters.calculate_theoretical_reduction(),
        "disclaimer": "These are theoretical estimates based on combinatorial analysis. "
                      "They do not represent actual probability improvements."
    }


@router.post("/validate-combination")
async def validate_combination(
    white_balls: list[int],
    powerball: int
):
    """
    Validate a user-provided combination against entropy filters
    
    Returns which filters the combination passes or fails.
    """
    config = PowerballConfig()
    filters = EntropyFilters(config)
    
    # Validate input
    if len(white_balls) != 5:
        return {"error": "Must provide exactly 5 white ball numbers"}
    
    if not all(config.white_ball_min <= n <= config.white_ball_max for n in white_balls):
        return {"error": f"White balls must be between {config.white_ball_min} and {config.white_ball_max}"}
    
    if not (config.powerball_min <= powerball <= config.powerball_max):
        return {"error": f"Powerball must be between {config.powerball_min} and {config.powerball_max}"}
    
    # Apply filters
    passed_all, failed_filters = filters.apply_all_filters(white_balls)
    
    return {
        "combination": {
            "white_balls": sorted(white_balls),
            "powerball": powerball
        },
        "passed_all_filters": passed_all,
        "failed_filters": failed_filters,
        "analysis": {
            "sum": sum(white_balls),
            "odd_count": sum(1 for n in white_balls if n % 2 == 1),
            "even_count": sum(1 for n in white_balls if n % 2 == 0),
            "low_count": sum(1 for n in white_balls if n <= 35),
            "high_count": sum(1 for n in white_balls if n > 35)
        }
    }
