import React from 'react';
import { HackingResult } from '../types';
import { TRANSLATIONS } from '../constants';
import { X, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface HackingResultModalProps {
    result: HackingResult | null;
    onClose: () => void;
    language: 'en' | 'tr';
}

export const HackingResultModal: React.FC<HackingResultModalProps> = ({ result, onClose, language }) => {
    if (!result) return null;
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${result.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {result.success ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide text-center">
                        {result.success ? (result.type === 'espionage' ? 'Espionage Success' : 'Sabotage Success') : 'Operation Failed'}
                    </h2>
                    <p className="text-slate-400 text-sm font-mono mt-1 text-center">
                        Target: <span className="text-white font-bold">{result.targetName}</span>
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    {result.changes.map((change, i) => (
                        <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                            <span className="text-slate-400 text-xs font-bold uppercase">{change.label}</span>
                            <div className="flex items-center gap-2 font-mono text-sm">
                                <span className="text-slate-500">{change.before}</span>
                                <ArrowRight size={12} className="text-slate-600" />
                                <span className={change.isPositive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                    {change.after}
                                </span>
                            </div>
                        </div>
                    ))}
                    {result.rewardText && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center">
                            <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Reward: {result.rewardText}</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
                >
                    {t.close || "Close"}
                </button>
            </div>
        </div>
    );
};
