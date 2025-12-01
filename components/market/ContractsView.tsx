import React from 'react';
import { GameState } from '../../types';
import { TRANSLATIONS } from '../../constants';
import { Button } from '../ui/Button';
import { Briefcase } from 'lucide-react';

interface ContractsViewProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onAcceptContract: (contractId: string) => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({ gameState, language, onAcceptContract }) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

    return (
        <div className="space-y-4">
            {gameState.activeContracts.length === 0 && gameState.availableContracts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
                    <Briefcase size={48} className="mb-4 opacity-50" />
                    <p className="font-bold text-sm uppercase tracking-wider">{t.noContracts}</p>
                </div>
            )}
            {gameState.activeContracts.map(contract => (
                <div key={contract.id} className="bg-slate-900 border-l-4 border-blue-500 p-5 rounded-r-xl shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white">{contract.title}</h4>
                        <div className="text-xs font-mono text-blue-400 font-bold bg-blue-900/20 px-2 py-1 rounded">{contract.requiredProduct}</div>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mb-2">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(contract.fulfilledAmount / contract.requiredAmount) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                        <span>{contract.fulfilledAmount} / {contract.requiredAmount}</span>
                        <span className="text-blue-400">{contract.deadlineDay - gameState.day} {t.daysLeft}</span>
                    </div>
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
                            <div className="text-emerald-400 font-mono font-bold text-lg">+${(contract.upfrontPayment || 0).toLocaleString()} {t.now}</div>
                            <div className="text-emerald-600 font-mono text-sm font-bold">+${(contract.completionPayment || contract.reward).toLocaleString()} {t.later}</div>
                        </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                        {contract.minPerformance && <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded">{t.req}: {contract.minPerformance}+ {t.minPerf}</span>}
                        {contract.minEfficiency && <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded">{t.req}: {contract.minEfficiency}+ {t.minEff}</span>}
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{contract.description}</p>
                    <Button
                        variant="secondary"
                        size="md"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white border-none font-bold"
                        onClick={() => onAcceptContract(contract.id)}
                    >
                        {t.accept}
                    </Button>
                </div>
            ))}
        </div>
    );
};
