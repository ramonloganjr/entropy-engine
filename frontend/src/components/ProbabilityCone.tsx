'use client';

import { useState, useEffect } from 'react';
import { OptimizationStats } from '@/lib/api';
import { ChartIcon, FilterIcon } from '@/components/Icons';

interface ProbabilityConeProps {
    stats: OptimizationStats | null;
    isGenerating: boolean;
}

export default function ProbabilityCone({ stats, isGenerating }: ProbabilityConeProps) {
    const [animatedWidth, setAnimatedWidth] = useState(100);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (stats && !isGenerating) {
            setTimeout(() => {
                const reduction = 100 / stats.reduction_factor;
                setAnimatedWidth(reduction);
                setShowFilters(true);
            }, 200);
        } else {
            setAnimatedWidth(100);
            setShowFilters(false);
        }
    }, [stats, isGenerating]);

    const formatOdds = (odds: string) => {
        return odds.replace('1 in ', '');
    };

    return (
        <section className="glass-card p-6 lg:p-8">
            {/* Header */}
            <header className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--accent-primary-soft)]">
                    <ChartIcon size={20} color="var(--accent-primary)" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        Probability Cone
                    </h2>
                    <p className="text-sm text-[var(--text-tertiary)]">
                        Visualizing variance reduction
                    </p>
                </div>
            </header>

            {/* Original Odds Bar */}
            <div className="mb-4">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                        Standard Odds
                    </span>
                    <span className="text-sm font-mono text-[var(--text-tertiary)]">
                        1 : {stats ? formatOdds(stats.original_odds) : '292,201,338'}
                    </span>
                </div>
                <div className="odds-bar-container">
                    <div className="odds-bar original w-full">
                        Base Pool
                    </div>
                </div>
            </div>

            {/* Optimized Odds Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-medium text-[var(--accent-success)]">
                        Optimized Odds
                    </span>
                    <span className="text-sm font-mono font-semibold text-[var(--accent-success)]">
                        1 : {stats ? formatOdds(stats.estimated_filtered_odds) : '138,896,784'}
                    </span>
                </div>
                <div className="odds-bar-container">
                    <div
                        className="odds-bar optimized"
                        style={{ width: `${animatedWidth}%` }}
                    >
                        {stats ? `${stats.reduction_factor}x Reduction` : 'Calculating...'}
                    </div>
                </div>
            </div>

            {/* Filter Breakdown */}
            {showFilters && stats && (
                <div className="pt-4 border-t border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 mb-3">
                        <FilterIcon size={14} color="var(--text-secondary)" />
                        <h3 className="text-sm font-medium text-[var(--text-secondary)]">
                            Active Filters
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FilterBadge
                            name="Sum Analysis"
                            value={stats.filters_applied.sum_total_analysis}
                        />
                        <FilterBadge
                            name="Low/High Ratio"
                            value={stats.filters_applied.low_high_ratio}
                        />
                        <FilterBadge
                            name="Odd/Even Parity"
                            value={stats.filters_applied.odd_even_parity}
                        />
                        <FilterBadge
                            name="Consecutive"
                            value={stats.filters_applied.consecutive_filter}
                        />
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isGenerating && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[var(--accent-primary)]">
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
                    <span className="text-xs font-medium">Reducing Entropy...</span>
                </div>
            )}
        </section>
    );
}

function FilterBadge({ name, value }: { name: string; value: string }) {
    return (
        <div className="filter-tag">
            <div className="flex-1">
                <div className="text-[10px] text-[var(--text-tertiary)]">{name}</div>
                <div className="text-xs font-semibold text-[var(--accent-primary)]">{value}</div>
            </div>
        </div>
    );
}
