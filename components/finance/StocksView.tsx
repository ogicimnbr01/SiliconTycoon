import React, { useState } from 'react';
import { GameState } from '../../types';
import { TRANSLATIONS } from '../../constants';
import { Button } from '../ui/Button';
import { Building2, Plus, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from '../../utils/gameUtils';

interface StocksViewProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onBuyStock: (stockId: string, amount: number) => void;
    onSellStock: (stockId: string, amount: number) => void;
    onIPO: () => void;
    onTradeOwnShares: (action: 'buy' | 'sell', amount: number) => void;
}

export const StocksView: React.FC<StocksViewProps> = ({
    gameState,
    language,
    onBuyStock,
    onSellStock,
    onIPO,
    onTradeOwnShares
}) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
    const [stockTradeAmount, setStockTradeAmount] = useState<number>(10);

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center shadow-lg">
                {!gameState.isPubliclyTraded ? (
                    <>
                        <Building2 size={48} className="mx-auto text-slate-700 mb-4" />
                        <h3 className="text-xl font-black text-white mb-2">{t.privateCompany}</h3>
                        <div className="text-sm text-slate-400 mb-6 flex items-center justify-center gap-2">
                            {t.valuationGoal}
                            <span className="text-amber-400 font-bold text-xl">{t.valuationGoalAmount}</span>
                        </div>
                        <Button size="lg" variant="primary" className="w-full" disabled={gameState.money < 100000} onClick={onIPO}>{t.launchIPO}</Button>
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

                // Trend Logic
                const lastPrice = stock.history && stock.history.length > 1 ? stock.history[stock.history.length - 2] : stock.currentPrice;
                const changePercent = ((stock.currentPrice - lastPrice) / lastPrice) * 100;
                const isTrendingUp = changePercent >= 0;

                return (
                    <div key={stock.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-black text-slate-500 text-sm">{stock.symbol}</div>
                                <div>
                                    <div className="font-bold text-white">{stock.name}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs font-mono text-slate-400">${stock.currentPrice.toFixed(2)}</div>
                                        <div className={`flex items-center text-[10px] font-bold ${isTrendingUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {isTrendingUp ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                                            {Math.abs(changePercent).toFixed(2)}%
                                        </div>
                                    </div>
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
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onBuyStock(stock.id, stockTradeAmount)}
                                disabled={gameState.money < stock.currentPrice * stockTradeAmount}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white border-none font-bold"
                            >
                                <Plus size={14} className="mr-1" /> {t.buy} {stockTradeAmount}
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onSellStock(stock.id, stockTradeAmount)}
                                disabled={stock.owned < stockTradeAmount}
                                className="bg-rose-600 hover:bg-rose-500 text-white border-none font-bold"
                            >
                                <Minus size={14} className="mr-1" /> {t.sell} {stockTradeAmount}
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
