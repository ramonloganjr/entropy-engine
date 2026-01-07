'use client';

import { TargetIcon, AlertIcon, ExternalLinkIcon } from '@/components/Icons';

interface RealityCheckProps {
    ticketsGenerated: number;
    ticketCost?: number;
    onClose: () => void;
}

export default function RealityCheck({
    ticketsGenerated,
    ticketCost = 2,
    onClose
}: RealityCheckProps) {
    const totalCost = ticketsGenerated * ticketCost;
    const expectedReturn = totalCost * 0.5;
    const expectedLoss = totalCost - expectedReturn;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <header className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--accent-warning-soft)]">
                        <TargetIcon size={20} color="var(--accent-warning)" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                            Reality Check
                        </h2>
                        <p className="text-xs text-[var(--text-tertiary)]">
                            Responsible gambling reminder
                        </p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="stat-box">
                        <div className="stat-value">{ticketsGenerated}</div>
                        <div className="stat-label">Tickets</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">₱{totalCost}</div>
                        <div className="stat-label">If Purchased</div>
                    </div>
                </div>

                {/* Statistical Breakdown */}
                <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg mb-4">
                    <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                        Statistical Perspective
                    </h3>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-tertiary)]">Expected Return</span>
                            <span className="font-mono text-[var(--accent-primary)]">
                                ~₱{expectedReturn.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-tertiary)]">Expected Loss</span>
                            <span className="font-mono text-[var(--accent-warning)]">
                                ~₱{expectedLoss.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-tertiary)]">Jackpot Odds</span>
                            <span className="font-mono text-[var(--text-secondary)]">
                                1 in 292M
                            </span>
                        </div>
                    </div>
                </div>

                {/* Warning Badge */}
                <div className="flex items-center gap-2 p-2.5 mb-4 bg-[var(--accent-warning-soft)] border border-[rgba(255,149,0,0.2)] rounded-lg">
                    <AlertIcon size={14} color="var(--accent-warning)" />
                    <span className="text-xs text-[#cc7700]">
                        Play responsibly. Never spend more than you can afford.
                    </span>
                </div>

                {/* Actions */}
                <button onClick={onClose} className="btn-primary w-full mb-3">
                    I Understand
                </button>


            </div>
        </div>
    );
}
