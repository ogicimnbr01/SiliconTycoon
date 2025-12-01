import React from 'react';
import { GameState } from '../../types';
import { TRANSLATIONS } from '../../constants';
import { Button } from '../ui/Button';
import { Lock, AlertTriangle } from 'lucide-react';

interface BankViewProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onTakeLoan: (amount: number) => void;
    onPayLoan: (loanId: string) => void;
}

export const BankView: React.FC<BankViewProps> = ({ gameState, language, onTakeLoan, onPayLoan }) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {[10000, 50000, 100000, 500000].map(amt => {
                    let reqLevel = 0;
                    if (amt === 100000) reqLevel = 2;
                    if (amt === 500000) reqLevel = 3;
                    const isLocked = gameState.officeLevel < reqLevel;
                    return (
                        <button
                            key={amt}
                            onClick={() => !isLocked && onTakeLoan(amt)}
                            disabled={isLocked}
                            className={`border p-4 rounded-2xl text-left relative overflow-hidden transition-all ${isLocked
                                ? 'bg-slate-950 border-slate-800 opacity-60 cursor-not-allowed'
                                : 'bg-slate-900 border-emerald-500/30 hover:bg-emerald-500/10 active:scale-95'
                                }`}
                        >
                            {isLocked && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 backdrop-blur-[2px]">
                                    <Lock size={24} className="text-slate-500 mb-2" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center px-2 leading-tight">
                                        {t.needUpgrade}
                                    </span>
                                </div>
                            )}
                            <div className={`text-[10px] font-bold uppercase mb-1 ${isLocked ? 'text-slate-600' : 'text-emerald-500'}`}>{t.takeLoan}</div>
                            <div className="text-xl font-black text-white">${amt.toLocaleString()}</div>
                            <div className="text-[10px] text-amber-400 mt-2 font-mono flex items-center gap-1 font-bold">
                                <AlertTriangle size={10} />
                                {t.dailyInterest}: ${(amt * 0.015).toFixed(0)}
                            </div>
                        </button>
                    );
                })}
            </div>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-6 mb-2">{t.activeLoans}</h3>

            {gameState.loans.length === 0 ? (
                <div className="text-center py-8 text-slate-600 font-bold text-sm bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">{t.noActiveDebt}</div>
            ) : (
                gameState.loans.map(loan => (
                    <div
                        key={loan.id}
                        className="bg-slate-900 border-l-4 border-red-500 p-4 rounded-r-xl shadow-[0_0_15px_rgba(239,68,68,0.2)] flex justify-between items-center mb-2 relative overflow-hidden"
                    >
                        {/* Subtle red glow background */}
                        <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="font-bold text-white text-lg">${loan.amount.toLocaleString()}</div>
                            <div className="text-xs text-red-400 font-mono font-bold">-{loan.dailyPayment}$ / day</div>
                        </div>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onPayLoan(loan.id)}
                            disabled={gameState.money < loan.amount}
                            className="relative z-10"
                        >
                            {t.payLoan}
                        </Button>
                    </div>
                ))
            )}
        </div>
    );
};
