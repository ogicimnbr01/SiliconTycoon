import React, { useState } from 'react';
import { ProductType, GameState, TabType } from '../types';
import { MARKET_TRENDS, TRANSLATIONS } from '../constants';
import { Button } from './ui/Button';
import { DollarSign, Briefcase, Skull, AlertTriangle, Lock, X, Target } from 'lucide-react';
import { format } from '../utils/gameUtils';
import { SalesView } from './market/SalesView';
import { ContractsView } from './market/ContractsView';
import { WarfareView } from './market/WarfareView';

interface MarketTabProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onSell: (type: ProductType, currentPrice: number) => void;
    onAcceptContract: (contractId: string) => void;
    onCovertOp: (type: 'espionage' | 'sabotage', targetId: string) => void;
    onRetire: () => void;
    unlockedTabs: TabType[];
}

const MarketTab: React.FC<MarketTabProps> = ({
    gameState,
    language,
    onSell,
    onAcceptContract,
    onCovertOp,
    onRetire,
    unlockedTabs
}) => {
    const [view, setView] = useState<'sales' | 'contracts' | 'warfare'>('sales');
    const [targetModalOpen, setTargetModalOpen] = useState(false);
    const [selectedOpType, setSelectedOpType] = useState<'espionage' | 'sabotage' | null>(null);

    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
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
                            {gameState.competitors.map(comp => (
                                <button key={comp.id} onClick={() => handleTargetSelect(comp.id)} className="w-full text-left p-4 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all mb-2 group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-white group-hover:text-red-400 transition-colors truncate" title={comp.name}>{comp.name}</span>
                                        <span className="font-mono text-xs text-slate-500">${(comp.money / 1000).toFixed(0)}k</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <PillButton id="sales" label={t.sales} icon={DollarSign} />
                <PillButton id="contracts" label={t.contracts} icon={Briefcase} locked={!isAdvancedUnlocked} />
                <PillButton id="warfare" label={t.warfare} icon={Skull} locked={!isAdvancedUnlocked} />
            </div>

            <div className="space-y-4">
                {view === 'sales' && (
                    <SalesView gameState={gameState} language={language} onSell={onSell} />
                )}

                {view === 'contracts' && (
                    <ContractsView gameState={gameState} language={language} onAcceptContract={onAcceptContract} />
                )}

                {view === 'warfare' && (
                    <WarfareView
                        gameState={gameState}
                        language={language}
                        onCovertOp={prepareOp}
                        onRetire={onRetire}
                    />
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