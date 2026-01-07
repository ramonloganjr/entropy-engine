'use client';

import { useState, useEffect } from 'react';
import {
  generateOptimizedSet,
  getFailureStats,
  GenerateResponse,
  FailureStats
} from '@/lib/api';
import ProbabilityCone from '@/components/ProbabilityCone';
import TicketScanner from '@/components/TicketScanner';
import RealityCheck from '@/components/RealityCheck';
import LotteryBalls from '@/components/LotteryBalls';
import Footer from '@/components/Footer';
import {
  DiceIcon,
  DatabaseIcon,
  ShieldIcon,
  AlertIcon
} from '@/components/Icons';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [failureStats, setFailureStats] = useState<FailureStats | null>(null);
  const [totalGenerated, setTotalGenerated] = useState(0);
  const [showRealityCheck, setShowRealityCheck] = useState(false);
  const [generateCount, setGenerateCount] = useState(10);

  useEffect(() => {
    getFailureStats().then(setFailureStats);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const result = await generateOptimizedSet(generateCount);
      setData(result);

      const newTotal = totalGenerated + result.count;
      setTotalGenerated(newTotal);

      if (Math.floor(newTotal / 50) > Math.floor(totalGenerated / 50)) {
        setTimeout(() => setShowRealityCheck(true), 1000);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="w-full py-10 md:py-12 lg:py-14 px-6 sm:px-8 lg:px-10 text-center relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Logo */}
          <img
            src="/logo.svg"
            alt="The Entropy Engine"
            className="h-10 md:h-12 lg:h-14 w-auto mb-4"
            style={{ maxWidth: '320px' }}
          />
          <p className="text-base md:text-lg text-[var(--text-secondary)] mb-4 max-w-lg mx-auto leading-relaxed">
            Variance Reduction Through Inverse Probability
          </p>
          <div className="badge badge-warning inline-flex">
            <ShieldIcon size={14} />
            <span>For Entertainment Only</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-6 sm:px-8 lg:px-10 pb-10 relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Generator */}
            <div className="lg:col-span-2 space-y-6">
              {/* Probability Cone */}
              <ProbabilityCone
                stats={data?.optimization_stats || null}
                isGenerating={isGenerating}
              />

              {/* Generator Controls */}
              <section className="glass-card p-6 lg:p-8">
                <header className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--accent-primary-soft)]">
                    <DiceIcon size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                      Number Generator
                    </h2>
                    <p className="text-sm text-[var(--text-tertiary)]">
                      Cryptographically secure combinations
                    </p>
                  </div>
                </header>

                {/* Controls Row */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex items-center gap-3 flex-1">
                    <label className="text-sm text-[var(--text-secondary)] shrink-0">
                      Generate:
                    </label>
                    <select
                      value={generateCount}
                      onChange={(e) => setGenerateCount(Number(e.target.value))}
                      className="select-field flex-1"
                    >
                      <option value={5}>5 combinations</option>
                      <option value={10}>10 combinations</option>
                      <option value={20}>20 combinations</option>
                      <option value={50}>50 combinations</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="btn-primary sm:w-auto"
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                        Processing...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="stat-box">
                    <div className="stat-value">{totalGenerated}</div>
                    <div className="stat-label">Generated</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{data?.exclusions_applied || 0}</div>
                    <div className="stat-label">Excluded</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">
                      {failureStats?.total_submissions || 0}
                    </div>
                    <div className="stat-label">Data Points</div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-quaternary)]">
                  <AlertIcon size={14} color="var(--text-quaternary)" />
                  <span>Each combination is statistically independent</span>
                </div>
              </section>

              {/* Generated Numbers */}
              {data && data.combinations.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] px-1">
                    Generated Combinations
                  </h3>
                  {data.combinations.map((combo, index) => (
                    <LotteryBalls
                      key={`${combo.white_balls.join('-')}-${combo.powerball}-${index}`}
                      combination={combo}
                      index={index}
                    />
                  ))}
                </section>
              )}
            </div>

            {/* Right Column - Scanner & Stats */}
            <aside className="space-y-6">
              <TicketScanner
                onScanComplete={() => {
                  getFailureStats().then(setFailureStats);
                }}
              />

              {/* Community Stats */}
              {failureStats && (
                <section className="glass-card p-6">
                  <header className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--accent-success-soft)]">
                      <DatabaseIcon size={20} color="var(--accent-success)" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Learning Database
                      </h3>
                      <p className="text-sm text-[var(--text-tertiary)]">
                        Inverse learning stats
                      </p>
                    </div>
                  </header>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-tertiary)]">Total Data Points</span>
                      <span className="font-semibold text-[var(--accent-primary)]">
                        {failureStats.total_submissions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-tertiary)]">Last 30 Days</span>
                      <span className="font-semibold text-[var(--accent-success)]">
                        +{failureStats.recent_submissions_30d}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-tertiary)]">Unique Patterns</span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {failureStats.unique_patterns.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-quaternary)] mt-4">
                    Your contributions inform entropy reduction
                  </p>
                </section>
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Reality Check Modal */}
      {showRealityCheck && (
        <RealityCheck
          ticketsGenerated={totalGenerated}
          onClose={() => setShowRealityCheck(false)}
        />
      )}
    </div>
  );
}
