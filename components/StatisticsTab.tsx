import React, { useState } from 'react';
import { ProductType, Language, GameState } from '../types';
import { TRANSLATIONS } from '../constants';
import { TrendingUp, DollarSign, Package, Award, Target, BarChart3, Users, Crown, ChevronRight, TrendingDown, Zap, Medal, Trophy, Flame } from 'lucide-react';

interface StatisticsTabProps {
    gameState: GameState;
    language: Language;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({
    gameState,
    language
}) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
        return `$${num.toFixed(0)}`;
    };

    const formatShort = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
        return `${num.toFixed(0)}`;
    };

    // Create leaderboard with player
    const allCompanies = [
        {
            id: 'player',
            name: gameState.companyName,
            money: gameState.money,
            techAvg: (gameState.techLevels[ProductType.CPU] + gameState.techLevels[ProductType.GPU]) / 2,
            marketShareCPU: 0, // Calculate if needed
            marketShareGPU: 0,
            isPlayer: true
        },
        ...gameState.competitors.map(comp => ({
            id: comp.id,
            name: comp.name,
            money: comp.money || 0,
            techAvg: (comp.techLevel[ProductType.CPU] + comp.techLevel[ProductType.GPU]) / 2,
            marketShareCPU: comp.marketShare[ProductType.CPU],
            marketShareGPU: comp.marketShare[ProductType.GPU],
            isPlayer: false
        }))
    ].sort((a, b) => b.money - a.money);

    const playerRank = allCompanies.findIndex(c => c.id === 'player') + 1;
    const topCompetitors = allCompanies.slice(0, 5);
    const playerCompany = allCompanies.find(c => c.id === 'player')!;

    // Market dominance calculation
    const totalMarketShareCPU = gameState.competitors
        .reduce((sum, c) => sum + c.marketShare[ProductType.CPU], 0);
    const totalMarketShareGPU = gameState.competitors
        .reduce((sum, c) => sum + c.marketShare[ProductType.GPU], 0);

    const topCPUCompetitor = gameState.competitors
        .sort((a, b) => b.marketShare[ProductType.CPU] - a.marketShare[ProductType.CPU])[0];
    const topGPUCompetitor = gameState.competitors
        .sort((a, b) => b.marketShare[ProductType.GPU] - a.marketShare[ProductType.GPU])[0];

    // Threat assessment
    const closestRival = allCompanies
        .filter(c => !c.isPlayer && c.money < playerCompany.money)
        .sort((a, b) => b.money - a.money)[0];

    const biggestThreat = allCompanies
        .filter(c => !c.isPlayer && c.money > playerCompany.money)
        .sort((a, b) => a.money - b.money)[0];

    return (
        <div className="p-4 space-y-4 animate-fadeIn pb-24">
            {/* RANKING HEADER - MOST IMPORTANT */}
            <div className="bg-gradient-to-br from-amber-900/40 via-yellow-900/30 to-slate-900/40 border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg">
                                <Trophy className="text-white" size={28} />
                            </div>
                            <div>
                                <div className="text-xs text-amber-300 uppercase tracking-wider font-bold">Market Ranking</div>
                                <div className="text-3xl font-black text-white">#{playerRank}<span className="text-lg text-slate-400">/{allCompanies.length}</span></div>
                            </div>
                        </div>
                        {playerRank === 1 && (
                            <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/50 rounded-full">
                                <div className="flex items-center gap-2">
                                    <Crown className="text-yellow-400" size={16} />
                                    <span className="text-sm font-bold text-yellow-300">MARKET LEADER</span>
                                </div>
                            </div>
                        )}
                        {playerRank > 1 && playerRank <= 3 && (
                            <div className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full">
                                <span className="text-sm font-bold text-blue-300">TOP 3</span>
                            </div>
                        )}
                    </div>

                    {/* Threat/Opportunity Indicator */}
                    {biggestThreat && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-2">
                            <Flame className="text-red-400" size={16} />
                            <div className="flex-1">
                                <div className="text-xs text-red-300 font-bold">AHEAD OF YOU</div>
                                <div className="text-sm text-white">{biggestThreat.name}: {formatNumber(biggestThreat.money)}</div>
                            </div>
                            <div className="text-xs text-red-400 font-mono">
                                +{formatShort(biggestThreat.money - playerCompany.money)}
                            </div>
                        </div>
                    )}
                    {closestRival && playerRank > 1 && (
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                            <Target className="text-emerald-400" size={16} />
                            <div className="flex-1">
                                <div className="text-xs text-emerald-300 font-bold">BEHIND YOU</div>
                                <div className="text-sm text-white">{closestRival.name}: {formatNumber(closestRival.money)}</div>
                            </div>
                            <div className="text-xs text-emerald-400 font-mono">
                                -{formatShort(playerCompany.money - closestRival.money)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* LEADERBOARD */}
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <Medal className="text-amber-400" size={18} />
                        <h2 className="text-sm font-bold text-white uppercase tracking-wide">Market Leaderboard</h2>
                    </div>
                </div>
                <div className="divide-y divide-slate-700/50">
                    {topCompetitors.map((comp, index) => {
                        const isPlayer = comp.isPlayer;
                        const rankColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
                        const bgColors = [
                            'bg-gradient-to-r from-yellow-900/30 to-transparent',
                            'bg-gradient-to-r from-slate-800/30 to-transparent',
                            'bg-gradient-to-r from-amber-900/30 to-transparent'
                        ];

                        return (
                            <div
                                key={comp.id}
                                className={`p-4 transition-all ${isPlayer
                                        ? 'bg-gradient-to-r from-emerald-900/40 to-transparent border-l-4 border-emerald-500'
                                        : index < 3 ? bgColors[index] : 'hover:bg-slate-800/30'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Rank */}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg ${isPlayer ? 'bg-emerald-500/20 text-emerald-400' :
                                            index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                index === 1 ? 'bg-slate-700 text-slate-300' :
                                                    index === 2 ? 'bg-amber-800/30 text-amber-500' :
                                                        'bg-slate-800 text-slate-500'
                                        }`}>
                                        {index === 0 && !isPlayer ? '👑' : index + 1}
                                    </div>

                                    {/* Company Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold truncate ${isPlayer ? 'text-white' : 'text-slate-200'
                                                }`}>
                                                {comp.name}
                                            </span>
                                            {isPlayer && (
                                                <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-[10px] font-bold text-emerald-300">
                                                    YOU
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5">
                                            Tech Avg: {comp.techAvg.toFixed(1)} • Market: {((comp.marketShareCPU + comp.marketShareGPU) / 2).toFixed(0)}%
                                        </div>
                                    </div>

                                    {/* Valuation */}
                                    <div className="text-right">
                                        <div className={`text-base font-black font-mono ${isPlayer ? 'text-emerald-400' : 'text-white'
                                            }`}>
                                            {formatNumber(comp.money)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MARKET DOMINANCE */}
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="text-purple-400" size={18} />
                    Market Dominance
                </h3>
                <div className="space-y-4">
                    {/* CPU Market */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                                    <Zap className="text-blue-400" size={12} />
                                </div>
                                <span className="text-xs font-bold text-slate-300">CPU Market</span>
                            </div>
                            {topCPUCompetitor && (
                                <div className="flex items-center gap-2">
                                    <Trophy className="text-yellow-500" size={12} />
                                    <span className="text-xs text-slate-400">{topCPUCompetitor.name}</span>
                                    <span className="text-xs font-bold text-white">
                                        {topCPUCompetitor.marketShare[ProductType.CPU].toFixed(0)}%
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Top 3 CPU competitors */}
                        <div className="space-y-1">
                            {gameState.competitors
                                .sort((a, b) => b.marketShare[ProductType.CPU] - a.marketShare[ProductType.CPU])
                                .slice(0, 3)
                                .map((comp, i) => (
                                    <div key={comp.id} className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${i === 0 ? 'bg-blue-500' :
                                                        i === 1 ? 'bg-blue-400' : 'bg-blue-300'
                                                    }`}
                                                style={{ width: `${comp.marketShare[ProductType.CPU]}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-500 w-12 text-right font-mono">
                                            {comp.marketShare[ProductType.CPU].toFixed(0)}%
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* GPU Market */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                                    <Package className="text-purple-400" size={12} />
                                </div>
                                <span className="text-xs font-bold text-slate-300">GPU Market</span>
                            </div>
                            {topGPUCompetitor && (
                                <div className="flex items-center gap-2">
                                    <Trophy className="text-yellow-500" size={12} />
                                    <span className="text-xs text-slate-400">{topGPUCompetitor.name}</span>
                                    <span className="text-xs font-bold text-white">
                                        {topGPUCompetitor.marketShare[ProductType.GPU].toFixed(0)}%
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Top 3 GPU competitors */}
                        <div className="space-y-1">
                            {gameState.competitors
                                .sort((a, b) => b.marketShare[ProductType.GPU] - a.marketShare[ProductType.GPU])
                                .slice(0, 3)
                                .map((comp, i) => (
                                    <div key={comp.id} className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${i === 0 ? 'bg-purple-500' :
                                                        i === 1 ? 'bg-purple-400' : 'bg-purple-300'
                                                    }`}
                                                style={{ width: `${comp.marketShare[ProductType.GPU]}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-500 w-12 text-right font-mono">
                                            {comp.marketShare[ProductType.GPU].toFixed(0)}%
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* YOUR STATS - Quick Overview */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3">
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Your Valuation</div>
                    <div className="text-xl font-black text-emerald-400">{formatNumber(gameState.money)}</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3">
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Tech Level</div>
                    <div className="text-xl font-black text-white">
                        {gameState.techLevels[ProductType.CPU]}/{gameState.techLevels[ProductType.GPU]}
                    </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3">
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Day</div>
                    <div className="text-xl font-black text-white">{gameState.day}</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3">
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Achievements</div>
                    <div className="text-xl font-black text-amber-400">{gameState.unlockedAchievements?.length || 0}</div>
                </div>
            </div>
        </div>
    );
};
