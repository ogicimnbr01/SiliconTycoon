import React from 'react';
import { ProductType, GameState, Language } from '../types';
import { CPU_TECH_TREE, GPU_TECH_TREE, RESEARCHER_BASE_COST, RESEARCHER_COST_GROWTH, RP_PER_RESEARCHER_PER_DAY, HEROES, TRANSLATIONS } from '../constants';
import { Button } from './ui/Button';
import { Microscope, Lock, Check, Users, BrainCircuit, Activity, Crown } from 'lucide-react';

interface ResearchTabProps {
    gameState: GameState;
    language: Language;
    onResearch: (type: ProductType, nextLevelIndex: number, cost: number) => void;
    onHireResearcher: (cost: number) => void;
    onHireHero: (heroId: string) => void;
    onSetWorkPolicy: (policy: 'relaxed' | 'normal' | 'crunch') => void; // <-- YENİ EKLENDİ
    onFireResearcher: () => void;
}

const ResearchTabComponent: React.FC<ResearchTabProps> = ({
    gameState,
    language,
    onResearch,
    onHireResearcher,
    onHireHero,
    onSetWorkPolicy, // <-- BURAYA ALDIK
    onFireResearcher
}) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
    const nextHireCost = Math.floor(RESEARCHER_BASE_COST * Math.pow(RESEARCHER_COST_GROWTH, gameState.researchers));
    const dailyOutput = gameState.researchers * RP_PER_RESEARCHER_PER_DAY;

    const renderTechCard = (type: ProductType, tech: any, index: number) => {
        const currentLevel = gameState.techLevels[type];
        const isUnlocked = index <= currentLevel;
        const isNext = index === currentLevel + 1;
        if (index > currentLevel + 1) return null;

        return (
            <div key={tech.id} className={`relative p-6 rounded-2xl border-2 transition-all mb-6 shadow-lg ${isUnlocked ? 'bg-slate-900 border-emerald-500/30' : isNext ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border-indigo-500 shadow-indigo-500/20' : 'bg-slate-950 border-slate-800 opacity-60 grayscale'}`}>
                {isNext && (<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">{t.nextMilestone}</div>)}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h4 className={`text-lg font-black uppercase tracking-tight leading-none mb-2 ${isUnlocked ? 'text-emerald-400' : isNext ? 'text-white' : 'text-slate-500'}`}>{t[`${tech.id}_name` as keyof typeof t] || tech.name}</h4>
                        <p className="text-sm text-slate-400 font-medium leading-snug">{tech.description}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ml-4 ${isUnlocked ? 'bg-emerald-500 border-emerald-500 text-slate-900' : isNext ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-700 text-slate-700'}`}>{isUnlocked ? <Check size={20} strokeWidth={4} /> : <Lock size={18} />}</div>
                </div>
                {isNext ? (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-4"><div className="text-center"><div className="text-[10px] text-indigo-300 uppercase font-bold opacity-70">{t.baseCost}</div><div className="font-mono font-bold text-red-300 text-sm">${tech.productionCost}</div></div><div className="w-px h-8 bg-white/10"></div><div className="text-center"><div className="text-[10px] text-indigo-300 uppercase font-bold opacity-70">{t.basePrice}</div><div className="font-mono font-bold text-emerald-300 text-sm">${tech.baseMarketPrice}</div></div></div>
                        <Button size="lg" variant="primary" onClick={() => onResearch(type, index, tech.researchCost)} disabled={gameState.rp < tech.researchCost} className="w-full h-14 text-base rounded-xl shadow-xl border-indigo-400 text-indigo-100 bg-indigo-500/20 hover:bg-indigo-500 hover:text-white">{t.researchBtn} • {tech.researchCost} RP</Button>
                    </div>
                ) : isUnlocked ? (<div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-900/10 p-2 rounded-lg border border-emerald-500/10"><Check size={14} /> {t.techMastered}</div>) : (<div className="mt-2 text-xs text-slate-600 font-bold uppercase tracking-widest text-center">{t.locked}</div>)}
            </div>
        )
    };

    return (
        <div className="flex flex-col gap-8 pt-2 pb-8">
            <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl p-6 border border-purple-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div><div className="flex items-center gap-2 text-purple-300 mb-1"><Microscope size={20} /><span className="text-xs font-bold uppercase tracking-wider">{t.rndDept}</span></div><div className="text-3xl font-black text-white">{Math.floor(gameState.rp)} <span className="text-sm text-purple-300 font-medium">RP</span></div></div>
                    <div className="text-right bg-black/20 p-3 rounded-xl backdrop-blur-sm border border-white/5"><div className="text-[10px] text-purple-200 uppercase font-bold">{t.dailyOutput}</div><div className="font-mono font-bold text-white text-lg">+{dailyOutput}</div></div>
                </div>
                <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl mb-4 border border-white/5 relative z-10">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300"><Users size={20} /></div><div><div className="text-sm font-bold text-white">{gameState.researchers} {t.researchers}</div><div className="text-[10px] text-purple-300 uppercase font-bold">{t.activeStaff}</div></div></div>
                </div>
                <div className="flex gap-2 relative z-10">
                    {/* KOV BUTONU */}
                    <Button
                        onClick={onFireResearcher}
                        disabled={gameState.researchers <= 0}
                        variant="secondary"
                        className="w-1/3 h-14 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                        <span className="font-bold text-xs">{t.fireStaff}</span>
                    </Button>

                    {/* AL BUTONU */}
                    <Button
                        onClick={() => onHireResearcher(nextHireCost)}
                        disabled={gameState.money < nextHireCost}
                        className="flex-1 h-14"
                        variant="primary"
                    >
                        <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-sm">{t.hireStaff}</span>
                            <span className="font-mono text-sm opacity-80 bg-black/20 px-2 py-1 rounded">-${nextHireCost.toLocaleString()}</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* HR POLICY PANEL - ARTIK ÇALIŞIYOR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${gameState.staffMorale < 40 ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-400'}`}>
                            <Activity size={18} />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase text-slate-500">{t.hrPolicy}</div>
                            <div className={`text-sm font-black ${gameState.staffMorale < 40 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                                {t.morale}: {Math.floor(gameState.staffMorale)}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 relative z-10">
                    {(['relaxed', 'normal', 'crunch'] as const).map(policy => (
                        <button
                            key={policy}
                            onClick={() => onSetWorkPolicy(policy)} // <-- PROP BURADA BAĞLANDI
                            className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${gameState.workPolicy === policy
                                ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105' // SEÇİLİ HALİ MAVİ
                                : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'
                                }`}
                        >
                            {policy === 'relaxed' ? t.policyRelaxedName : policy === 'normal' ? t.policyNormalName : t.policyCrunchName}
                        </button>
                    ))}
                </div>

                <p className="text-[10px] text-slate-500 mt-3 text-center italic">
                    {gameState.workPolicy === 'relaxed' ? t.policyRelaxedDesc :
                        gameState.workPolicy === 'crunch' ? t.policyCrunchDesc :
                            t.policyNormalDesc}
                </p>
            </div>

            <div>
                <div className="flex items-center justify-between px-1 mb-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.headhunters}</h3>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{t.scrollMore}</span>
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

            <div>
                <div className="flex items-center gap-3 mb-6 px-1"><div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400"><BrainCircuit size={18} /></div><span className="text-sm font-bold text-white uppercase tracking-wide">{t.techRoadmap}</span></div>
                <div className="mb-2 px-2"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">{t.cpuArch}</span></div>
                {CPU_TECH_TREE.map((node, i) => renderTechCard(ProductType.CPU, node, i))}
                <div className="my-6 h-px bg-slate-800"></div>
                <div className="mb-2 px-2"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">{t.gpuArch}</span></div>
                {GPU_TECH_TREE.map((node, i) => renderTechCard(ProductType.GPU, node, i))}
            </div>
        </div>
    );
};

export const ResearchTab = React.memo(ResearchTabComponent);