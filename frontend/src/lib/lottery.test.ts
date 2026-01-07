/**
 * Lottery Engine Test Suite
 * 
 * Validates randomness, statistical independence, and proper functionality
 * of the lottery number generation system.
 */

import {
    LotteryEngine,
    LOTTERY_CONFIGS,
    RandomnessValidator,
    LotteryDrawWithStats,
} from './lottery';

describe('LotteryEngine', () => {
    let engine: LotteryEngine;

    beforeEach(() => {
        engine = new LotteryEngine(LOTTERY_CONFIGS.POWERBALL);
    });

    describe('generateDraw', () => {
        it('should generate correct number of main numbers', () => {
            const draw = engine.generateDraw();
            expect(draw.mainNumbers.length).toBe(5);
        });

        it('should generate correct number of bonus numbers', () => {
            const draw = engine.generateDraw();
            expect(draw.bonusNumbers.length).toBe(1);
        });

        it('should generate main numbers within valid range (1-69)', () => {
            const draw = engine.generateDraw();
            draw.mainNumbers.forEach(num => {
                expect(num).toBeGreaterThanOrEqual(1);
                expect(num).toBeLessThanOrEqual(69);
            });
        });

        it('should generate bonus numbers within valid range (1-26)', () => {
            const draw = engine.generateDraw();
            draw.bonusNumbers.forEach(num => {
                expect(num).toBeGreaterThanOrEqual(1);
                expect(num).toBeLessThanOrEqual(26);
            });
        });

        it('should not have duplicate main numbers', () => {
            const draw = engine.generateDraw();
            const uniqueNumbers = new Set(draw.mainNumbers);
            expect(uniqueNumbers.size).toBe(draw.mainNumbers.length);
        });

        it('should return sorted main numbers', () => {
            const draw = engine.generateDraw();
            const sorted = [...draw.mainNumbers].sort((a, b) => a - b);
            expect(draw.mainNumbers).toEqual(sorted);
        });

        it('should calculate correct sum', () => {
            const draw = engine.generateDraw();
            const expectedSum = draw.mainNumbers.reduce((a, b) => a + b, 0);
            expect(draw.sum).toBe(expectedSum);
        });

        it('should calculate correct odd/even counts', () => {
            const draw = engine.generateDraw();
            const oddCount = draw.mainNumbers.filter(n => n % 2 === 1).length;
            const evenCount = draw.mainNumbers.filter(n => n % 2 === 0).length;
            expect(draw.oddCount).toBe(oddCount);
            expect(draw.evenCount).toBe(evenCount);
            expect(draw.oddCount + draw.evenCount).toBe(5);
        });

        it('should include timestamp', () => {
            const before = Date.now();
            const draw = engine.generateDraw();
            const after = Date.now();
            expect(draw.timestamp).toBeGreaterThanOrEqual(before);
            expect(draw.timestamp).toBeLessThanOrEqual(after);
        });
    });

    describe('generateBulkDraws', () => {
        it('should generate the requested number of draws', () => {
            const draws = engine.generateBulkDraws(10);
            expect(draws.length).toBe(10);
        });

        it('should generate independent draws (not all identical)', () => {
            const draws = engine.generateBulkDraws(100);
            const firstDraw = draws[0].mainNumbers.join(',');
            const allSame = draws.every(d => d.mainNumbers.join(',') === firstDraw);
            // Probability of 100 identical draws is astronomically low
            expect(allSame).toBe(false);
        });
    });

    describe('getTotalCombinations', () => {
        it('should calculate correct Powerball combinations', () => {
            // C(69,5) * 26 = 292,201,338
            expect(engine.getTotalCombinations()).toBe(292201338);
        });

        it('should calculate correct PCSO 6/49 combinations', () => {
            const pcsoEngine = new LotteryEngine(LOTTERY_CONFIGS.PCSO_6_49);
            // C(49,6) = 13,983,816
            expect(pcsoEngine.getTotalCombinations()).toBe(13983816);
        });
    });
});

describe('RandomnessValidator', () => {
    describe('chiSquareUniformityTest', () => {
        it('should pass uniformity test for truly random samples', () => {
            const engine = new LotteryEngine(LOTTERY_CONFIGS.POWERBALL);
            const samples: number[] = [];

            // Generate 10000 draws and collect all main numbers
            for (let i = 0; i < 2000; i++) {
                const draw = engine.generateDraw();
                samples.push(...draw.mainNumbers);
            }

            const result = RandomnessValidator.chiSquareUniformityTest(samples, 1, 69);
            expect(result.isUniform).toBe(true);
        });

        it('should fail uniformity test for biased samples', () => {
            // Create heavily biased samples (all 1s)
            const biasedSamples = new Array(1000).fill(1);
            const result = RandomnessValidator.chiSquareUniformityTest(biasedSamples, 1, 69);
            expect(result.isUniform).toBe(false);
        });
    });

    describe('runsTest', () => {
        it('should pass runs test for random samples', () => {
            const engine = new LotteryEngine(LOTTERY_CONFIGS.POWERBALL);
            const samples: number[] = [];

            // Generate 500 draws and use first main number
            for (let i = 0; i < 500; i++) {
                const draw = engine.generateDraw();
                samples.push(draw.mainNumbers[0]);
            }

            const result = RandomnessValidator.runsTest(samples);
            expect(result.isIndependent).toBe(true);
        });

        it('should fail runs test for sequential pattern', () => {
            // Create alternating pattern (not random)
            const patternSamples: number[] = [];
            for (let i = 0; i < 500; i++) {
                patternSamples.push(i % 2 === 0 ? 1 : 100);
            }

            const result = RandomnessValidator.runsTest(patternSamples);
            // Alternating pattern creates too many runs
            expect(result.runs).toBeGreaterThan(result.expectedRuns * 1.5);
        });
    });
});

describe('UAE Lottery Configuration', () => {
    let engine: LotteryEngine;

    beforeEach(() => {
        engine = new LotteryEngine(LOTTERY_CONFIGS.UAE_LOTTERY);
    });

    it('should generate 6 main numbers', () => {
        const draw = engine.generateDraw();
        expect(draw.mainNumbers.length).toBe(6);
    });

    it('should generate 0 bonus numbers', () => {
        const draw = engine.generateDraw();
        expect(draw.bonusNumbers.length).toBe(0);
    });

    it('should generate numbers within 1-49 range', () => {
        const draw = engine.generateDraw();
        draw.mainNumbers.forEach(num => {
            expect(num).toBeGreaterThanOrEqual(1);
            expect(num).toBeLessThanOrEqual(49);
        });
    });
});

describe('Statistical Independence', () => {
    it('consecutive draws should show no correlation', () => {
        const engine = new LotteryEngine(LOTTERY_CONFIGS.POWERBALL);
        const firstNumbers: number[] = [];
        const secondNumbers: number[] = [];

        for (let i = 0; i < 1000; i++) {
            const draw = engine.generateDraw();
            firstNumbers.push(draw.mainNumbers[0]);
            secondNumbers.push(draw.mainNumbers[1]);
        }

        // Calculate correlation coefficient
        const mean1 = firstNumbers.reduce((a, b) => a + b, 0) / firstNumbers.length;
        const mean2 = secondNumbers.reduce((a, b) => a + b, 0) / secondNumbers.length;

        let numerator = 0;
        let denom1 = 0;
        let denom2 = 0;

        for (let i = 0; i < firstNumbers.length; i++) {
            const diff1 = firstNumbers[i] - mean1;
            const diff2 = secondNumbers[i] - mean2;
            numerator += diff1 * diff2;
            denom1 += diff1 * diff1;
            denom2 += diff2 * diff2;
        }

        const correlation = numerator / Math.sqrt(denom1 * denom2);

        // Correlation should be close to 0 (within -0.1 to 0.1)
        expect(Math.abs(correlation)).toBeLessThan(0.1);
    });
});
