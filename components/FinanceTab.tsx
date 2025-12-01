import React, { useState } from 'react';
import { GameState, TabType } from '../types';
import { TRANSLATIONS } from '../constants';
import { Button } from './ui/Button';
import { Minus, Plus, Lock, BarChart3, Building } from 'lucide-react';
import { format } from '../utils/gameUtils';
import { StocksView } from './finance/StocksView';
import { BankView } from './finance/BankView';

interface FinanceTabProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onBuyStock: (stockId: string, amount: number) => void;
    onSellStock: (stockId: string, amount: number) => void;
    onIPO: () => void;
    onTakeLoan: (amount: number) => void;
    onPayLoan: (loanId: string) => void;
    onTradeOwnShares: (action: 'buy' | 'sell', amount: number) => void;
    unlockedTabs: TabType[];
}

const FinanceTab: React.FC<FinanceTabProps> = ({
    gameState,
    language,
    onBuyStock,
    onSellStock,
    onIPO,
    onTakeLoan,
    onPayLoan,
    onTradeOwnShares,
    unlockedTabs
}) => {
    const [view, setView] = useState<'stocks' | 'bank'>('stocks');
    const [ipoModalOpen, setIpoModalOpen] = useState(false);

    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

    const handleIPO = () => {
        setIpoModalOpen(true);
    };

    const confirmIPO = () => {
        onIPO();
        setIpoModalOpen(false);
    };

    const PillButton = ({ id, label, icon: Icon, locked }: { id: typeof view, label: string, icon: any, locked?: boolean }) => (
        <button
            onClick={() => !locked && setView(id)}
            className={`flex items-center gap-2 px-3 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex-1 justify-center relative group ${locked
                ? 'bg-transparent text-slate-700 cursor-not-allowed'
                : view === id
                    ? 'bg-slate-800 text-white shadow-lg border border-slate-700'
                    : 'bg-transparent text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                }`}
        >
            {locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 rounded-full backdrop-blur-[1px]">
                    <Lock size={12} className="text-slate-500 mr-1" />
                    <span className="text-[8px] font-bold text-slate-400">{t.locked}</span>
                </div>
            )}
            <Icon size={14} />
            {label}
        </button>
    );

    return (
        <div className="flex flex-col gap-6 pt-2 pb-8 pb-[env(safe-area-inset-bottom)] relative h-full overflow-y-auto">
            {/* IPO Confirmation Modal */}
            {ipoModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
                        <div className="p-6">
                            <h3 className="text-xl font-black text-white mb-2">{t.ipoConfirmTitle}</h3>
                            <p className="text-slate-400 text-sm mb-4">{t.ipoConfirmDesc}</p>

                            <div className="bg-slate-800 rounded-xl p-4 mb-4 space-y-2">
                                <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                                    <Minus size={14} />
                                    {t.ipoShareSale}
                                </div>
                                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                    <Plus size={14} />
                                    {(() => {
                                        const techValue = (gameState.techLevels['CPU'] * 50000) + (gameState.techLevels['GPU'] * 50000);
                                        const rpValue = gameState.rp * 10;
                                        const repValue = gameState.reputation * 2000;
                                        const valuation = gameState.money + techValue + rpValue + repValue;
                                        const cashRaised = Math.floor(valuation * 0.40);
                                        return format(t.ipoCashGain, cashRaised.toLocaleString());
                                    })()}
                                </div>
                            </div>

                            <p className="text-[10px] text-amber-500 font-bold mb-6 uppercase tracking-wide">
                                {t.ipoWarning}
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="secondary" onClick={() => setIpoModalOpen(false)}>{t.cancel}</Button>
                                <Button variant="primary" onClick={confirmIPO}>{t.confirm}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-1">
                <div className="flex gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                    <PillButton id="stocks" label={t.stocks} icon={BarChart3} />
                    <PillButton id="bank" label={t.bank} icon={Building} />
                </div>
            </div>

            <div className="space-y-4 px-1">
                {view === 'stocks' && (
                    <StocksView
                        gameState={gameState}
                        language={language}
                        onBuyStock={onBuyStock}
                        onSellStock={onSellStock}
                        onIPO={handleIPO}
                        onTradeOwnShares={onTradeOwnShares}
                    />
                )}

                {view === 'bank' && (
                    <BankView
                        gameState={gameState}
                        language={language}
                        onTakeLoan={onTakeLoan}
                        onPayLoan={onPayLoan}
                    />
                )}
            </div>
        </div >
    );
};

export default React.memo(FinanceTab);
