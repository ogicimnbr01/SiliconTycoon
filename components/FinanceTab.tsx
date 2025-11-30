import React, { useState } from 'react';
import { GameState, TabType } from '../types';
import { TRANSLATIONS } from '../constants';
import { Button } from './ui/Button';
import { DollarSign, Briefcase, Building2, BarChart3, Minus, Plus, Lock, Building } from 'lucide-react';
import { format } from '../utils/gameUtils';

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
    const [stockTradeAmount, setStockTradeAmount] = useState<number>(10);
    const [ipoModalOpen, setIpoModalOpen] = useState(false);

    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
    const isAdvancedUnlocked = unlockedTabs.includes('rnd'); // Assuming finance unlocks with R&D or similar, or just check if tab is active

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
                                    {format(t.ipoCashGain, (gameState.playerSharePrice * 4000).toLocaleString())}
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
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center shadow-lg">
                            {!gameState.isPubliclyTraded ? (
                                <>
                                    <Building2 size={48} className="mx-auto text-slate-700 mb-4" />
                                    <h3 className="text-xl font-black text-white mb-2">{t.privateCompany}</h3>
                                    <div className="text-sm text-slate-400 mb-6">{t.valuationGoal} {t.valuationGoalAmount}</div>
                                    <Button size="lg" variant="primary" className="w-full" disabled={gameState.money < 100000} onClick={handleIPO}>{t.launchIPO}</Button>
                                </>
                            ) : (
                                <div className="w-full">
                                    <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                                        <div className="text-left"><div className="text-emerald-400 text-3xl font-black tracking-tighter">SILC</div><div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{t.publiclyTraded}</div></div>
                                        <div className="text-right"><div className="text-2xl font-mono font-bold text-white">${gameState.playerSharePrice.toFixed(2)}</div><div className="text-[9px] text-slate-500 uppercase font-bold">{t.sharePrice}</div></div>
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 uppercase"><span>{t.ownership}</span><span className={gameState.playerCompanySharesOwned < 50 ? 'text-red-500' : 'text-white'}>{gameState.playerCompanySharesOwned}%</span></div>
                                        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700"><div className={`h-full transition-all duration-500 ${gameState.playerCompanySharesOwned < 50 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${gameState.playerCompanySharesOwned}%` }}></div></div>
                                        {gameState.playerCompanySharesOwned < 30 && (<div className="text-[9px] text-red-500 font-bold mt-1 animate-pulse">{t.ownershipWarning}</div>)}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => onTradeOwnShares('buy', 5)} disabled={gameState.money < (gameState.playerSharePrice * 500) || gameState.playerCompanySharesOwned >= 100} className="bg-emerald-900/30 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 font-bold text-xs uppercase hover:bg-emerald-500/20 disabled:opacity-50 active:scale-95 transition-all">{t.buyBack} (+5%)</button>
                                        <button onClick={() => onTradeOwnShares('sell', 5)} disabled={gameState.playerCompanySharesOwned <= 10} className="bg-red-900/30 border border-red-500/30 p-3 rounded-xl text-red-400 font-bold text-xs uppercase hover:bg-red-500/20 disabled:opacity-50 active:scale-95 transition-all">{t.dilute} (-5%)</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* STOCK TRADING PANEL */}
                        <div className="flex justify-end mb-2 px-1">
                            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                                {[10, 100, 1000].map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setStockTradeAmount(amt)}
                                        className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${stockTradeAmount === amt ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        x{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {gameState.stocks.map(stock => {
                            const avgPrice = stock.avgBuyPrice || 0;
                            const totalCost = avgPrice * stock.owned;
                            const currentValue = stock.currentPrice * stock.owned;
                            const profitLoss = currentValue - totalCost;
                            const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;
                            const isProfitable = profitLoss >= 0;

                            return (
                                <div key={stock.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-black text-slate-500 text-sm">{stock.symbol}</div>
                                            <div>
                                                <div className="font-bold text-white">{stock.name}</div>
                                                <div className="text-xs font-mono text-slate-400">${stock.currentPrice.toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold">{t.owned}</div>
                                            <div className="font-mono font-bold text-white text-lg">{stock.owned}</div>
                                        </div>
                                    </div>

                                    {stock.owned > 0 && (
                                        <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                                            <div>
                                                <div className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">{t.avgCost}</div>
                                                <div className="font-mono text-xs text-slate-300">${avgPrice.toFixed(2)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">{t.pl}</div>
                                                <div className={`font-mono text-xs font-bold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {isProfitable ? '+' : ''}{profitLoss.toFixed(0)} ({isProfitable ? '+' : ''}{profitLossPercent.toFixed(1)}%)
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button size="sm" variant="secondary" onClick={() => onBuyStock(stock.id, stockTradeAmount)} disabled={gameState.money < stock.currentPrice * stockTradeAmount} className="border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400"><Plus size={14} className="mr-1" /> {t.buy} {stockTradeAmount}</Button>
                                        <Button size="sm" variant="secondary" onClick={() => onSellStock(stock.id, stockTradeAmount)} disabled={stock.owned < stockTradeAmount} className="border-red-500/20 hover:bg-red-500/10 hover:text-red-400"><Minus size={14} className="mr-1" /> {t.sell} {stockTradeAmount}</Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {view === 'bank' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {[10000, 50000, 100000, 500000].map(amt => {
                                let reqLevel = 0;
                                if (amt === 100000) reqLevel = 2;
                                if (amt === 500000) reqLevel = 3;
                                const isLocked = gameState.officeLevel < reqLevel;
                                return (
                                    <button key={amt} onClick={() => !isLocked && onTakeLoan(amt)} disabled={isLocked} className={`border p-4 rounded-2xl text-left relative overflow-hidden transition-all ${isLocked ? 'bg-slate-950 border-slate-800 opacity-60 cursor-not-allowed' : 'bg-slate-900 border-emerald-500/30 hover:bg-emerald-500/10 active:scale-95'}`}>
                                        {isLocked && (<div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 backdrop-blur-[1px]"><Lock size={24} className="text-slate-500 mb-1" /><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.needUpgrade}</span></div>)}
                                        <div className={`text-[10px] font-bold uppercase mb-1 ${isLocked ? 'text-slate-600' : 'text-emerald-500'}`}>{t.takeLoan}</div>
                                        <div className="text-xl font-black text-white">${amt.toLocaleString()}</div>
                                        <div className="text-[9px] text-slate-500 mt-2 font-mono">{t.dailyInterest}: ${(amt * 0.015).toFixed(0)}</div>
                                    </button>
                                );
                            })}
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-6 mb-2">{t.activeLoans}</h3>
                        {gameState.loans.length === 0 ? (
                            <div className="text-center py-8 text-slate-600 font-bold text-sm bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">{t.noActiveDebt}</div>
                        ) : (
                            gameState.loans.map(loan => (
                                <div key={loan.id} className="bg-slate-900 border-l-4 border-red-500 p-4 rounded-r-xl shadow-md flex justify-between items-center mb-2">
                                    <div><div className="font-bold text-white text-lg">${loan.amount.toLocaleString()}</div><div className="text-xs text-red-400 font-mono">-{loan.dailyPayment}$ / day</div></div>
                                    <Button size="sm" variant="secondary" onClick={() => onPayLoan(loan.id)} disabled={gameState.money < loan.amount}>{t.payLoan}</Button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(FinanceTab);
