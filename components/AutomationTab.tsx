import React from 'react';
import { GameState } from '../types';
import { TRANSLATIONS, FACTORY_UPGRADES, MANUFACTURING_TECH_TREE } from '../constants';
import { Factory, Package, Truck, ArrowRight, Lock, Zap, Settings, TrendingUp } from 'lucide-react';

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

    // Module Unlock Logic
    // Assembly: Unlocked by Mass Production (Base)
    const isAssemblyUnlocked = isMassProductionUnlocked;
    // Logistics: Unlocked by Advanced Logistics
    const isLogisticsUnlocked = (gameState.manufacturingTechLevels?.['advanced_logistics'] || 0) > 0;
    // Procurement: Unlocked by AI Procurement
    const isProcurementUnlocked = (gameState.manufacturingTechLevels?.['ai_procurement'] || 0) > 0;

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

    const modules = gameState.factory.modules;
    const isActive = modules.procurement.rate > 0 && modules.assembly.rate > 0 && modules.logistics.rate > 0;

    const getUpgradeCost = (type: 'procurement' | 'assembly' | 'logistics') => {
        const module = modules[type];
        const config = FACTORY_UPGRADES.MODULE_COSTS[type];
        const multiplier = type === 'procurement' ? 1.5 : type === 'assembly' ? 1.6 : 1.4;
        return Math.floor(config * Math.pow(multiplier, module.level));
    };

    const getTechName = (id: string) => {
        return MANUFACTURING_TECH_TREE.find(t => t.id === id)?.name || id;
    };

    return (
        <div className="h-full flex flex-col bg-slate-950">
            {/* TOP SECTION: VISUAL PIPELINE (40%) */}
            <div className="h-[40%] bg-slate-900 border-b border-slate-800 p-6 flex flex-col relative overflow-hidden">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="flex items-center justify-between mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-slate-600'}`}>{isActive ? 'System Online' : 'System Offline'}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-500">OP-ID: {gameState.day}-X9</div>
                </div>

                <div className="flex-1 flex items-center justify-between px-2 relative z-10">
                    {/* STEP 1: INPUT (Procurement) */}
                    <div className={`flex flex-col items-center gap-2 ${!isProcurementUnlocked ? 'opacity-40 grayscale' : ''}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-[0_0_20px_rgba(59,130,246,0.2)] ${isProcurementUnlocked ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-800 border-dashed border-slate-700 text-slate-600'}`}>
                            <Truck size={32} />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Silicon In</div>
                        <div className={`font-mono text-xs font-bold ${isProcurementUnlocked ? 'text-blue-400' : 'text-slate-600'}`}>
                            {isProcurementUnlocked ? `${modules.procurement.rate}/t` : 'OFFLINE'}
                        </div>
                    </div>

                    {/* ARROW 1 */}
                    <ArrowRight size={24} className={`text-slate-600 ${isProcurementUnlocked && isAssemblyUnlocked && isActive ? 'text-blue-500 animate-pulse' : ''}`} />

                    {/* STEP 2: PROCESS (Assembly) */}
                    <div className={`flex flex-col items-center gap-2 ${!isAssemblyUnlocked ? 'opacity-40 grayscale' : ''}`}>
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-[0_0_30px_rgba(168,85,247,0.3)] ${isAssemblyUnlocked ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-slate-800 border-dashed border-slate-700 text-slate-600'}`}>
                            <Factory size={40} className={isAssemblyUnlocked && isActive ? 'animate-[spin_4s_linear_infinite]' : ''} />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processing</div>
                        <div className={`font-mono text-xs font-bold ${isAssemblyUnlocked ? 'text-purple-400' : 'text-slate-600'}`}>
                            {isAssemblyUnlocked ? `${modules.assembly.rate}/t` : 'OFFLINE'}
                        </div>
                    </div>

                    {/* ARROW 2 */}
                    <ArrowRight size={24} className={`text-slate-600 ${isAssemblyUnlocked && isLogisticsUnlocked && isActive ? 'text-purple-500 animate-pulse' : ''}`} />

                    {/* STEP 3: OUTPUT (Logistics) */}
                    <div className={`flex flex-col items-center gap-2 ${!isLogisticsUnlocked ? 'opacity-40 grayscale' : ''}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] ${isLogisticsUnlocked ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-dashed border-slate-700 text-slate-600'}`}>
                            <Package size={32} />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipping</div>
                        <div className={`font-mono text-xs font-bold ${isLogisticsUnlocked ? 'text-emerald-400' : 'text-slate-600'}`}>
                            {isLogisticsUnlocked ? `${modules.logistics.rate}/t` : 'OFFLINE'}
                        </div>
                    </div>
                </div>

                {/* Stats Footer */}
                <div className="mt-auto pt-4 border-t border-slate-800 flex justify-around relative z-10 pb-2">
                    <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Total Produced</div>
                        <div className="text-lg font-mono font-bold text-white">{(gameState.inventory[gameState.activeTrendId === 'trend_ai' ? 'GPU' : 'CPU'] || 0).toLocaleString()}</div>
                    </div>
                    <div className="w-px h-8 bg-slate-800"></div>
                    <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Silicon Stock</div>
                        <div className="text-lg font-mono font-bold text-blue-300">{Math.floor(gameState.silicon).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION: CONTROL PANEL (60%) */}
            <div className="h-[60%] p-4 overflow-y-auto bg-slate-950">
                <div className="flex items-center gap-2 mb-4">
                    <Settings size={16} className="text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Control Modules</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 pb-20">
                    {/* Procurement Module */}
                    <div className={`bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between group transition-colors ${!isProcurementUnlocked ? 'opacity-50' : 'hover:border-blue-500/30'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${isProcurementUnlocked ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                                {isProcurementUnlocked ? <Truck size={24} /> : <Lock size={20} />}
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm">Procurement</div>
                                <div className="text-[10px] text-blue-400 font-mono">
                                    {isProcurementUnlocked ? `Lv.${modules.procurement.level} • ${modules.procurement.rate}/sec` : `REQ: ${getTechName('ai_procurement')}`}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onUpgradeFactoryModule('procurement')}
                            disabled={!isProcurementUnlocked || gameState.money < getUpgradeCost('procurement')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all active:scale-95 flex flex-col items-end min-w-[80px] ${!isProcurementUnlocked ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-blue-600 border-slate-700 text-white disabled:opacity-50 disabled:hover:bg-slate-800'}`}
                        >
                            <span>{isProcurementUnlocked ? 'UPGRADE' : 'LOCKED'}</span>
                            {isProcurementUnlocked && <span className="font-mono text-[10px] opacity-70">${getUpgradeCost('procurement').toLocaleString()}</span>}
                        </button>
                    </div>

                    {/* Assembly Module */}
                    <div className={`bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between group transition-colors ${!isAssemblyUnlocked ? 'opacity-50' : 'hover:border-purple-500/30'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${isAssemblyUnlocked ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                                {isAssemblyUnlocked ? <Zap size={24} /> : <Lock size={20} />}
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm">Assembly</div>
                                <div className="text-[10px] text-purple-400 font-mono">
                                    {isAssemblyUnlocked ? `Lv.${modules.assembly.level} • ${modules.assembly.rate}/sec` : `REQ: ${getTechName('mass_production')}`}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onUpgradeFactoryModule('assembly')}
                            disabled={!isAssemblyUnlocked || gameState.money < getUpgradeCost('assembly')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all active:scale-95 flex flex-col items-end min-w-[80px] ${!isAssemblyUnlocked ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-purple-600 border-slate-700 text-white disabled:opacity-50 disabled:hover:bg-slate-800'}`}
                        >
                            <span>{isAssemblyUnlocked ? 'UPGRADE' : 'LOCKED'}</span>
                            {isAssemblyUnlocked && <span className="font-mono text-[10px] opacity-70">${getUpgradeCost('assembly').toLocaleString()}</span>}
                        </button>
                    </div>

                    {/* Logistics Module */}
                    <div className={`bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between group transition-colors ${!isLogisticsUnlocked ? 'opacity-50' : 'hover:border-emerald-500/30'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${isLogisticsUnlocked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                                {isLogisticsUnlocked ? <TrendingUp size={24} /> : <Lock size={20} />}
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm">Logistics</div>
                                <div className="text-[10px] text-emerald-400 font-mono">
                                    {isLogisticsUnlocked ? `Lv.${modules.logistics.level} • ${modules.logistics.rate}/sec` : `REQ: ${getTechName('advanced_logistics')}`}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onUpgradeFactoryModule('logistics')}
                            disabled={!isLogisticsUnlocked || gameState.money < getUpgradeCost('logistics')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all active:scale-95 flex flex-col items-end min-w-[80px] ${!isLogisticsUnlocked ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-emerald-600 border-slate-700 text-white disabled:opacity-50 disabled:hover:bg-slate-800'}`}
                        >
                            <span>{isLogisticsUnlocked ? 'UPGRADE' : 'LOCKED'}</span>
                            {isLogisticsUnlocked && <span className="font-mono text-[10px] opacity-70">${getUpgradeCost('logistics').toLocaleString()}</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
