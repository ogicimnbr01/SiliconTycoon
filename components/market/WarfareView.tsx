import React from 'react';
import { GameState } from '../../types';
import { TRANSLATIONS } from '../../constants';
import { Button } from '../ui/Button';
import { Briefcase, Skull, Trophy } from 'lucide-react';

interface WarfareViewProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onCovertOp: (type: 'espionage' | 'sabotage') => void;
    onRetire: () => void;
}

export const WarfareView: React.FC<WarfareViewProps> = ({ gameState, language, onCovertOp, onRetire }) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

    return (
        <div className="grid gap-4">
            <button onClick={() => onCovertOp('espionage')} className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl border border-indigo-500/30 text-left relative overflow-hidden group active:scale-95 transition-transform">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Briefcase size={80} /></div>
                <div className="text-indigo-400 font-black uppercase tracking-widest mb-1">{t.espionage}</div>
                <div className="text-2xl text-white font-bold mb-3">{t.stealTech}</div>
                <div className="text-xs text-indigo-300/70">Select a target to see pricing</div>
            </button>
            <button onClick={() => onCovertOp('sabotage')} className="bg-gradient-to-br from-slate-900 to-red-950 p-6 rounded-2xl border border-red-500/30 text-left relative overflow-hidden group active:scale-95 transition-transform">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Skull size={80} /></div>
                <div className="text-red-400 font-black uppercase tracking-widest mb-1">{t.sabotage}</div>
                <div className="text-2xl text-white font-bold mb-3">{t.crippleRivals}</div>
                <div className="text-xs text-red-300/70">Select a target to see pricing</div>
            </button>

            {/* Prestige / Ascend Button */}
            <div className="mt-8 pt-8 border-t border-slate-800">
                <button
                    onClick={onRetire}
                    className="w-full py-6 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center gap-4 group transition-all active:scale-95"
                >
                    <div className="bg-white/20 p-3 rounded-xl text-white group-hover:scale-110 transition-transform">
                        <Trophy size={32} fill="currentColor" />
                    </div>
                    <div className="text-left">
                        <div className="text-xs font-black text-amber-900 uppercase tracking-widest">End Run</div>
                        <div className="text-2xl font-black text-white leading-none">ASCEND / PRESTIGE</div>
                    </div>
                </button>
                <p className="text-center text-xs text-slate-500 mt-3 font-medium">
                    Reset progress to gain permanent multipliers based on your Net Worth.
                </p>
            </div>
        </div>
    );
};
