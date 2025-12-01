import React from 'react';
import { ProductType, GameState } from '../../types';
import { CPU_TECH_TREE, GPU_TECH_TREE, MARKET_TRENDS, TRANSLATIONS } from '../../constants';
import { Button } from '../ui/Button';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { calculateFinalRevenue, getEraTier, getPriceDecayWarning, ECONOMY_CONFIG } from '../../utils/economySystem';

interface SalesViewProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onSell: (type: ProductType, currentPrice: number) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ gameState, language, onSell }) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
    const activeTrend = MARKET_TRENDS.find(t => t.id === gameState.activeTrendId) || MARKET_TRENDS[0];

    const renderSalesItem = (type: ProductType, techTree: any[]) => {
        const techLevel = gameState.techLevels[type];
        const tech = techTree[techLevel];
        const spec = gameState.designSpecs[type];
        const count = gameState.inventory[type];

        const designMultiplier = 1 + (spec.performance * 0.008) + (spec.efficiency * 0.006);
        const salesHero = gameState.hiredHeroes.includes('hero_steve') ? 1.2 : 1.0;

        // Check if this product is affected by the current trend
        let trendMod = 1.0;
        const isTrendApplicable = activeTrend.affectedProducts.includes(type);
        if (isTrendApplicable && activeTrend.id !== 'trend_neutral') {
            const specValue = spec[activeTrend.requiredSpec];
            if (specValue >= activeTrend.minSpecValue) trendMod = activeTrend.priceBonus;
            else trendMod = activeTrend.penalty;
        }

        const rivalMod = gameState.activeRivalLaunch ? gameState.activeRivalLaunch.effect : 1.0;
        const repBonus = gameState.reputation >= 20 ? 1.1 : 1.0;

        const basePrice = tech.baseMarketPrice * gameState.marketMultiplier;
        const finalPrice = Math.floor(basePrice * designMultiplier * trendMod * salesHero * repBonus * rivalMod);

        const globalLevel = gameState.globalTechLevels[type];
        let techLeaderBonus = 1.0;
        if (techLevel > globalLevel) {
            techLeaderBonus = 1.5;
        } else if (techLevel < globalLevel) {
            techLeaderBonus = 0.7;
        }

        const brandBonus = 1 + (gameState.brandAwareness[type] / 50);
        const finalMultiplier = gameState.marketMultiplier * repBonus * salesHero * rivalMod * techLeaderBonus * brandBonus;

        const currentPrice = Math.floor(tech.baseMarketPrice * finalMultiplier);
        const priceDiff = currentPrice - tech.baseMarketPrice;
        const isUp = priceDiff >= 0;

        // Calculate Real Cost per Unit (including defects)
        const yieldRate = tech.yield || 100;
        const qualityMod = gameState.productionQuality === 'high' ? 5 : gameState.productionQuality === 'medium' ? 0 : -5;
        const actualYield = Math.min(100, Math.max(10, yieldRate + qualityMod)) / 100;

        const baseProductionCost = tech.productionCost;
        const siliconCost = tech.productionCost / 10 * gameState.siliconPrice;
        const totalBaseCost = baseProductionCost + siliconCost;
        const realCostPerUnit = totalBaseCost / actualYield;

        // Calculate actual revenue using ECONOMY SYSTEM
        const marketEra = getEraTier(gameState.currentEraId);

        // Calculate Daily Demand Penalty (Blended Rate)
        const DAILY_LIMIT = ECONOMY_CONFIG.DAILY_MARKET_DEMAND?.[type] || 1000;
        const alreadySoldToday = gameState.dailySales?.[type] || 0;

        const amountUnderLimit = Math.max(0, Math.min(count, DAILY_LIMIT - alreadySoldToday));
        const amountOverLimit = Math.max(0, count - amountUnderLimit);
        const penaltyRate = ECONOMY_CONFIG.OVERSELL_PENALTY || 0.20;

        const priceMultiplier = count > 0
            ? ((amountUnderLimit * 1) + (amountOverLimit * (1 - penaltyRate))) / count
            : 1;

        const economyResult = count > 0 ? calculateFinalRevenue({
            basePrice: currentPrice * priceMultiplier,
            amount: count,
            productTier: techLevel,
            productType: type,
            marketEra,
            marketSaturation: gameState.marketSaturation?.[type] ?? 0
        }) : { revenue: 0, breakdown: { baseRevenue: 0, afterDecay: 0, afterCrash: 0, afterSaturation: 0 }, warnings: [] };

        // Apply reputation bonus to match actual sale calculation in handleSell
        const reputationBonuses = (() => {
            if (gameState.reputation >= 80) return { priceBonus: 1.2, siliconDiscount: 0.85, contractBonus: 1.3 };
            if (gameState.reputation >= 60) return { priceBonus: 1.15, siliconDiscount: 0.9, contractBonus: 1.2 };
            if (gameState.reputation >= 40) return { priceBonus: 1.1, siliconDiscount: 0.95, contractBonus: 1.1 };
            if (gameState.reputation >= 20) return { priceBonus: 1.05, siliconDiscount: 0.98, contractBonus: 1.05 };
            return { priceBonus: 1.0, siliconDiscount: 1.0, contractBonus: 1.0 };
        })();

        const totalValue = Math.floor(economyResult.revenue * reputationBonuses.priceBonus); // Match handleSell calculation
        const decayWarning = getPriceDecayWarning(techLevel, marketEra);
        const isObsolete = decayWarning === 'danger' || decayWarning === 'trash';
        const isHype = decayWarning === 'hype';

        const netProfit = economyResult.revenue / count - realCostPerUnit;
        const isProfitable = netProfit > 0;

        return (
            <div className={`bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-5 shadow-lg mb-4`}>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-mono font-bold mb-1">{type} {t.model}</div>
                        <div className="font-black text-white text-xl tracking-wide flex items-center gap-2">
                            {tech.name}
                            {techLevel > globalLevel && (
                                <span className="text-[8px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{t.leader}</span>
                            )}
                            {techLevel < globalLevel && (
                                <span className="text-[8px] bg-red-500/20 text-red-400 border border-red-500/50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{t.old}</span>
                            )}
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-mono font-bold px-2 py-1 rounded-lg border ${isUp ? 'bg-emerald-900/20 border-emerald-500/20 text-emerald-400' : 'bg-red-900/20 border-red-500/20 text-red-400'}`}>
                        {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {Math.abs((priceDiff / tech.baseMarketPrice) * 100).toFixed(1)}%
                    </div>
                </div>

                {/* Obsolete Warning Banner */}
                {isObsolete && (
                    <div className="text-[10px] px-3 py-2 rounded-lg border font-bold uppercase tracking-wide w-full text-center bg-red-500/10 border-red-500/30 text-red-400">
                        📉 OBSOLETE TECH: Demand & Price Reduced
                    </div>
                )}

                {/* Hype Banner (Only if not obsolete) */}
                {!isObsolete && isHype && (
                    <div className="text-[10px] px-3 py-2 rounded-lg border font-bold uppercase tracking-wide w-full text-center bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                        🔥 CURRENT GEN BONUS: +50% Price!
                    </div>
                )}

                {/* Trend Banner */}
                {isTrendApplicable && activeTrend.id !== 'trend_neutral' && (
                    <div className={`text-[10px] px-3 py-2 rounded-lg border font-bold uppercase tracking-wide w-full text-center ${trendMod > 1.0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {trendMod > 1.0 ? `✓ ${t.trendMatch}: ${activeTrend.name}` : `✗ ${t.trendMiss}: ${activeTrend.name}`}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 relative overflow-hidden">
                    {/* Sparkline Background */}
                    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path d="M0 30 Q 20 10, 40 25 T 80 15 T 100 20" stroke="currentColor" strokeWidth="2" fill="none" className={isUp ? 'text-emerald-500' : 'text-red-500'} />
                    </svg>

                    <div className="relative z-10">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t.marketPrice}</div>
                        <div className={`font-mono text-3xl font-bold tracking-tight ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                            ${currentPrice}
                        </div>
                    </div>
                    <div className="text-right relative z-10">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t.inventory}</div>
                        <div className="font-mono text-3xl text-white font-bold tracking-tight">{count}</div>
                    </div>
                </div>

                {/* DAILY DEMAND DISPLAY */}
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
                            📊 {t.dailyDemand || 'DAILY DEMAND'}
                        </span>
                        <span className={`text-xs font-mono font-bold ${(gameState.dailyDemand?.[type] ?? 100) > 50 ? 'text-emerald-400' :
                            (gameState.dailyDemand?.[type] ?? 100) > 20 ? 'text-yellow-400' :
                                'text-red-400'
                            }`}>
                            {gameState.dailyDemand?.[type] ?? 100} {t.units || 'units'}
                        </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${(gameState.dailyDemand?.[type] ?? 100) > 50 ? 'bg-emerald-500' :
                                (gameState.dailyDemand?.[type] ?? 100) > 20 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                }`}
                            style={{ width: `${Math.min(100, ((gameState.dailyDemand?.[type] ?? 100) / 100) * 100)}%` }}
                        />
                    </div>
                    {(gameState.dailyDemand?.[type] ?? 100) < 20 && (
                        <div className="mt-2 text-[9px] text-red-400 font-bold uppercase tracking-wide text-center">
                            ⚠️ {t.lowDemand || 'LOW DEMAND - SEVERE PENALTY IF OVERSELLING'}
                        </div>
                    )}
                </div>

                {/* PROFIT BREAKDOWN - WITH ECONOMY SYSTEM */}
                <div className="mt-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 text-xs">
                    {count > 0 ? (
                        <>
                            <div className="flex justify-between mb-1">
                                <span className="text-slate-500">{t.basePrice || 'Base Price'}</span>
                                <span className="text-slate-300 font-mono">${currentPrice}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span className="text-slate-500">{t.afterEconomy || 'After Economy'}</span>
                                <span className={`font-mono ${economyResult.revenue / count < currentPrice ? 'text-orange-400' : 'text-emerald-400'}`}>
                                    ${(economyResult.revenue / count).toFixed(0)}
                                </span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span className="text-slate-500">{t.estUnitCost}</span>
                                <span className="text-slate-400 font-mono">${realCostPerUnit.toFixed(0)}</span>
                            </div>
                            <div className="border-t border-slate-800 my-1 pt-1 flex justify-between font-bold">
                                <span className="text-slate-400">{t.netProfit}</span>
                                <span className={`font-mono ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {isProfitable ? '+' : ''}${netProfit.toFixed(0)} ({((netProfit) / (economyResult.revenue / count) * 100).toFixed(0)}%)
                                </span>
                            </div>

                            {/* Total Revenue Display */}
                            <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                                <span className="text-slate-400 font-bold text-xs">{t.totalRevenue || 'Total Revenue'}</span>
                                <span className="text-emerald-400 font-mono font-bold text-sm">
                                    ${economyResult.revenue.toFixed(0)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-slate-500 py-2">
                            {t.noInventory || 'No inventory to sell'}
                        </div>
                    )}
                </div>

                <Button
                    variant={isProfitable ? "success" : "warning"}
                    size="lg"
                    onClick={() => onSell(type, currentPrice)}
                    disabled={count === 0}
                    className={`w-full h-16 text-lg shadow-xl rounded-xl ${!isProfitable && 'bg-amber-600 hover:bg-amber-500 border-amber-500'}`}
                >
                    <span className="mr-2 font-bold">{isProfitable ? t.sellBatch : "LIQUIDATE STOCK"}</span>
                    <span className="font-mono bg-black/20 px-2 py-1 rounded opacity-80">${totalValue.toLocaleString()}</span>
                </Button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {gameState.activeRivalLaunch && (
                <div className="bg-red-950 border-2 border-red-600 rounded-2xl p-5 flex items-start gap-4 shadow-2xl animate-pulse relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-600/20 rounded-full blur-2xl"></div>
                    <div className="bg-red-500 p-3 rounded-xl text-white z-10 shrink-0"><AlertTriangle size={24} strokeWidth={3} /></div>
                    <div className="z-10">
                        <h4 className="text-base font-black text-white uppercase leading-none mb-1">{t.rivalAlert}</h4>
                        <p className="text-sm text-red-200 mb-3 leading-tight font-medium">{gameState.activeRivalLaunch.companyName} launched <strong>{gameState.activeRivalLaunch.productName}</strong>.</p>
                    </div>
                </div>
            )}
            {renderSalesItem(ProductType.CPU, CPU_TECH_TREE)}
            {renderSalesItem(ProductType.GPU, GPU_TECH_TREE)}
        </div>
    );
};
