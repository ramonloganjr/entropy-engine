'use client';

import { useState, useCallback } from 'react';
import { scanTicket, submitLosingNumbers, ScanResult } from '@/lib/api';
import { CameraIcon, UploadIcon, CheckIcon } from '@/components/Icons';

interface TicketScannerProps {
    onScanComplete?: (result: ScanResult) => void;
}

export default function TicketScanner({ onScanComplete }: TicketScannerProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastResult, setLastResult] = useState<ScanResult | null>(null);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualNumbers, setManualNumbers] = useState({
        n1: '', n2: '', n3: '', n4: '', n5: '', pb: ''
    });

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            await processFile(file);
        }
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await processFile(file);
        }
    };

    const processFile = async (file: File) => {
        setIsProcessing(true);
        setLastResult(null);
        try {
            const result = await scanTicket(file);
            setLastResult(result);
            onScanComplete?.(result);
        } catch (error) {
            console.error('Scan failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleManualSubmit = async () => {
        const whiteBalls = [
            parseInt(manualNumbers.n1),
            parseInt(manualNumbers.n2),
            parseInt(manualNumbers.n3),
            parseInt(manualNumbers.n4),
            parseInt(manualNumbers.n5),
        ].filter(n => !isNaN(n) && n >= 1 && n <= 69);

        const powerball = parseInt(manualNumbers.pb);

        if (whiteBalls.length !== 5 || isNaN(powerball) || powerball < 1 || powerball > 26) {
            return;
        }

        setIsProcessing(true);
        setLastResult(null);
        try {
            const result = await submitLosingNumbers(whiteBalls, powerball);
            setLastResult(result);
            onScanComplete?.(result);
            setManualNumbers({ n1: '', n2: '', n3: '', n4: '', n5: '', pb: '' });
            setShowManualInput(false);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <section className="glass-card p-4">
            {/* Header */}
            <header className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--accent-primary-soft)]">
                    <CameraIcon size={16} color="var(--accent-primary)" />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">
                        Ticket Scanner
                    </h2>
                    <p className="text-xs text-[var(--text-tertiary)]">
                        Contribute losing numbers
                    </p>
                </div>
            </header>

            <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
                Your losses become data points for our inverse learning algorithm.
            </p>

            {!showManualInput ? (
                <>
                    <div
                        className={`upload-zone ${isDragging ? 'drag-over' : ''} ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input')?.click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {isProcessing ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="animate-spin inline-block w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full" />
                                <span className="text-xs text-[var(--text-secondary)]">Processing...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <UploadIcon size={24} color="var(--text-tertiary)" />
                                <span className="text-xs text-[var(--text-primary)] font-medium">
                                    Drop ticket image here
                                </span>
                                <span className="text-[10px] text-[var(--text-quaternary)]">
                                    or click to browse
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowManualInput(true)}
                        className="btn-secondary w-full mt-3 text-xs py-2"
                    >
                        Enter Manually
                    </button>
                </>
            ) : (
                <div className="space-y-3">
                    <div className="grid grid-cols-5 gap-1.5">
                        {['n1', 'n2', 'n3', 'n4', 'n5'].map((key, i) => (
                            <input
                                key={key}
                                type="number"
                                min="1"
                                max="69"
                                placeholder={`${i + 1}`}
                                value={manualNumbers[key as keyof typeof manualNumbers]}
                                onChange={(e) => setManualNumbers({ ...manualNumbers, [key]: e.target.value })}
                                className="input-field text-center text-xs py-2"
                            />
                        ))}
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-xs text-[var(--text-secondary)] shrink-0">PB:</label>
                        <input
                            type="number"
                            min="1"
                            max="26"
                            placeholder="Powerball"
                            value={manualNumbers.pb}
                            onChange={(e) => setManualNumbers({ ...manualNumbers, pb: e.target.value })}
                            className="input-field text-center flex-1 text-xs py-2"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleManualSubmit} className="btn-primary flex-1 text-xs py-2">
                            Submit
                        </button>
                        <button onClick={() => setShowManualInput(false)} className="btn-secondary text-xs py-2 px-4">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {lastResult?.success && (
                <div className="mt-3 p-3 bg-[var(--accent-success-soft)] border border-[rgba(52,199,89,0.2)] rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                        <CheckIcon size={14} color="var(--accent-success)" />
                        <span className="text-xs font-semibold text-[var(--accent-success)]">
                            Data Ingested
                        </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                        {lastResult.message}
                    </p>
                    {lastResult.extracted_numbers && (
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            {lastResult.extracted_numbers.white_balls.map((n, i) => (
                                <span key={i} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-bg-tertiary)] text-[10px] font-semibold">
                                    {n}
                                </span>
                            ))}
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-danger)] text-white text-[10px] font-semibold">
                                {lastResult.extracted_numbers.powerball}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
