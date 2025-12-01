import React, { useState } from 'react';
import { GameState, Language, ProductType } from '../types';
import { TRANSLATIONS } from '../constants';
import { MarketingView } from './management/MarketingView';
import { StatisticsView } from './management/StatisticsView';
import { Megaphone, BarChart, Lock } from 'lucide-react';

interface ManagementTabProps {
    gameState: GameState;
    language: Language;
    onLaunchCampaign: (campaignId: string, productType: ProductType) => void;
}

export const ManagementTab: React.FC<ManagementTabProps> = ({
    gameState,
    language,
    onLaunchCampaign
}) => {
    const [view, setView] = useState<'marketing' | 'statistics'>('marketing');
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

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
        <div className="flex flex-col h-full">
            <div className="px-4 pt-4 pb-2">
                <div className="flex gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                    <PillButton id="marketing" label="MARKETING" icon={Megaphone} />
                    <PillButton id="statistics" label="STATISTICS" icon={BarChart} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {view === 'marketing' && (
                    <MarketingView
                        money={gameState.money}
                        brandAwareness={gameState.brandAwareness}
                        activeCampaigns={gameState.activeCampaigns}
                        onLaunchCampaign={onLaunchCampaign}
                        language={language}
                    />
                )}

                {view === 'statistics' && (
                    <StatisticsView
                        gameState={gameState}
                        language={language}
                    />
                )}
            </div>
        </div>
    );
};
