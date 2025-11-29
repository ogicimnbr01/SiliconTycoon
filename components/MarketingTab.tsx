import React from 'react';
import { ProductType, Language, MarketingCampaign, ActiveCampaign } from '../types';
import { MARKETING_CAMPAIGNS, TRANSLATIONS } from '../constants';
import { TrendingUp, Zap, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';

interface MarketingTabProps {
    money: number;
    brandAwareness: Record<ProductType, number>;
    activeCampaigns: ActiveCampaign[];
    onLaunchCampaign: (campaignId: string, productType: ProductType) => void;
    language: Language;
}

export const MarketingTab: React.FC<MarketingTabProps> = ({
    money,
    brandAwareness,
    activeCampaigns,
    onLaunchCampaign,
    language
}) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

    return (
        <div className="p-4 space-y-6">
            {activeCampaigns.length === 0 && (
                <div className="mb-4 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-orange-400 text-sm font-bold">
                        <AlertTriangle size={16} />
                        <span>No active marketing campaigns! Brand awareness will decay.</span>
                    </div>
                </div>
            )}
            {/* Brand Awareness Display */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="text-indigo-400" size={20} />
                    {t.brandAwareness}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(brandAwareness).map(([type, awareness]) => (
                        <div key={type} className="bg-slate-900/50 rounded-lg p-3">
                            <div className="text-xs text-slate-400 mb-1">{type}</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                        style={{ width: `${awareness}%` }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-white">{awareness}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Campaigns */}
            {activeCampaigns.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Zap className="text-yellow-400" size={20} />
                        {t.activeCampaigns}
                    </h2>
                    <div className="space-y-2">
                        {activeCampaigns.map((ac, idx) => {
                            const campaign = MARKETING_CAMPAIGNS.find(c => c.id === ac.id);
                            if (!campaign) return null;
                            const nameKey = `${campaign.id}_name` as keyof typeof t;
                            const descKey = `${campaign.id}_desc` as keyof typeof t;
                            return (
                                <div key={idx} className="bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-white">{t[nameKey] || campaign.name}</div>
                                        <div className="text-xs text-slate-400">{t[descKey] || campaign.description}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-indigo-400">{ac.daysRemaining} {t.days}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Available Campaigns */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="text-emerald-400" size={20} />
                    {t.campaigns}
                </h2>
                <div className="space-y-3">
                    {MARKETING_CAMPAIGNS.map(campaign => {
                        const nameKey = `${campaign.id}_name` as keyof typeof t;
                        const descKey = `${campaign.id}_desc` as keyof typeof t;
                        return (
                            <div key={campaign.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{t[nameKey] || campaign.name}</h3>
                                        <p className="text-xs text-slate-400 mt-1">{t[descKey] || campaign.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-emerald-400 font-bold">${(campaign.cost / 1000).toFixed(0)}k</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                                    <div className="bg-slate-800 rounded p-2">
                                        <div className="text-slate-500">{t.duration}</div>
                                        <div className="text-white font-bold flex items-center gap-1">
                                            <Clock size={12} /> {campaign.duration}d
                                        </div>
                                    </div>
                                    <div className="bg-slate-800 rounded p-2">
                                        <div className="text-slate-500">{t.boost}</div>
                                        <div className="text-indigo-400 font-bold">+{campaign.awarenessBoost}%</div>
                                    </div>
                                    <div className="bg-slate-800 rounded p-2">
                                        <div className="text-slate-500">{t.type}</div>
                                        <div className="text-white font-bold capitalize">{campaign.type}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={() => onLaunchCampaign(campaign.id, ProductType.CPU)}
                                        disabled={money < campaign.cost}
                                        className="text-xs"
                                    >
                                        {t.launch} (CPU)
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => onLaunchCampaign(campaign.id, ProductType.GPU)}
                                        disabled={money < campaign.cost}
                                        className="text-xs"
                                    >
                                        {t.launch} (GPU)
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
