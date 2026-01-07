'use client';

import { AlertIcon } from '@/components/Icons';

export default function Footer() {
    return (
        <footer className="footer w-full">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                {/* Disclaimer */}
                <div className="flex items-start gap-2 p-3 bg-[var(--accent-warning-soft)] border border-[rgba(255,149,0,0.15)] rounded-lg">
                    <AlertIcon size={14} color="var(--accent-warning)" />
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        <strong className="text-[#cc7700]">Disclaimer:</strong>{' '}
                        The Entropy Engine is for entertainment and mathematical exploration only.
                        No filtering system can guarantee or improve lottery winning odds.
                    </p>
                </div>

                {/* Copyright */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-quaternary)] pt-2 border-t border-[var(--glass-border)]">
                    <span>© 2026 The Entropy Engine</span>
                    <span>•</span>
                    <span>MIT | CC BY 4.0</span>
                </div>
            </div>
        </footer>
    );
}
