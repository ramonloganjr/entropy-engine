'use client';

import { LotteryCombination } from '@/lib/api';

interface LotteryBallsProps {
    combination: LotteryCombination;
    index: number;
}

export default function LotteryBalls({ combination, index }: LotteryBallsProps) {
    return (
        <div
            className="glass-card p-3 flex items-center gap-3"
            style={{
                animationDelay: `${index * 40}ms`,
                animation: 'slideUp 250ms ease-out forwards',
                opacity: 0,
            }}
        >
            <span className="text-xs font-mono text-[var(--text-quaternary)] w-5 text-right">
                {String(index + 1).padStart(2, '0')}
            </span>

            <div className="flex items-center gap-1.5 flex-wrap flex-1">
                {combination.white_balls.map((num, i) => (
                    <div
                        key={i}
                        className="lottery-ball"
                        style={{
                            animationDelay: `${(index * 40) + (i * 30)}ms`,
                            animation: 'scaleIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                            opacity: 0,
                            transform: 'scale(0.85)',
                        }}
                    >
                        {num}
                    </div>
                ))}

                <div
                    className="lottery-ball powerball"
                    style={{
                        animationDelay: `${(index * 40) + 200}ms`,
                        animation: 'scaleIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        opacity: 0,
                        transform: 'scale(0.85)',
                    }}
                >
                    {combination.powerball}
                </div>
            </div>

            {/* Stats - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-[var(--text-quaternary)]">
                <span title="Sum" className="w-10 text-right">Σ{combination.sum}</span>
                <span title="Odd/Even" className="w-8">{combination.odd_count}/{combination.even_count}</span>
                <span title="Low/High" className="w-8">{combination.low_count}/{combination.high_count}</span>
            </div>

            <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
}
