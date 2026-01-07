/**
 * Lottery Engine - Cryptographically Secure Random Number Generation
 * 
 * Implements unbiased, statistically sound lottery mechanics mirroring
 * established systems like UAE Lottery and PCSO. Each draw is an independent
 * event with no deterministic patterns.
 */

/**
 * Cryptographically secure random number generator using Web Crypto API
 */
class CryptoRandom {
    /**
     * Generate a cryptographically secure random integer in range [min, max] inclusive
     */
    static getInt(min: number, max: number): number {
        if (min > max) {
            throw new Error('min must be less than or equal to max');
        }

        const range = max - min + 1;

        // Calculate the number of bytes needed
        const bytesNeeded = Math.ceil(Math.log2(range) / 8) || 1;
        const maxValid = Math.floor((256 ** bytesNeeded) / range) * range - 1;

        let randomValue: number;
        const buffer = new Uint8Array(bytesNeeded);

        // Rejection sampling to ensure uniform distribution
        do {
            crypto.getRandomValues(buffer);
            randomValue = 0;
            for (let i = 0; i < bytesNeeded; i++) {
                randomValue = (randomValue << 8) | buffer[i];
            }
        } while (randomValue > maxValid);

        return min + (randomValue % range);
    }

    /**
     * Fisher-Yates shuffle using cryptographic randomness
     */
    static shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = CryptoRandom.getInt(0, i);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
}

/**
 * Lottery configuration for different lottery types
 */
export interface LotteryConfig {
    name: string;
    mainPoolSize: number;      // Size of main number pool (e.g., 69 for Powerball)
    mainPickCount: number;     // How many main numbers to pick (e.g., 5 for Powerball)
    bonusPoolSize: number;     // Size of bonus pool (e.g., 26 for Powerball)
    bonusPickCount: number;    // How many bonus numbers (usually 1)
}

/**
 * Standard lottery configurations
 */
export const LOTTERY_CONFIGS: Record<string, LotteryConfig> = {
    POWERBALL: {
        name: 'Powerball (US)',
        mainPoolSize: 69,
        mainPickCount: 5,
        bonusPoolSize: 26,
        bonusPickCount: 1,
    },
    UAE_LOTTERY: {
        name: 'UAE Lottery',
        mainPoolSize: 49,
        mainPickCount: 6,
        bonusPoolSize: 0,
        bonusPickCount: 0,
    },
    PCSO_6_49: {
        name: 'PCSO 6/49',
        mainPoolSize: 49,
        mainPickCount: 6,
        bonusPoolSize: 0,
        bonusPickCount: 0,
    },
    PCSO_6_58: {
        name: 'PCSO Ultra Lotto 6/58',
        mainPoolSize: 58,
        mainPickCount: 6,
        bonusPoolSize: 0,
        bonusPickCount: 0,
    },
};

/**
 * Result of a single lottery draw
 */
export interface LotteryDraw {
    mainNumbers: number[];
    bonusNumbers: number[];
    timestamp: number;
}

/**
 * Extended draw result with statistical metadata
 */
export interface LotteryDrawWithStats extends LotteryDraw {
    sum: number;
    oddCount: number;
    evenCount: number;
    lowCount: number;
    highCount: number;
}

/**
 * Main Lottery Engine class
 * 
 * Generates purely random lottery numbers using cryptographic randomness.
 * Each draw is treated as an independent event with no memory of previous draws.
 */
export class LotteryEngine {
    private config: LotteryConfig;

    constructor(config: LotteryConfig = LOTTERY_CONFIGS.POWERBALL) {
        this.config = config;
    }

    /**
     * Generate a single lottery draw
     * 
     * Uses rejection-free sampling from a shuffled pool to ensure
     * uniform probability for each number combination.
     */
    generateDraw(): LotteryDrawWithStats {
        // Generate main numbers by sampling without replacement
        const mainNumbers = this.sampleWithoutReplacement(
            this.config.mainPoolSize,
            this.config.mainPickCount
        );

        // Sort main numbers in ascending order (standard lottery display)
        mainNumbers.sort((a, b) => a - b);

        // Generate bonus numbers (each drawn independently from their pool)
        const bonusNumbers: number[] = [];
        for (let i = 0; i < this.config.bonusPickCount; i++) {
            bonusNumbers.push(CryptoRandom.getInt(1, this.config.bonusPoolSize));
        }

        // Calculate statistics
        const sum = mainNumbers.reduce((a, b) => a + b, 0);
        const oddCount = mainNumbers.filter(n => n % 2 === 1).length;
        const evenCount = mainNumbers.filter(n => n % 2 === 0).length;
        const midpoint = Math.floor(this.config.mainPoolSize / 2);
        const lowCount = mainNumbers.filter(n => n <= midpoint).length;
        const highCount = mainNumbers.filter(n => n > midpoint).length;

        return {
            mainNumbers,
            bonusNumbers,
            timestamp: Date.now(),
            sum,
            oddCount,
            evenCount,
            lowCount,
            highCount,
        };
    }

    /**
     * Generate multiple independent draws
     * 
     * Each draw is completely independent - no "memory" or patterns
     * between consecutive draws.
     */
    generateBulkDraws(count: number): LotteryDrawWithStats[] {
        const draws: LotteryDrawWithStats[] = [];
        for (let i = 0; i < count; i++) {
            draws.push(this.generateDraw());
        }
        return draws;
    }

    /**
     * Sample k numbers from pool of size n without replacement
     * Uses Fisher-Yates partial shuffle for O(k) complexity
     */
    private sampleWithoutReplacement(poolSize: number, pickCount: number): number[] {
        // Create array of all possible numbers
        const pool = Array.from({ length: poolSize }, (_, i) => i + 1);

        // Partial Fisher-Yates shuffle - only shuffle first pickCount elements
        for (let i = 0; i < pickCount; i++) {
            const j = CryptoRandom.getInt(i, poolSize - 1);
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Return first pickCount elements
        return pool.slice(0, pickCount);
    }

    /**
     * Get the configuration for this engine
     */
    getConfig(): LotteryConfig {
        return { ...this.config };
    }

    /**
     * Calculate the total number of possible combinations
     */
    getTotalCombinations(): number {
        const mainCombinations = this.binomial(
            this.config.mainPoolSize,
            this.config.mainPickCount
        );

        const bonusCombinations = this.config.bonusPickCount > 0
            ? Math.pow(this.config.bonusPoolSize, this.config.bonusPickCount)
            : 1;

        return mainCombinations * bonusCombinations;
    }

    /**
     * Calculate binomial coefficient C(n, k)
     */
    private binomial(n: number, k: number): number {
        if (k > n) return 0;
        if (k === 0 || k === n) return 1;

        let result = 1;
        for (let i = 0; i < k; i++) {
            result = result * (n - i) / (i + 1);
        }
        return Math.round(result);
    }
}

/**
 * Statistical tests for randomness validation
 */
export class RandomnessValidator {
    /**
     * Chi-square test for uniform distribution
     * Returns p-value - values > 0.01 suggest acceptable uniformity
     */
    static chiSquareUniformityTest(
        samples: number[],
        min: number,
        max: number
    ): { chiSquare: number; degreesOfFreedom: number; isUniform: boolean } {
        const range = max - min + 1;
        const expected = samples.length / range;

        // Count occurrences
        const observed = new Array(range).fill(0);
        for (const sample of samples) {
            if (sample >= min && sample <= max) {
                observed[sample - min]++;
            }
        }

        // Calculate chi-square statistic
        let chiSquare = 0;
        for (let i = 0; i < range; i++) {
            chiSquare += Math.pow(observed[i] - expected, 2) / expected;
        }

        const degreesOfFreedom = range - 1;

        // Critical value for df=68, alpha=0.01 is approximately 95.08
        // For smaller ranges, use approximation
        const criticalValue = degreesOfFreedom + 2.33 * Math.sqrt(2 * degreesOfFreedom);

        return {
            chiSquare,
            degreesOfFreedom,
            isUniform: chiSquare < criticalValue,
        };
    }

    /**
     * Runs test for independence
     * Tests if consecutive values show random variation
     */
    static runsTest(samples: number[]): { runs: number; expectedRuns: number; isIndependent: boolean } {
        if (samples.length < 2) {
            return { runs: 0, expectedRuns: 0, isIndependent: true };
        }

        const median = [...samples].sort((a, b) => a - b)[Math.floor(samples.length / 2)];

        // Convert to binary sequence (above/below median)
        const binary = samples.map(s => s > median ? 1 : 0);

        // Count runs
        let runs = 1;
        for (let i = 1; i < binary.length; i++) {
            if (binary[i] !== binary[i - 1]) {
                runs++;
            }
        }

        // Calculate expected runs and standard deviation
        const n1 = binary.filter(b => b === 1).length;
        const n2 = binary.filter(b => b === 0).length;
        const n = n1 + n2;

        const expectedRuns = (2 * n1 * n2 / n) + 1;
        const variance = (2 * n1 * n2 * (2 * n1 * n2 - n)) / (n * n * (n - 1));
        const stdDev = Math.sqrt(variance);

        // Z-score should be within [-1.96, 1.96] for 95% confidence
        const zScore = (runs - expectedRuns) / stdDev;

        return {
            runs,
            expectedRuns,
            isIndependent: Math.abs(zScore) < 1.96,
        };
    }
}

/**
 * Default lottery engine instance (Powerball configuration)
 */
export const defaultLotteryEngine = new LotteryEngine(LOTTERY_CONFIGS.POWERBALL);
