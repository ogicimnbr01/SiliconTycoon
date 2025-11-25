import React from 'react';
import { ProductType, Language, GameState } from '../types';
import { TRANSLATIONS } from '../constants';
import { TrendingUp, DollarSign, Package, Award, Target, BarChart3 } from 'lucide-react';

interface StatisticsTabProps {
    gameState: GameState;
    language: Language;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({
    gameState,
    language
}) => {
    const t = TRANSLATIONS[language];

    // Derive stats from gameState
    const totalRevenue = gameState.money; // Placeholder: Current money
    const peakMoney = Math.max(...gameState.financialHistory.map(h => h.money), gameState.money);
    const peakReputation = gameState.reputation;
    const researchCompleted = Object.values(gameState.techLevels).reduce((a, b) => a + b, 0);
    const contractsCompleted = 0; // Not currently tracked
    const achievementsUnlocked = gameState.unlockedAchievements?.length || 0;

    // Placeholder for production/sales as they are not fully tracked in GameState yet
    const totalProduction = gameState.inventory;
    const totalSales = { [ProductType.CPU]: 0, [ProductType.GPU]: 0 };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
        return `$${num.toFixed(0)}`;
    };

    const totalProductionCount = Object.values(totalProduction).reduce((a, b) => a + b, 0);
    const totalSalesCount = Object.values(totalSales).reduce((a, b) => a + b, 0);

    return (
        <div className="p-4 space-y-6 animate-fadeIn">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-emerald-400" size={20} />
                        <div className="text-xs text-emerald-300">{t.earnings}</div>
                    </div>
                    <div className="text-2xl font-bold text-white count-up">{formatNumber(totalRevenue)}</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="text-blue-400" size={20} />
                        <div className="text-xs text-blue-300">{t.dailyOutput}</div>
                    </div>
                    <div className="text-2xl font-bold text-white count-up">{totalProductionCount}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="text-purple-400" size={20} />
                        <div className="text-xs text-purple-300">{t.sales}</div>
                    </div>
                    <div className="text-2xl font-bold text-white count-up">{totalSalesCount}</div>
                </div>

                <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="text-amber-400" size={20} />
                        <div className="text-xs text-amber-300">{t.achievements}</div>
                    </div>
                    <div className="text-2xl font-bold text-white count-up">{achievementsUnlocked}</div>
                </div>
            </div>

            {/* Product Breakdown */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="text-indigo-400" size={20} />
                    {t.inventory}
                </h2>
                <div className="space-y-3">
                    {Object.entries(totalProduction).map(([type, count]) => {
                        const salesCount = totalSales[type as ProductType] || 0;
                        const productionPercent = totalProductionCount > 0 ? (count / totalProductionCount) * 100 : 0;

                        return (
                            <div key={type} className="bg-slate-900/50 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-white">{type}</span>
                                    <span className="text-xs text-slate-400">{count} {t.units}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                            style={{ width: `${productionPercent}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-400">{productionPercent.toFixed(0)}%</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{t.sales}: {salesCount}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Milestones */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="text-cyan-400" size={20} />
                    {t.leader}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">{t.netWorth}</div>
                        <div className="text-lg font-bold text-emerald-400">{formatNumber(peakMoney)}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">{t.rep}</div>
                        <div className="text-lg font-bold text-blue-400">{peakReputation}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">{t.research}</div>
                        <div className="text-lg font-bold text-purple-400">{researchCompleted}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">{t.contracts}</div>
                        <div className="text-lg font-bold text-amber-400">{contractsCompleted}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
