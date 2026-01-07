/**
 * API Client - Communication with The Entropy Engine Backend
 */

import { LotteryEngine, LOTTERY_CONFIGS, LotteryDrawWithStats } from './lottery';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Lazy-initialize lottery engine to avoid SSR hydration mismatch
let _lotteryEngine: LotteryEngine | null = null;
function getLotteryEngine(): LotteryEngine {
    if (!_lotteryEngine) {
        _lotteryEngine = new LotteryEngine(LOTTERY_CONFIGS.POWERBALL);
    }
    return _lotteryEngine;
}

export interface LotteryCombination {
    white_balls: number[];
    powerball: number;
    sum: number;
    odd_count: number;
    even_count: number;
    low_count: number;
    high_count: number;
}

export interface OptimizationStats {
    original_combinations: number;
    original_odds: string;
    estimated_filtered_combinations: number;
    estimated_filtered_odds: string;
    reduction_factor: number;
    filters_applied: {
        sum_total_analysis: string;
        low_high_ratio: string;
        odd_even_parity: string;
        consecutive_filter: string;
    };
    disclaimer: string;
}

export interface GenerateResponse {
    combinations: LotteryCombination[];
    count: number;
    lottery: string;
    disclaimer: string;
    optimization_stats?: OptimizationStats;
    exclusions_applied?: number;
}

export interface ScanResult {
    success: boolean;
    message: string;
    extracted_numbers?: {
        white_balls: number[];
        powerball: number;
    };
    contribution_id?: number;
    raw_text?: string;
}

export interface FailureStats {
    total_submissions: number;
    recent_submissions_30d: number;
    unique_patterns: number;
    message: string;
}

/**
 * Generate optimized lottery combinations using cryptographically secure randomness
 */
export async function generateOptimizedSet(count: number = 10): Promise<GenerateResponse> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/generate-optimized-set?count=${count}&include_stats=true`
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch {
        // Backend unavailable - use local cryptographically secure generation
        return generateSecureData(count);
    }
}

/**
 * Get filter statistics
 */
export async function getFilterStats(): Promise<OptimizationStats | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/filter-stats`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.reduction_analysis;
    } catch {
        // Backend unavailable - return secure stats
        return getSecureStats();
    }
}

/**
 * Scan a lottery ticket image
 */
export async function scanTicket(file: File): Promise<ScanResult> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/scan-ticket`, {
            method: 'POST',
            body: formData,
        });

        return await response.json();
    } catch {
        // Demo mode - simulate successful scan
        return {
            success: true,
            message: 'Data ingested. Entropy reduced for next calculation.',
            extracted_numbers: {
                white_balls: [7, 14, 21, 35, 62],
                powerball: 15
            },
            contribution_id: Math.floor(Math.random() * 1000)
        };
    }
}

/**
 * Submit losing numbers manually
 */
export async function submitLosingNumbers(
    whiteBalls: number[],
    powerball: number
): Promise<ScanResult> {
    try {
        const response = await fetch(`${API_BASE_URL}/submit-losing-numbers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ white_balls: whiteBalls, powerball }),
        });

        return await response.json();
    } catch {
        // Demo mode
        return {
            success: true,
            message: 'Numbers recorded. Your losing ticket contributes to variance reduction.',
            contribution_id: Math.floor(Math.random() * 1000)
        };
    }
}

/**
 * Get failure database statistics
 */
export async function getFailureStats(): Promise<FailureStats> {
    try {
        const response = await fetch(`${API_BASE_URL}/failure-stats`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch {
        // Demo mode stats
        return {
            total_submissions: 1247,
            recent_submissions_30d: 89,
            unique_patterns: 1189,
            message: 'Community has contributed 1,247 data points for inverse learning.'
        };
    }
}

// Cryptographically secure data generators using LotteryEngine
function generateSecureData(count: number): GenerateResponse {
    const engine = getLotteryEngine();
    const draws = engine.generateBulkDraws(count);

    const combinations: LotteryCombination[] = draws.map((draw: LotteryDrawWithStats) => ({
        white_balls: draw.mainNumbers,
        powerball: draw.bonusNumbers[0] || 1,
        sum: draw.sum,
        odd_count: draw.oddCount,
        even_count: draw.evenCount,
        low_count: draw.lowCount,
        high_count: draw.highCount,
    }));

    return {
        combinations,
        count: combinations.length,
        lottery: engine.getConfig().name,
        disclaimer: 'Numbers generated using cryptographically secure randomness. Each draw is statistically independent.',
        optimization_stats: getSecureStats(),
        exclusions_applied: 0
    };
}

function getSecureStats(): OptimizationStats {
    const engine = getLotteryEngine();
    const totalCombinations = engine.getTotalCombinations();
    return {
        original_combinations: totalCombinations,
        original_odds: `1 in ${totalCombinations.toLocaleString()}`,
        estimated_filtered_combinations: totalCombinations,
        estimated_filtered_odds: `1 in ${totalCombinations.toLocaleString()}`,
        reduction_factor: 1.0,
        filters_applied: {
            sum_total_analysis: 'Pure random',
            low_high_ratio: 'Pure random',
            odd_even_parity: 'Pure random',
            consecutive_filter: 'Pure random'
        },
        disclaimer: 'Cryptographically secure random generation. All combinations have equal probability.'
    };
}

