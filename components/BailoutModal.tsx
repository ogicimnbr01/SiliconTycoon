import React from 'react';
import { Button } from './ui/Button';
import { useAdMob } from '../hooks/useAdMob';
import { GameState } from '../types';
import { TRANSLATIONS } from '../constants';
import { AlertTriangle, DollarSign, XCircle } from 'lucide-react';

interface BailoutModalProps {
    gameState: GameState;
    onBailoutReward: () => void;
    onClose: () => void;
}

export const BailoutModal: React.FC<BailoutModalProps> = ({ gameState, onBailoutReward, onClose }) => {
    const { showRewardedAd, isAdReady, isAvailable } = useAdMob();
    const t = TRANSLATIONS[gameState.language] || TRANSLATIONS['en'];

    const techLevel = Math.max(1, (gameState.techLevels.CPU + gameState.techLevels.GPU) / 2);
    const bailoutAmount = Math.floor(15000 * Math.pow(1.5, techLevel));

    const handleWatchAd = () => {
        showRewardedAd('bailout', () => {
            onBailoutReward();
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
                {/* Background Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-2 animate-bounce">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                            {t.bailoutTitle}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {t.bailoutDesc}
                        </p>
                    </div>

                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 w-full">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                            {t.bailoutOffer}
                        </div>
                        <div className="text-3xl font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                            <DollarSign size={24} />
                            {bailoutAmount.toLocaleString()}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full mt-2">
                        {isAvailable && (
                            <Button
                                variant="success"
                                size="lg"
                                className="w-full h-14 text-lg shadow-lg shadow-emerald-900/20"
                                onClick={handleWatchAd}
                            >
                                <span className="mr-2">📺</span>
                                {t.watchAdGetFunds}
                            </Button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-slate-500 text-xs hover:text-slate-300 transition-colors flex items-center justify-center gap-1 py-2"
                        >
                            <XCircle size={14} />
                            {t.declineBailout}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
