"""
Entropy Filters - The Mathematical Core
Implements all statistical filtering algorithms for lottery combination optimization

Target: Powerball (US)
- 5 white balls from 1-69
- 1 Powerball from 1-26
"""
import random
from typing import List, Tuple, Set
from dataclasses import dataclass
import numpy as np
from scipy import stats


@dataclass
class FilterStats:
    """Statistics about filter application"""
    original_pool_size: int
    filtered_pool_size: int
    reduction_percentage: float
    filter_name: str


@dataclass
class PowerballConfig:
    """Powerball lottery configuration"""
    white_ball_min: int = 1
    white_ball_max: int = 69
    white_ball_count: int = 5
    powerball_min: int = 1
    powerball_max: int = 26
    
    @property
    def total_white_combinations(self) -> int:
        """C(69, 5) = 11,238,513"""
        from math import comb
        return comb(self.white_ball_max, self.white_ball_count)
    
    @property
    def total_combinations(self) -> int:
        """Total Powerball combinations: 11,238,513 × 26 = 292,201,338"""
        return self.total_white_combinations * self.powerball_max


class EntropyFilters:
    """
    The Entropy Engine's core filtering system
    Uses combinatorial analysis to reduce the theoretical pool
    """
    
    def __init__(self, config: PowerballConfig = None):
        self.config = config or PowerballConfig()
        self.filter_stats: List[FilterStats] = []
        
        # Historical sum ranges (based on typical Powerball patterns)
        # White balls sum typically ranges from ~95 to ~235
        self.sum_range_low = 95
        self.sum_range_high = 235
        
    def reset_stats(self):
        """Reset filter statistics"""
        self.filter_stats = []
    
    def sum_total_filter(self, numbers: List[int]) -> bool:
        """
        Filter 1: Sum Total Analysis
        Reject combinations where sum falls outside the historical bell curve
        
        Returns True if the combination PASSES the filter
        """
        total = sum(numbers)
        return self.sum_range_low <= total <= self.sum_range_high
    
    def low_high_ratio_filter(self, numbers: List[int]) -> bool:
        """
        Filter 2: Low/High Ratio
        Reject combinations that aren't balanced between low and high numbers
        Low: 1-35, High: 36-69
        Allowed splits: 3/2, 2/3, 4/1, 1/4 (flexible)
        
        Returns True if the combination PASSES the filter
        """
        midpoint = (self.config.white_ball_max + self.config.white_ball_min) // 2
        low_count = sum(1 for n in numbers if n <= midpoint)
        high_count = len(numbers) - low_count
        
        # Allow 2/3, 3/2, 4/1, 1/4 splits but reject 5/0 or 0/5
        return 1 <= low_count <= 4 and 1 <= high_count <= 4
    
    def odd_even_parity_filter(self, numbers: List[int]) -> bool:
        """
        Filter 3: Odd/Even Parity
        Reject all-odd or all-even combinations
        
        Returns True if the combination PASSES the filter
        """
        odd_count = sum(1 for n in numbers if n % 2 == 1)
        even_count = len(numbers) - odd_count
        
        # Reject all-odd (5/0) or all-even (0/5)
        return 1 <= odd_count <= 4 and 1 <= even_count <= 4
    
    def consecutive_filter(self, numbers: List[int], max_consecutive: int = 2) -> bool:
        """
        Filter 4: Consecutive String Theory
        Reject combinations with more than N consecutive numbers
        
        Returns True if the combination PASSES the filter
        """
        sorted_nums = sorted(numbers)
        consecutive_count = 1
        max_found = 1
        
        for i in range(1, len(sorted_nums)):
            if sorted_nums[i] == sorted_nums[i-1] + 1:
                consecutive_count += 1
                max_found = max(max_found, consecutive_count)
            else:
                consecutive_count = 1
        
        return max_found <= max_consecutive
    
    def apply_all_filters(self, numbers: List[int]) -> Tuple[bool, List[str]]:
        """
        Apply all filters to a combination
        Returns (passed_all, list_of_failed_filters)
        """
        failed_filters = []
        
        if not self.sum_total_filter(numbers):
            failed_filters.append("sum_total")
        if not self.low_high_ratio_filter(numbers):
            failed_filters.append("low_high_ratio")
        if not self.odd_even_parity_filter(numbers):
            failed_filters.append("odd_even_parity")
        if not self.consecutive_filter(numbers):
            failed_filters.append("consecutive")
        
        return len(failed_filters) == 0, failed_filters
    
    def generate_random_combination(self) -> Tuple[List[int], int]:
        """Generate a random Powerball combination"""
        white_balls = sorted(random.sample(
            range(self.config.white_ball_min, self.config.white_ball_max + 1),
            self.config.white_ball_count
        ))
        powerball = random.randint(self.config.powerball_min, self.config.powerball_max)
        return white_balls, powerball
    
    def generate_optimized_set(
        self, 
        count: int = 10,
        exclusions: Set[tuple] = None,
        max_attempts: int = 10000
    ) -> List[dict]:
        """
        Generate a set of optimized combinations that pass all filters
        
        Args:
            count: Number of combinations to generate
            exclusions: Set of tuples representing combinations to exclude
            max_attempts: Maximum generation attempts
        
        Returns:
            List of valid combinations with metadata
        """
        self.reset_stats()
        exclusions = exclusions or set()
        results = []
        attempts = 0
        passed = 0
        failed = 0
        
        while len(results) < count and attempts < max_attempts:
            attempts += 1
            white_balls, powerball = self.generate_random_combination()
            
            # Check exclusions
            combo_tuple = tuple(white_balls)
            if combo_tuple in exclusions:
                failed += 1
                continue
            
            # Apply filters
            passed_all, failed_filters = self.apply_all_filters(white_balls)
            
            if passed_all:
                passed += 1
                results.append({
                    "white_balls": white_balls,
                    "powerball": powerball,
                    "sum": sum(white_balls),
                    "odd_count": sum(1 for n in white_balls if n % 2 == 1),
                    "even_count": sum(1 for n in white_balls if n % 2 == 0),
                    "low_count": sum(1 for n in white_balls if n <= 35),
                    "high_count": sum(1 for n in white_balls if n > 35)
                })
            else:
                failed += 1
        
        # Calculate reduction statistics
        filter_efficiency = (failed / attempts * 100) if attempts > 0 else 0
        
        self.filter_stats.append(FilterStats(
            original_pool_size=attempts,
            filtered_pool_size=passed,
            reduction_percentage=filter_efficiency,
            filter_name="all_filters"
        ))
        
        return results
    
    def calculate_theoretical_reduction(self) -> dict:
        """
        Calculate theoretical odds reduction based on filter constraints
        Returns estimated reduction statistics
        """
        # Total white ball combinations: C(69,5) = 11,238,513
        total = self.config.total_white_combinations
        
        # Estimate reductions (based on combinatorial analysis)
        # These are theoretical approximations
        
        # Sum filter: ~60% of combinations fall within typical range
        sum_filter_pass_rate = 0.60
        
        # Low/High filter: Reject 0/5 and 5/0 splits
        # P(all low) + P(all high) ≈ 2 * C(35,5)/C(69,5) ≈ 6%
        low_high_pass_rate = 0.94
        
        # Odd/Even filter: Similar calculation
        # P(all odd) + P(all even) ≈ 2 * C(35,5)/C(69,5) ≈ 6%
        odd_even_pass_rate = 0.94
        
        # Consecutive filter: Harder to calculate, estimate ~15% have 3+ consecutive
        consecutive_pass_rate = 0.85
        
        # Combined (assuming independence, which is approximate)
        combined_pass_rate = (
            sum_filter_pass_rate * 
            low_high_pass_rate * 
            odd_even_pass_rate * 
            consecutive_pass_rate
        )
        
        reduced_combinations = int(total * combined_pass_rate)
        
        return {
            "original_combinations": total,
            "original_odds": f"1 in {total * 26:,}",
            "estimated_filtered_combinations": reduced_combinations,
            "estimated_filtered_odds": f"1 in {reduced_combinations * 26:,}",
            "reduction_factor": round(total / reduced_combinations, 2),
            "filters_applied": {
                "sum_total_analysis": f"{sum_filter_pass_rate * 100:.0f}% pass",
                "low_high_ratio": f"{low_high_pass_rate * 100:.0f}% pass",
                "odd_even_parity": f"{odd_even_pass_rate * 100:.0f}% pass",
                "consecutive_filter": f"{consecutive_pass_rate * 100:.0f}% pass"
            },
            "disclaimer": "These are theoretical estimates. Actual lottery outcomes remain random."
        }
