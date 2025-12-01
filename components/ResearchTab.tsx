import React, { useState, useMemo } from 'react';
import { ProductType, GameState, Language, OfficeLevel } from '../types';
import { CPU_TECH_TREE, GPU_TECH_TREE, MANUFACTURING_TECH_TREE, RESEARCHER_BASE_COST, RESEARCHER_COST_GROWTH, RP_PER_RESEARCHER_PER_DAY, HEROES, TRANSLATIONS } from '../constants';
import { Button } from './ui/Button';
import { Microscope, Lock, Check, Users, BrainCircuit, Activity, Crown, Factory, LayoutDashboard, Cpu, Hammer, Atom, Clock, UserPlus, AlertTriangle, Trash2, Plus, Zap } from 'lucide-react';

interface ResearchTabProps {
    gameState: GameState;
    language: Language;
    onResearch: (type: ProductType, nextLevelIndex: number, cost: number) => void;
    onManufacturingResearch: (techId: string) => void;
    onHireResearcher: (cost: number) => void;
    onHireHero: (heroId: string) => void;
    onSetWorkPolicy: (policy: 'relaxed' | 'normal' | 'crunch') => void;
    onFireResearcher: (id?: string) => void;
}

type TabType = 'overview' | 'products' | 'manufacturing';

const ResearchTabComponent: React.FC<ResearchTabProps> = ({
    gameState,
    language,
    onResearch,
    onManufacturingResearch,
    onHireResearcher,
    onHireHero,
    onSetWorkPolicy,
    onFireResearcher
}) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const researcherCount = typeof gameState.researchers === 'number' ? gameState.researchers : gameState.researchers.length;
    const nextHireCost = Math.floor(RESEARCHER_BASE_COST * Math.pow(RESEARCHER_COST_GROWTH, researcherCount));
    const dailyOutput = researcherCount * RP_PER_RESEARCHER_PER_DAY;

    // Calculate Max Researchers based on Office Level
    const maxResearchers = useMemo(() => {
        switch (gameState.officeLevel) {
            case OfficeLevel.GARAGE: return 4;
            case OfficeLevel.BASEMENT: return 8;
            case OfficeLevel.STARTUP: return 16;
            case OfficeLevel.CORPORATE: return 32;
            case OfficeLevel.CAMPUS: return 64;
            case OfficeLevel.HEADQUARTERS: return 128;
            default: return 4;
        }
    }, [gameState.officeLevel]);

    // Find Active Research Target (Next cheapest available tech)
    const activeResearch = useMemo(() => {
        let bestCandidate: { name: string; cost: number; type: 'cpu' | 'gpu' | 'manufacturing'; id: string; icon: any; index?: number } | null = null;
        let minCost = Infinity;

        // Check CPU
        const nextCpuIndex = gameState.techLevels[ProductType.CPU] + 1;
        if (nextCpuIndex < CPU_TECH_TREE.length) {
            const tech = CPU_TECH_TREE[nextCpuIndex];
            if (tech.researchCost < minCost) {
                minCost = tech.researchCost;
                bestCandidate = { name: tech.name, cost: tech.researchCost, type: 'cpu', id: tech.id, icon: Cpu, index: nextCpuIndex };
            }
        }

        // Check GPU
        const nextGpuIndex = gameState.techLevels[ProductType.GPU] + 1;
        if (nextGpuIndex < GPU_TECH_TREE.length) {
            const tech = GPU_TECH_TREE[nextGpuIndex];
            if (tech.researchCost < minCost) {
                minCost = tech.researchCost;
                bestCandidate = { name: tech.name, cost: tech.researchCost, type: 'gpu', id: tech.id, icon: Zap, index: nextGpuIndex };
            }
        }

        // Check Manufacturing
        const unlockedMfgTechs = MANUFACTURING_TECH_TREE.filter(tech => {
            const currentLevel = gameState.manufacturingTechLevels[tech.id] || 0;
            if (currentLevel > 0) return false; // Already researched

            // Check dependency
            if (tech.requiredTechId) {
                const parentLevel = gameState.manufacturingTechLevels[tech.requiredTechId] || 0;
                if (parentLevel === 0) return false; // Locked
            }
            return true;
        });

        if (unlockedMfgTechs.length > 0) {
            // Find cheapest unlocked mfg tech
            const cheapestMfg = unlockedMfgTechs.reduce((prev, curr) => (prev.rpCost || 0) < (curr.rpCost || 0) ? prev : curr);
            if ((cheapestMfg.rpCost || 0) < minCost) {
                minCost = cheapestMfg.rpCost || 0;
                bestCandidate = { name: cheapestMfg.name, cost: cheapestMfg.rpCost || 0, type: 'manufacturing', id: cheapestMfg.id, icon: Factory };
            }
        }

        return bestCandidate;
    }, [gameState.techLevels, gameState.manufacturingTechLevels]);

    // Notification Dots logic
    const hasProductUpgrade = useMemo(() => {
        const cpuCost = CPU_TECH_TREE[gameState.techLevels[ProductType.CPU] + 1]?.researchCost || Infinity;
        const gpuCost = GPU_TECH_TREE[gameState.techLevels[ProductType.GPU] + 1]?.researchCost || Infinity;
        return gameState.rp >= cpuCost || gameState.rp >= gpuCost;
    }, [gameState.rp, gameState.techLevels]);

    const hasMfgUpgrade = useMemo(() => {
        return MANUFACTURING_TECH_TREE.some(tech => {
            const currentLevel = gameState.manufacturingTechLevels[tech.id] || 0;
            if (currentLevel > 0) return false;
            if (tech.requiredTechId && (gameState.manufacturingTechLevels[tech.requiredTechId] || 0) === 0) return false;
            return gameState.rp >= (tech.rpCost || 0);
        });
    }, [gameState.rp, gameState.manufacturingTechLevels]);

    const renderTechCard = (type: ProductType, node: any, index: number) => {
        const currentLevel = gameState.techLevels[type];
        const isUnlocked = index <= currentLevel;
        const isNext = index === currentLevel + 1;
        const isLocked = index > currentLevel + 1;

        return (
            <div key={node.id} className={`relative p-4 rounded-xl border-2 mb-3 transition-all ${isUnlocked ? 'bg-slate-900 border-cyan-900/50' : isNext ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-cyan-500/20 text-cyan-400' : isNext ? 'bg-cyan-500 text-black animate-pulse' : 'bg-slate-800 text-slate-600'}`}>
                            {isLocked ? <Lock size={20} /> : isUnlocked ? <Check size={20} strokeWidth={3} /> : <Microscope size={20} />}
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{type} Tier {node.tier}</div>
                            <div className={`font-bold ${isNext ? 'text-white' : 'text-slate-300'}`}>{node.name}</div>
                        </div>
                    </div>
                    {isNext && (
                        <div className="text-right">
                            <div className="text-[10px] font-bold uppercase text-slate-500">Cost</div>
                            <div className={`font-mono font-bold ${gameState.rp >= node.researchCost ? 'text-emerald-400' : 'text-red-400'}`}>{node.researchCost.toLocaleString()} RP</div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 pl-[52px]">
                    <div className="flex items-center gap-1"><Hammer size={12} /> Cost: ${node.productionCost}</div>
                    <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded text-slate-300"><Activity size={10} /> Yield: {node.yield}%</div>
                </div>

                {isNext && (
                    <Button
                        size="sm"
                        className="w-full mt-3"
                        disabled={gameState.rp < node.researchCost}
                        onClick={() => onResearch(type, index, node.researchCost)}
                    >
                        Research {node.name}
                    </Button>
                )}
            </div>
        );
    };

    const renderManufacturingTechCard = (node: any) => {
        const currentLevel = gameState.manufacturingTechLevels[node.id] || 0;
        const isUnlocked = currentLevel > 0;

        // Check dependency
        let isLocked = false;
        if (node.requiredTechId) {
            const parentLevel = gameState.manufacturingTechLevels[node.requiredTechId] || 0;
            if (parentLevel === 0) isLocked = true;
        }

        const canResearch = !isUnlocked && !isLocked;

        return (
            <div key={node.id} className={`relative p-4 rounded-xl border-2 mb-3 transition-all ${isUnlocked ? 'bg-emerald-900/20 border-emerald-900/50' : canResearch ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : canResearch ? 'bg-amber-500 text-black animate-pulse' : 'bg-slate-800 text-slate-600'}`}>
                            {isLocked ? <Lock size={20} /> : isUnlocked ? <Check size={20} strokeWidth={3} /> : <Factory size={20} />}
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Manufacturing</div>
                            <div className={`font-bold ${canResearch ? 'text-white' : 'text-slate-300'}`}>{node.name}</div>
                        </div>
                    </div>
                    {canResearch && (
                        <div className="text-right">
                            <div className="text-[10px] font-bold uppercase text-slate-500">Cost</div>
                            <div className={`font-mono font-bold ${gameState.rp >= (node.rpCost || 0) ? 'text-emerald-400' : 'text-red-400'}`}>{(node.rpCost || 0).toLocaleString()} RP</div>
                        </div>
                    )}
                </div>

                <p className="text-xs text-slate-400 pl-[52px] mb-3">{node.description}</p>

                {canResearch && (
                    <Button
                        size="sm"
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white"
                        disabled={gameState.rp < (node.rpCost || 0)}
                        onClick={() => onManufacturingResearch(node.id)}
                    >
                        Unlock Upgrade
                    </Button>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-slate-950">
            {/* Tab Navigation */}
            <div className="flex p-2 gap-2 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'overview' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <LayoutDashboard size={14} />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative ${activeTab === 'products' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Cpu size={14} />
                    Products
                    {hasProductUpgrade && <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('manufacturing')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative ${activeTab === 'manufacturing' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Hammer size={14} />
                    Factory
                    {hasMfgUpgrade && <div className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>}
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* HERO SECTION: ACTIVE RESEARCH MONITOR */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                            {/* Dynamic Background Glow */}
                            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 ${activeResearch?.type === 'manufacturing' ? 'bg-amber-500/5' : 'bg-cyan-500/5'
                                }`}></div>

                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-2 h-2 rounded-full ${activeResearch ? (activeResearch.type === 'manufacturing' ? 'bg-amber-500 animate-pulse' : 'bg-cyan-400 animate-pulse') : 'bg-slate-500'
                                            }`}></div>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${activeResearch ? (activeResearch.type === 'manufacturing' ? 'text-amber-500' : 'text-cyan-400') : 'text-slate-500'
                                            }`}>
                                            {activeResearch ? 'Active Project' : 'Lab Idle'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black text-white leading-none">
                                        {activeResearch ? activeResearch.name : 'No Active Research'}
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Current RP</div>
                                    <div className="text-xl font-mono font-bold text-white">{Math.floor(gameState.rp).toLocaleString()}</div>
                                </div>
                            </div>

                            {activeResearch ? (
                                <div className="relative z-10">
                                    {gameState.rp >= activeResearch.cost ? (
                                        <button
                                            onClick={() => {
                                                if (activeResearch.type === 'manufacturing') {
                                                    onManufacturingResearch(activeResearch.id);
                                                } else {
                                                    // For CPU/GPU, we need the index. 
                                                    // We added index to bestCandidate in useMemo.
                                                    if (activeResearch.index !== undefined) {
                                                        onResearch(activeResearch.type as ProductType, activeResearch.index, activeResearch.cost);
                                                    }
                                                }
                                            }}
                                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <Check size={24} strokeWidth={3} />
                                            CLAIM COMPLETED TECH
                                        </button>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                                                <span>Progress</span>
                                                <span>{Math.min(100, (gameState.rp / activeResearch.cost) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-3">
                                                <div
                                                    className={`h-full transition-all duration-500 ${activeResearch.type === 'manufacturing'
                                                            ? 'bg-gradient-to-r from-amber-600 to-orange-500'
                                                            : 'bg-gradient-to-r from-cyan-600 to-blue-500'
                                                        }`}
                                                    style={{ width: `${Math.min(100, (gameState.rp / activeResearch.cost) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <Clock size={12} />
                                                    <span className="font-mono">
                                                        {dailyOutput > 0
                                                            ? `${Math.max(0, Math.ceil((activeResearch.cost - gameState.rp) / dailyOutput))} days left`
                                                            : 'Paused'
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <Atom size={12} />
                                                    <span className="font-mono">{activeResearch.cost.toLocaleString()} RP Target</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="relative z-10 p-4 bg-slate-800/50 border border-slate-700 border-dashed rounded-xl flex items-center gap-3">
                                    <AlertTriangle size={20} className="text-slate-500" />
                                    <div className="text-xs text-slate-400">
                                        Select a technology from the <strong>Products</strong> or <strong>Factory</strong> tabs to begin research.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* MIDDLE SECTION: STAFF MANAGEMENT */}
                        <div>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lab Staff</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold">Output</span>
                                    <span className="text-sm font-mono font-bold text-cyan-400">+{dailyOutput}/day</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {/* Render Hired Researchers */}
                                {Array.from({ length: Math.min(maxResearchers, Math.max(4, researcherCount + 1)) }).map((_, i) => {
                                    const isFilled = i < researcherCount;
                                    const isNextSlot = i === researcherCount;

                                    // Get researcher data if available
                                    const researcher = Array.isArray(gameState.researchers) && i < gameState.researchers.length
                                        ? gameState.researchers[i]
                                        : null;

                                    if (isFilled) {
                                        return (
                                            <div key={i} className="aspect-square bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center justify-center relative group overflow-hidden">
                                                {/* Fire Button - Top Right */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onFireResearcher(researcher?.id);
                                                    }}
                                                    className="absolute top-1 right-1 p-1 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Fire Researcher"
                                                >
                                                    <Trash2 size={12} />
                                                </button>

                                                <Users size={20} className="text-cyan-200 mb-1" />
                                                <div className="text-[9px] text-slate-400 font-bold uppercase truncate w-full text-center px-1">
                                                    {researcher ? researcher.name : `Staff #${i + 1}`}
                                                </div>
                                                <div className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-slate-900"></div>
                                            </div>
                                        );
                                    } else if (isNextSlot) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => onHireResearcher(nextHireCost)}
                                                disabled={gameState.money < nextHireCost}
                                                className="aspect-square bg-slate-900/30 border-2 border-dashed border-slate-800 hover:border-cyan-500 hover:bg-cyan-500/5 rounded-xl flex flex-col items-center justify-center transition-all group disabled:opacity-50 disabled:cursor-not-allowed relative"
                                            >
                                                <Plus size={32} className="text-slate-700 group-hover:text-cyan-400 transition-colors opacity-50 group-hover:opacity-100" />
                                                <div className="absolute bottom-2 text-[9px] font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                                                    ${(nextHireCost / 1000).toFixed(0)}k
                                                </div>
                                            </button>
                                        );
                                    } else {
                                        return (
                                            <div key={i} className="aspect-square bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-center opacity-30">
                                                <Lock size={14} className="text-slate-800" />
                                            </div>
                                        );
                                    }
                                })}
                            </div>

                            {/* Compact HR Policy */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity size={16} className={gameState.staffMorale < 40 ? 'text-red-500' : 'text-slate-400'} />
                                    <div className="text-xs font-bold text-slate-300">Morale: {Math.floor(gameState.staffMorale)}%</div>
                                </div>
                                <div className="flex gap-1">
                                    {(['relaxed', 'normal', 'crunch'] as const).map(policy => (
                                        <button
                                            key={policy}
                                            onClick={() => onSetWorkPolicy(policy)}
                                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all border ${gameState.workPolicy === policy
                                                ? 'bg-cyan-600 text-white border-cyan-500'
                                                : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'
                                                }`}
                                        >
                                            {policy === 'relaxed' ? 'Rlx' : policy === 'normal' ? 'Nrm' : 'Crn'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Headhunters */}
                        <div>
                            <div className="flex items-center justify-between px-1 mb-3">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.headhunters}</h3>
                            </div>
                            <div className="flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 no-scrollbar snap-x">
                                {HEROES.map(hero => {
                                    const isHired = gameState.hiredHeroes.includes(hero.id);
                                    return (
                                        <div key={hero.id} className="snap-center min-w-[280px] bg-slate-900 border-2 border-slate-800 p-5 rounded-2xl flex flex-col relative shadow-lg">
                                            {isHired && (<div className="absolute inset-0 bg-emerald-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-500"><div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black mb-2 shadow-lg shadow-emerald-500/50"><Check size={28} strokeWidth={3} /></div><div className="font-black text-white uppercase tracking-widest">{t.hired}</div></div>)}
                                            <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-lg"><Crown size={24} fill="currentColor" /></div><div><div className="font-black text-white text-base leading-none mb-1">{t[`${hero.id}_name` as keyof typeof t] || hero.name}</div><div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide bg-slate-800 px-2 py-0.5 rounded w-fit">{t[`${hero.id}_role` as keyof typeof t] || hero.role}</div></div></div>
                                            <p className="text-sm text-slate-300 mb-6 italic leading-relaxed">"{t[`${hero.id}_desc` as keyof typeof t] || hero.description}"</p>
                                            <Button size="lg" variant={isHired ? "secondary" : "primary"} className="w-full mt-auto" disabled={isHired || gameState.money < hero.hiringCost} onClick={() => onHireHero(hero.id)}>{isHired ? t.hired : `$${(hero.hiringCost / 250).toFixed(0)}k • ${t.hire}`}</Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div>
                            <div className="mb-2 px-2"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">{t.cpuArch}</span></div>
                            {CPU_TECH_TREE.map((node, i) => renderTechCard(ProductType.CPU, node, i))}
                        </div>
                        <div className="h-px bg-slate-800"></div>
                        <div>
                            <div className="mb-2 px-2"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">{t.gpuArch}</span></div>
                            {GPU_TECH_TREE.map((node, i) => renderTechCard(ProductType.GPU, node, i))}
                        </div>
                    </div>
                )}

                {activeTab === 'manufacturing' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="mb-2 px-2 flex items-center gap-2">
                            <Factory size={14} className="text-amber-500" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Manufacturing Tech</span>
                        </div>
                        {MANUFACTURING_TECH_TREE.map((node, i) => renderManufacturingTechCard(node))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ResearchTab = React.memo(ResearchTabComponent);