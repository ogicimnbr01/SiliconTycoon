import React from 'react';
import { GameState } from '../types';
import { TRANSLATIONS } from '../constants';
import { Factory, Package, Cpu, TrendingUp, Lock } from 'lucide-react';

interface AutomationTabProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onBuyFactoryLand: () => void;
    onUpgradeFactoryModule: (type: 'procurement' | 'assembly' | 'logistics') => void;
}

export const AutomationTab: React.FC<AutomationTabProps> = ({
    gameState,
    language,
    onBuyFactoryLand,
    onUpgradeFactoryModule
}) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

    // Check if Mass Production tech is unlocked
    const isMassProductionUnlocked = (gameState.manufacturingTechLevels?.['mass_production'] || 0) > 0;

    if (!isMassProductionUnlocked) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-800">
                    <Lock size={48} className="text-slate-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white mb-2">AUTOMATION LOCKED</h2>
                    <p className="text-slate-400 max-w-xs mx-auto">
                        You need to research <span className="text-indigo-400 font-bold">Mass Production</span> in the R&D lab to unlock factory automation.
                    </p>
                </div>
            </div>
        );
    }

    if (!gameState.factory.landOwned) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-6 p-8 bg-slate-900/80 border border-slate-700 rounded-3xl shadow-2xl max-w-sm w-full">
                    <Factory size={64} className="mx-auto text-emerald-500 mb-6" />
                    <h3 className="text-2xl font-black text-white mb-3">FACTORY AUTOMATION</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        Purchase industrial land to build automated production lines. Stop clicking, start managing.
                    </p>
                    <button
                        onClick={onBuyFactoryLand}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>BUY LAND</span>
                        <span className="bg-black/20 px-2 py-1 rounded text-sm font-mono">$5,000,000</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full pb-24 overflow-y-auto px-4 pt-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Factory size={24} className="text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wide">Automation</h2>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Manage Production Lines</div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Procurement */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <Package size={32} className="text-blue-400" />
                            </div>
                            <div>
                                <div className="text-lg font-black text-white">Procurement</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Auto-buys Silicon</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Level</div>
                            <div className="text-2xl font-black text-white leading-none">{gameState.factory.modules.procurement.level}</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Current Rate</span>
                        <span className="font-mono font-bold text-blue-400">{gameState.factory.modules.procurement.rate}/tick</span>
                    </div>

                    <button
                        onClick={() => onUpgradeFactoryModule('procurement')}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>UPGRADE MODULE</span>
                    </button>
                </div>

                {/* Assembly */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <Cpu size={32} className="text-purple-400" />
                            </div>
                            <div>
                                <div className="text-lg font-black text-white">Assembly</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Auto-produces Chips</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Level</div>
                            <div className="text-2xl font-black text-white leading-none">{gameState.factory.modules.assembly.level}</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Current Rate</span>
                        <span className="font-mono font-bold text-purple-400">{gameState.factory.modules.assembly.rate}/tick</span>
                    </div>

                    <button
                        onClick={() => onUpgradeFactoryModule('assembly')}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>UPGRADE MODULE</span>
                    </button>
                </div>

                {/* Logistics */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <TrendingUp size={32} className="text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-lg font-black text-white">Logistics</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Auto-sells Chips</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Level</div>
                            <div className="text-2xl font-black text-white leading-none">{gameState.factory.modules.logistics.level}</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Current Rate</span>
                        <span className="font-mono font-bold text-emerald-400">{gameState.factory.modules.logistics.rate}/tick</span>
                    </div>

                    <button
                        onClick={() => onUpgradeFactoryModule('logistics')}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>UPGRADE MODULE</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
