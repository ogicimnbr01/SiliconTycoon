import React, { useState, useEffect } from 'react';
import { GameState, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { useAdMob } from '../hooks/useAdMob';
import { X, Gift, RotateCw } from 'lucide-react';

interface DailyBonusWheelProps {
    gameState: GameState;
    language: Language;
    onClose: () => void;
    onSpin: (prize: string, amount: number, type: 'money' | 'rp' | 'silicon' | 'reputation') => void;
}

export const DailyBonusWheel: React.FC<DailyBonusWheelProps> = ({ gameState, language, onClose, onSpin }) => {
    const t = TRANSLATIONS[language];
    const { showRewardedAd, isAdReady } = useAdMob(gameState.isPremium);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [prizeIndex, setPrizeIndex] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const canSpinFree = !gameState.dailySpinUsed;
    const spinsRemaining = gameState.extraSpinsRemaining;
    const canSpinAd = !canSpinFree && spinsRemaining > 0;

    // Calculate dynamic prizes based on tech level
    const prizes = React.useMemo(() => {
        const techLevel = Math.max(1, (gameState.techLevels.CPU + gameState.techLevels.GPU) / 2);
        const baseMoney = 2000 * Math.pow(1.5, techLevel); // Scale exponentially: 2k, 3k, 4.5k...

        return [
            { id: 'money_small', type: 'money', amount: Math.floor(baseMoney), label: `$${Math.floor(baseMoney / 1000)}k`, color: 'bg-emerald-500', weight: 30 },
            { id: 'money_medium', type: 'money', amount: Math.floor(baseMoney * 2.5), label: `$${Math.floor(baseMoney * 2.5 / 1000)}k`, color: 'bg-emerald-600', weight: 20 },
            { id: 'money_large', type: 'money', amount: Math.floor(baseMoney * 10), label: `$${Math.floor(baseMoney * 10 / 1000)}k`, color: 'bg-emerald-700', weight: 5 },
            { id: 'rp_small', type: 'rp', amount: 100 * techLevel, label: `${100 * techLevel} RP`, color: 'bg-purple-500', weight: 25 },
            { id: 'rp_medium', type: 'rp', amount: 500 * techLevel, label: `${500 * techLevel} RP`, color: 'bg-purple-600', weight: 10 },
            { id: 'silicon', type: 'silicon', amount: 500 * techLevel, label: `${500 * techLevel} Wafers`, color: 'bg-orange-500', weight: 10 },
        ] as const;
    }, [gameState.techLevels]);

    const handleSpinClick = () => {
        if (isSpinning) return;

        if (canSpinFree) {
            startSpin();
        } else if (canSpinAd) {
            showRewardedAd('spin', () => {
                startSpin();
            });
        }
    };

    const startSpin = () => {
        setIsSpinning(true);
        setShowResult(false);

        // Improved Random Selection
        const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;

        for (let i = 0; i < prizes.length; i++) {
            random -= prizes[i].weight;
            if (random <= 0) {
                selectedIndex = i;
                break;
            }
        }

        // Calculate rotation
        const segmentAngle = 360 / prizes.length;
        // Add randomness to landing position within the segment (±20 deg)
        const randomOffset = (Math.random() - 0.5) * 40;

        const targetRotation = rotation + (5 * 360) + (360 - (selectedIndex * segmentAngle)) - (segmentAngle / 2) + randomOffset;

        setRotation(targetRotation);
        setPrizeIndex(selectedIndex);

        setTimeout(() => {
            setIsSpinning(false);
            setShowResult(true);
            const prize = prizes[selectedIndex];
            onSpin(prize.label, prize.amount, prize.type as any);
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-md p-6 flex flex-col items-center">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
                >
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest text-center shadow-emerald-500/50 drop-shadow-lg">
                    {t.dailyBonus}
                </h2>
                <p className="text-slate-400 mb-8 text-center">
                    {canSpinFree ? t.freeSpinAvailable : t.adSpinsRemaining.replace('{0}', spinsRemaining.toString())}
                </p>

                {/* Wheel Container */}
                <div className="relative w-64 h-64 mb-8">
                    {/* Pointer */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 text-white drop-shadow-lg">
                        ▼
                    </div>

                    {/* Wheel */}
                    <div
                        className="w-full h-full rounded-full border-4 border-slate-700 relative overflow-hidden shadow-2xl transition-transform duration-[3000ms] cubic-bezier(0.2, 0.8, 0.2, 1)"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {prizes.map((prize, i) => (
                            <div
                                key={prize.id}
                                className={`absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center`}
                                style={{
                                    transform: `rotate(${i * (360 / prizes.length)}deg) skewY(-30deg)`,
                                }}
                            >
                            </div>
                        ))}
                        {/* Fallback visual: Conic Gradient */}
                        <div className="absolute inset-0 rounded-full" style={{
                            background: `conic-gradient(
                                from 0deg,
                                ${prizes[0].color.replace('bg-', '').replace('-500', '') === 'emerald' ? '#10b981' : prizes[0].color.replace('bg-', '').replace('-500', '') === 'purple' ? '#a855f7' : '#f97316'} 0deg 60deg,
                                ${prizes[1].color.replace('bg-', '').replace('-600', '') === 'emerald' ? '#059669' : '#7c3aed'} 60deg 120deg,
                                ${prizes[2].color.replace('bg-', '').replace('-700', '') === 'emerald' ? '#047857' : '#f97316'} 120deg 180deg,
                                ${prizes[3].color.replace('bg-', '').replace('-500', '') === 'purple' ? '#a855f7' : '#10b981'} 180deg 240deg,
                                ${prizes[4].color.replace('bg-', '').replace('-600', '') === 'purple' ? '#7c3aed' : '#059669'} 240deg 300deg,
                                ${prizes[5].color.replace('bg-', '').replace('-500', '') === 'orange' ? '#f97316' : '#a855f7'} 300deg 360deg
                            )`
                            // Note: The above color mapping is a bit hacky. Let's just hardcode the colors based on index since the order is fixed in useMemo.
                            // Index 0: Emerald-500 (#10b981)
                            // Index 1: Emerald-600 (#059669)
                            // Index 2: Emerald-700 (#047857)
                            // Index 3: Purple-500 (#a855f7)
                            // Index 4: Purple-600 (#7c3aed)
                            // Index 5: Orange-500 (#f97316)
                        }} />

                        {/* Better Gradient Implementation */}
                        <div className="absolute inset-0 rounded-full" style={{
                            background: `conic-gradient(
                                from 0deg,
                                #10b981 0deg 60deg,
                                #059669 60deg 120deg,
                                #047857 120deg 180deg,
                                #a855f7 180deg 240deg,
                                #7c3aed 240deg 300deg,
                                #f97316 300deg 360deg
                            )`
                        }} />

                        {/* Labels (Overlay) */}
                        {prizes.map((prize, i) => (
                            <div
                                key={prize.id}
                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                style={{
                                    transform: `rotate(${i * 60 + 30}deg)`,
                                }}
                            >
                                <div
                                    className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-bold text-xs whitespace-nowrap drop-shadow-md"
                                    style={{
                                        paddingTop: '10px',
                                    }}
                                >
                                    {prize.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spin Button */}
                <button
                    onClick={handleSpinClick}
                    disabled={isSpinning || (!canSpinFree && !canSpinAd)}
                    className={`w-full max-w-xs py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isSpinning ? 'bg-slate-800 text-slate-500' :
                        canSpinFree ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white' :
                            canSpinAd ? 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-white' :
                                'bg-slate-800 text-slate-600'
                        }`}
                >
                    {isSpinning ? t.spinning :
                        canSpinFree ? t.spinFree :
                            canSpinAd ? t.watchAdToSpin :
                                t.noSpinsLeft}
                </button>

                {showResult && prizeIndex !== null && (
                    <div className="mt-6 p-4 bg-slate-800 rounded-xl border border-emerald-500/30 animate-in zoom-in text-center">
                        <div className="text-slate-400 text-sm uppercase font-bold mb-1">{t.youWon}</div>
                        <div className="text-2xl font-black text-white">{prizes[prizeIndex].label}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
