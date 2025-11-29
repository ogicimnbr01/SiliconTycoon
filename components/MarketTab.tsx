import React, { useState } from 'react';
import { ProductType, GameState, TabType } from '../types';
import { CPU_TECH_TREE, GPU_TECH_TREE, MARKET_TRENDS, TRANSLATIONS } from '../constants';
import { Button } from './ui/Button';
import { MiniChart } from './ui/MiniChart';
import { DollarSign, Briefcase, Building2, Skull, Activity, BarChart3, Minus, Plus, Lock, Target, X, AlertTriangle, Building, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from '../utils/gameUtils';
import { calculateFinalRevenue, getEraTier, getPriceDecayWarning } from '../utils/economySystem';

interface MarketTabProps {
    mode: 'commercial' | 'financial';
    gameState: GameState;
    language: 'en' | 'tr';
    onSell: (type: ProductType, currentPrice: number) => void;
    onBuyStock: (stockId: string, amount: number) => void;
    onSellStock: (stockId: string, amount: number) => void;
    onIPO: () => void;
    onAcceptContract: (contractId: string) => void;
    onCovertOp: (type: 'espionage' | 'sabotage', targetId: string) => void;
    onRetire: () => void;
    onTakeLoan: (amount: number) => void;
    onPayLoan: (loanId: string) => void;
    onTradeOwnShares: (action: 'buy' | 'sell') => void;
    unlockedTabs: TabType[];
}

const MarketTab: React.FC<MarketTabProps> = ({
    mode,
    gameState,
    language,
    onSell,
    onBuyStock,
    onSellStock,
    onIPO,
    onAcceptContract,
    onCovertOp,
    onRetire,
    onTakeLoan,
    onPayLoan,
    onTradeOwnShares,
    unlockedTabs
}) => {
    const [view, setView] = useState<'sales' | 'stocks' | 'contracts' | 'warfare' | 'bank'>(
        mode === 'commercial' ? 'sales' : 'stocks'
    );

    // HİSSE ALIM SATIM MİKTARI (YENİ EKLENDİ)
    const [stockTradeAmount, setStockTradeAmount] = useState<number>(10);

    const [targetModalOpen, setTargetModalOpen] = useState(false);
    const [ipoModalOpen, setIpoModalOpen] = useState(false);
    const [selectedOpType, setSelectedOpType] = useState<'espionage' | 'sabotage' | null>(null);

    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
    const activeTrend = MARKET_TRENDS.find(t => t.id === gameState.activeTrendId) || MARKET_TRENDS[0];
    const isAdvancedUnlocked = unlockedTabs.includes('rnd');

    const prepareOp = (type: 'espionage' | 'sabotage') => {
        setSelectedOpType(type);
        setTargetModalOpen(true);
    };

    const handleTargetSelect = (targetId: string) => {
        if (selectedOpType) {
            onCovertOp(selectedOpType, targetId);
            setTargetModalOpen(false);
            setSelectedOpType(null);
        }
    };

    const handleIPO = () => {
        setIpoModalOpen(true);
    };

    const confirmIPO = () => {
        onIPO();
        setIpoModalOpen(false);
    };

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
        const economyResult = count > 0 ? calculateFinalRevenue({
            basePrice: currentPrice,
            amount: count,
            productTier: techLevel,
            productType: type,
            marketEra,
            marketSaturation: gameState.marketSaturation?.[type] ?? 0
        }) : { revenue: 0, breakdown: { baseRevenue: 0, afterDecay: 0, afterCrash: 0, afterSaturation: 0 }, warnings: [] };

        const totalValue = economyResult.revenue; // Use economy system revenue, not simple price * count
        const decayWarning = getPriceDecayWarning(techLevel, marketEra);

        return (
            <div className={`bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-5 shadow-lg mb-4`}>
                {/* ... existing header code ... */}
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

                {isTrendApplicable && activeTrend.id !== 'trend_neutral' && (
                    <div className={`text-[10px] px-3 py-2 rounded-lg border font-bold uppercase tracking-wide w-full text-center ${trendMod > 1.0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {trendMod > 1.0 ? `✓ ${t.trendMatch}: ${activeTrend.name}` : `✗ ${t.trendMiss}: ${activeTrend.name}`}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t.marketPrice}</div>
                        <div className={`font-mono text-3xl font-bold tracking-tight ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                            ${currentPrice}
                        </div>
                    </div>
                    <div className="text-right">
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
                            {/* Warning Banner */}
                            {decayWarning === 'hype' && (
                                <div className="mb-2 px-2 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 font-bold text-[10px] uppercase tracking-wide text-center">
                                    🔥 {t.currentGen || 'CURRENT GEN'} +50% {t.bonus || 'BONUS'}!
                                </div>
                            )}
                            {decayWarning === 'danger' && (
                                <div className="mb-2 px-2 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-bold text-[10px] uppercase tracking-wide text-center">
                                    ⚠️ {t.outdatedTech || 'OUTDATED TECH'}
                                </div>
                            )}
                            {decayWarning === 'trash' && (
                                <div className="mb-2 px-2 py-1.5 bg-red-600/20 border border-red-600/40 rounded-lg text-red-300 font-bold text-[10px] uppercase tracking-wide text-center">
                                    🗑️ {t.ancientTech || 'ANCIENT TECH'}
                                </div>
                            )}

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
                                <span className={`font-mono ${(economyResult.revenue / count - realCostPerUnit) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {(economyResult.revenue / count - realCostPerUnit) >= 0 ? '+' : ''}${(economyResult.revenue / count - realCostPerUnit).toFixed(0)} ({((economyResult.revenue / count - realCostPerUnit) / (economyResult.revenue / count) * 100).toFixed(0)}%)
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
                    variant="success"
                    size="lg"
                    onClick={() => onSell(type, currentPrice)}
                    disabled={count === 0}
                    className="w-full h-16 text-lg shadow-xl rounded-xl"
                >
                    <span className="mr-2 font-bold">{t.sellBatch}</span>
                    <span className="font-mono bg-black/20 px-2 py-1 rounded opacity-80">${totalValue.toLocaleString()}</span>
                </Button>
            </div>
        );
    };

    const PillButton = ({ id, label, icon: Icon, locked }: { id: typeof view, label: string, icon: any, locked?: boolean }) => (
        <button
            onClick={() => !locked && setView(id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex-1 justify-center relative group ${locked
                ? 'bg-slate-950 text-slate-700 border border-slate-800 cursor-not-allowed'
                : view === id
                    ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
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
        <div className="flex flex-col gap-6 pt-2 pb-8 pb-[env(safe-area-inset-bottom)] relative">
            {/* Active Trend Banner - Moved to FactoryTab */}

            {/* Board Missions Display */}
            {gameState.boardMissions && gameState.boardMissions.length > 0 && (
                <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 shadow-lg animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="text-amber-500" size={20} />
                        <h3 className="text-amber-500 font-black uppercase tracking-widest text-sm">{t.boardIntervention}</h3>
                    </div>
                    {gameState.boardMissions.map(mission => (
                        <div key={mission.id} className="mb-2 last:mb-0">
                            <p className="text-white font-bold text-sm">{mission.description}</p>
                            <div className="flex justify-between text-xs mt-1">
                                <span className="text-slate-400">{format(t.mission_deadline, mission.deadlineDay - gameState.day)}</span>
                                <span className="text-red-400 font-bold">{format(t.penaltyPrestige, mission.penalty)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
            {targetModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                            <div className="flex items-center gap-2 text-red-400">
                                <Target size={20} />
                                <span className="font-black uppercase tracking-widest">{t.selectTarget}</span>
                            </div>
                            <button onClick={() => setTargetModalOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-2 max-h-[60vh] overflow-y-auto">
                            {gameState.stocks.map(stock => (
                                <button key={stock.id} onClick={() => handleTargetSelect(stock.id)} className="w-full text-left p-4 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all mb-2 group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-white group-hover:text-red-400 transition-colors truncate" title={stock.name}>{stock.name}</span>
                                        <span className="font-mono text-xs text-slate-500">${stock.currentPrice.toFixed(2)}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-2 pb-2 px-1 overflow-x-auto">
                {mode === 'commercial' ? (
                    <>
                        <PillButton id="sales" label={t.sales} icon={DollarSign} />
                        <PillButton id="contracts" label={t.contracts} icon={Briefcase} locked={!isAdvancedUnlocked} />
                        <PillButton id="warfare" label={t.warfare} icon={Skull} locked={!isAdvancedUnlocked} />
                    </>
                ) : (
                    <>
                        <PillButton id="stocks" label={t.stocks} icon={BarChart3} locked={!isAdvancedUnlocked} />
                        <PillButton id="bank" label={t.bank} icon={Building} locked={!isAdvancedUnlocked} />
                    </>
                )}
            </div>

            <div className="space-y-4">
                {view === 'sales' && mode === 'commercial' && (
                    <>
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
                        <div className="space-y-6">
                            {renderSalesItem(ProductType.CPU, CPU_TECH_TREE)}
                            {renderSalesItem(ProductType.GPU, GPU_TECH_TREE)}
                        </div>
                    </>
                )}

                {view === 'contracts' && mode === 'commercial' && (
                    <div className="space-y-4">
                        {gameState.activeContracts.length === 0 && gameState.availableContracts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl"><Briefcase size={48} className="mb-4 opacity-50" /><p className="font-bold text-sm uppercase tracking-wider">{t.noContracts}</p></div>
                        )}
                        {gameState.activeContracts.map(contract => (
                            <div key={contract.id} className="bg-slate-900 border-l-4 border-blue-500 p-5 rounded-r-xl shadow-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white">{contract.title}</h4>
                                    <div className="text-xs font-mono text-blue-400 font-bold bg-blue-900/20 px-2 py-1 rounded">{contract.requiredProduct}</div>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full mb-2"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${(contract.fulfilledAmount / contract.requiredAmount) * 100}%` }}></div></div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2"><span>{contract.fulfilledAmount} / {contract.requiredAmount}</span><span className="text-blue-400">{contract.deadlineDay - gameState.day} {t.daysLeft}</span></div>
                                <div className="flex gap-2 text-[10px] font-mono text-slate-500">
                                    {contract.minPerformance && <span className="bg-slate-800 px-1.5 py-0.5 rounded">{t.minPerf}: {contract.minPerformance}</span>}
                                    {contract.minEfficiency && <span className="bg-slate-800 px-1.5 py-0.5 rounded">{t.minEff}: {contract.minEfficiency}</span>}
                                </div>
                            </div>
                        ))}
                        {gameState.availableContracts.map(contract => (
                            <div key={contract.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-white">{contract.title}</h4>
                                    <div className="text-right">
                                        <div className="text-emerald-400 font-mono font-bold text-sm">+${(contract.upfrontPayment || 0).toLocaleString()} {t.now}</div>
                                        <div className="text-emerald-600 font-mono text-xs">+${(contract.completionPayment || contract.reward).toLocaleString()} {t.later}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-3">
                                    {contract.minPerformance && <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded">{t.req}: {contract.minPerformance}+ {t.minPerf}</span>}
                                    {contract.minEfficiency && <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded">{t.req}: {contract.minEfficiency}+ {t.minEff}</span>}
                                </div>
                                <p className="text-xs text-slate-400 mb-4">{contract.description}</p>
                                <Button variant="secondary" size="md" className="w-full" onClick={() => onAcceptContract(contract.id)}>{t.accept}</Button>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'stocks' && mode === 'financial' && (
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
                                        <button onClick={() => onTradeOwnShares('buy')} disabled={gameState.money < (gameState.playerSharePrice * 500) || gameState.playerCompanySharesOwned >= 100} className="bg-emerald-900/30 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 font-bold text-xs uppercase hover:bg-emerald-500/20 disabled:opacity-50 active:scale-95 transition-all">{t.buyBack} (+5%)</button>
                                        <button onClick={() => onTradeOwnShares('sell')} disabled={gameState.playerCompanySharesOwned <= 10} className="bg-red-900/30 border border-red-500/30 p-3 rounded-xl text-red-400 font-bold text-xs uppercase hover:bg-red-500/20 disabled:opacity-50 active:scale-95 transition-all">{t.dilute} (-5%)</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* HİSSE ALIM SATIM PANELİ (MİKTAR SEÇİCİ İLE) */}
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

                {view === 'bank' && mode === 'financial' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {[10000, 50000, 100000, 500000].map(amt => {
                                let reqLevel = 0;
                                // if (amt === 50000) reqLevel = 2; // Removed restriction
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

                {view === 'warfare' && mode === 'commercial' && (
                    <div className="grid gap-4">
                        <button onClick={() => prepareOp('espionage')} className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl border border-indigo-500/30 text-left relative overflow-hidden group active:scale-95 transition-transform">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Briefcase size={80} /></div>
                            <div className="text-indigo-400 font-black uppercase tracking-widest mb-1">{t.espionage}</div>
                            <div className="text-2xl text-white font-bold mb-3">{t.stealTech}</div>
                            <div className="text-xs text-indigo-300/70">Select a target to see pricing</div>
                        </button>
                        <button onClick={() => prepareOp('sabotage')} className="bg-gradient-to-br from-slate-900 to-red-950 p-6 rounded-2xl border border-red-500/30 text-left relative overflow-hidden group active:scale-95 transition-transform">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Skull size={80} /></div>
                            <div className="text-red-400 font-black uppercase tracking-widest mb-1">{t.sabotage}</div>
                            <div className="text-2xl text-white font-bold mb-3">{t.crippleRivals}</div>
                            <div className="text-xs text-red-300/70">Select a target to see pricing</div>
                        </button>
                        <div className="mt-4 pt-4 border-t border-slate-800"><Button variant="secondary" className="w-full py-4" onClick={onRetire}>{t.retire}</Button></div>
                    </div>
                )}

                {/* Target Selection Modal with Dynamic Pricing */}
                {targetModalOpen && selectedOpType && (
                    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                        <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-700 overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto">
                            <div className={`p-6 border-b border-slate-700 ${selectedOpType === 'espionage' ? 'bg-gradient-to-r from-indigo-900/50 to-slate-900' : 'bg-gradient-to-r from-red-900/50 to-slate-900'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${selectedOpType === 'espionage' ? 'text-indigo-400' : 'text-red-400'}`}>
                                            {selectedOpType === 'espionage' ? t.espionage : t.sabotage}
                                        </div>
                                        <div className="text-lg font-black text-white">
                                            {selectedOpType === 'espionage' ? 'Select Target to Steal Tech' : 'Select Target to Sabotage'}
                                        </div>
                                    </div>
                                    <button onClick={() => setTargetModalOpen(false)} className="text-slate-400 hover:text-white">
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                                {gameState.competitors.map(comp => {
                                    // Use competitor's valuation for cost (same as backend)
                                    const targetValue = comp.money || 10000;
                                    const espionageCost = Math.max(5000, Math.floor(targetValue * 0.10));
                                    const sabotageCost = Math.max(15000, Math.floor(targetValue * 0.25));
                                    const opCost = selectedOpType === 'espionage' ? espionageCost : sabotageCost;

                                    const canAfford = gameState.money >= opCost;

                                    return (
                                        <button
                                            key={comp.id}
                                            onClick={() => canAfford && handleTargetSelect(comp.id)}
                                            disabled={!canAfford}
                                            className={`w-full p-4 rounded-xl border transition-all text-left ${canAfford
                                                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600 active:scale-95'
                                                : 'bg-slate-950/50 border-slate-800 opacity-40 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="text-sm font-bold text-white">{comp.name}</div>
                                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                                        Tech: {comp.techLevel[ProductType.CPU]}/{comp.techLevel[ProductType.GPU]} •
                                                        ${((comp.money || 0) / 1000).toFixed(0)}k
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-lg font-black font-mono ${selectedOpType === 'espionage' ? 'text-indigo-400' : 'text-red-400'
                                                        }`}>
                                                        ${opCost.toLocaleString()}
                                                    </div>
                                                    <div className="text-[9px] text-slate-500 uppercase">Cost</div>
                                                </div>
                                            </div>
                                            {selectedOpType === 'espionage' && (
                                                <div className="text-[10px] text-indigo-300/70 bg-indigo-950/30 px-2 py-1 rounded">
                                                    Steal tech & gain RP
                                                </div>
                                            )}
                                            {selectedOpType === 'sabotage' && (
                                                <div className="text-[10px] text-red-300/70 bg-red-950/30 px-2 py-1 rounded">
                                                    Damage their operations
                                                </div>
                                            )}
                                            {!canAfford && (
                                                <div className="text-[10px] text-amber-400/70 bg-amber-950/20 px-2 py-1 rounded mt-1">
                                                    Insufficient funds
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(MarketTab);