import React, { useState, useEffect } from 'react';
import { GameState, ProductType, DesignSpec, OfficeLevel } from '../types';
import { TRANSLATIONS } from '../constants';
import { CPU_TECH_TREE, GPU_TECH_TREE, OFFICE_CONFIGS, MARKET_TRENDS } from '../constants';
import { Zap, TrendingUp, TrendingDown, AlertTriangle, Lock, Unlock, Factory, Briefcase, DollarSign, Clock, Shield, ChevronRight, ChevronDown, ArrowLeft, Cpu, Building, Settings, Package, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useAdMob } from '../hooks/useAdMob';

interface FactoryTabProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onProduce: (type: ProductType, amount: number, cost: number, siliconCost: number) => void;
    onBuySilicon: (amount: number) => void;
    onUpgradeOffice: () => void;
    onDowngradeOffice: () => void;
    onUpdateDesignSpec: (type: ProductType, specs: { performance: number; efficiency: number }) => void;
    onActivateOverdrive: () => void;
    onAdStart?: () => void;
    onAdEnd?: () => void;
}

export const FactoryTab: React.FC<FactoryTabProps> = ({
    gameState,
    language,
    onProduce,
    onBuySilicon,
    onUpgradeOffice,
    onDowngradeOffice,
    onUpdateDesignSpec,
    onActivateOverdrive,
    onAdStart,
    onAdEnd
}) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
    const [step, setStep] = useState<'select' | 'produce'>('select');
    const [selectedProduct, setSelectedProduct] = useState<ProductType>(ProductType.CPU);
    const [productionAmount, setProductionAmount] = useState(10);
    const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
    const [upgradeError, setUpgradeError] = useState<string | null>(null);
    const [siliconBuyAmount, setSiliconBuyAmount] = useState(100);

    // Overdrive Logic
    const { showRewardedAd, isAdReady } = useAdMob(gameState.isPremium);
    const [isAdLoading, setIsAdLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    // Derived State for Overdrive
    const isUnlocked = gameState.officeLevel >= 2 || gameState.day >= 15;
    const COOLDOWN_MS = 45 * 60 * 1000;
    const timeSinceLastUse = Date.now() - (gameState.lastOverdriveTime || 0);
    const isOnCooldown = !!gameState.lastOverdriveTime && timeSinceLastUse < COOLDOWN_MS;
    const cooldownMinutes = isOnCooldown ? Math.ceil((COOLDOWN_MS - timeSinceLastUse) / 60000) : 0;

    useEffect(() => {
        if (!gameState.overdriveActive) {
            setTimeLeft(0);
            return;
        }

        const updateTimer = () => {
            const remaining = Math.max(0, gameState.overdriveEndsAt - Date.now());
            setTimeLeft(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [gameState.overdriveActive, gameState.overdriveEndsAt]);

    useEffect(() => {
        if (showUpgradeConfirm) setUpgradeError(null);
    }, [showUpgradeConfirm]);

    const handleOverdriveClick = async () => {
        if (gameState.overdriveActive) return;

        if (!isUnlocked) {
            onActivateOverdrive(); // Will trigger locked message
            return;
        }

        if (isOnCooldown) {
            onActivateOverdrive(); // Will trigger cooldown message
            return;
        }

        setIsAdLoading(true);
        if (onAdStart) onAdStart();
        await showRewardedAd('boost', () => {
            onActivateOverdrive();
            if (onAdEnd) onAdEnd();
        });
        setIsAdLoading(false);
    };

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const renderUpgradeModal = () => {
        if (!showUpgradeConfirm) return null;

        const currentOffice = OFFICE_CONFIGS[gameState.officeLevel];
        const nextLevel = (gameState.officeLevel + 1) as any;
        const nextOffice = OFFICE_CONFIGS[nextLevel];
        const hasNextLevel = !!nextOffice;

        const getOfficeName = (level: number) => {
            const keys = [
                'office_garage_name',
                'office_basement_name',
                'office_startup_name',
                'office_corporate_name',
                'office_campus_name',
                'office_hq_name'
            ];
            return t[keys[level] as keyof typeof t] || OFFICE_CONFIGS[level as any]?.name;
        };

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-black text-white mb-4 text-center">{t.upgrade} {t.officeLevel}</h3>
                    {upgradeError && (
                        <div className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs font-bold text-center animate-in slide-in-from-top-2">
                            {upgradeError}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-500 uppercase text-center">{t.current}</div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                <div className="font-bold text-white mb-1">{getOfficeName(gameState.officeLevel)}</div>
                                <div className="text-[10px] text-slate-400">{t.cap}: {currentOffice.siliconCap}</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-emerald-500 uppercase text-center">{t.nextLevel}</div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-bl-lg"></div>
                                <div className="font-bold text-emerald-400 mb-1">{hasNextLevel ? getOfficeName(gameState.officeLevel + 1) : t.maxed}</div>
                                <div className="text-[10px] text-emerald-400/70">{hasNextLevel ? `${t.cap}: ${nextOffice.siliconCap}` : '-'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowUpgradeConfirm(false)}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                        >
                            {t.cancel}
                        </button>
                        {hasNextLevel && (
                            <button
                                onClick={() => {
                                    if (gameState.money >= nextOffice.upgradeCost) {
                                        onUpgradeOffice();
                                        setShowUpgradeConfirm(false);
                                    } else {
                                        setUpgradeError(t.insufficientFunds);
                                    }
                                }}
                                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-colors"
                            >
                                {t.upgrade} (${nextOffice.upgradeCost.toLocaleString()})
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderSelectionStep = () => (
        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-left duration-300">
            {[ProductType.CPU, ProductType.GPU].map(type => {
                const techTree = type === ProductType.CPU ? CPU_TECH_TREE : GPU_TECH_TREE;
                const tech = techTree[gameState.techLevels[type]];
                const isCPU = type === ProductType.CPU;

                return (
                    <button
                        key={type}
                        onClick={() => {
                            setSelectedProduct(type);
                            setStep('produce');
                        }}
                        className={`relative group p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isCPU
                            ? 'bg-slate-900/80 border-indigo-500/30 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20'
                            : 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20'
                            }`}
                    >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${isCPU ? 'bg-indigo-500' : 'bg-emerald-500'}`} />

                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className={`p-3 rounded-xl ${isCPU ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                {isCPU ? <Cpu size={32} /> : <Zap size={32} />}
                            </div>

                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{type}</div>
                                <div className="text-lg font-black text-white leading-tight">{t[`${tech.id}_name` as keyof typeof t] || tech.name}</div>
                                <div className="text-[10px] font-mono text-slate-400 mt-1">Tier {tech.tier}</div>
                            </div>

                            <div className="w-full pt-3 border-t border-slate-800">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-slate-500">{t.cost}</span>
                                    <span className="text-white">${tech.productionCost}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold mt-1">
                                    <span className="text-slate-500">{t.yield}</span>
                                    <span className={tech.yield >= 90 ? 'text-emerald-400' : 'text-yellow-400'}>{tech.yield}%</span>
                                </div>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );

    const renderProductionStep = () => {
        const spec = gameState.designSpecs[selectedProduct];
        const techTree = selectedProduct === ProductType.CPU ? CPU_TECH_TREE : GPU_TECH_TREE;
        const tech = techTree[gameState.techLevels[selectedProduct]];

        const activeTrend = MARKET_TRENDS.find(tr => tr.id === gameState.activeTrendId);
        const isTrendApplicable = activeTrend?.affectedProducts.includes(selectedProduct);
        const meetsTrend = isTrendApplicable && activeTrend && spec[activeTrend.requiredSpec] >= activeTrend.minSpecValue;

        const siliconPerUnit = tech.productionCost / 10;
        const totalSiliconNeeded = Math.ceil(siliconPerUnit * productionAmount);
        const totalCost = tech.productionCost * productionAmount;
        const canProduce = gameState.money >= totalCost && gameState.silicon >= totalSiliconNeeded;

        return (
            <div className="space-y-4 animate-in slide-in-from-right duration-300 pb-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setStep('select')}
                        className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                            {selectedProduct === ProductType.CPU ? <Cpu size={20} className="text-indigo-400" /> : <Zap size={20} className="text-emerald-400" />}
                            {t[`${tech.id}_name` as keyof typeof t] || tech.name}
                        </h2>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.design} & {t.manufacturing}</div>
                    </div>
                </div>

                {/* Design Section */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
                    {isTrendApplicable && activeTrend && (
                        <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl border-l border-b ${meetsTrend ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                            {meetsTrend ? t.trendMatched : t.trendMissed}
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Settings size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{t.designSpecs}</span>
                    </div>

                    <div className="space-y-4">
                        {/* Performance Slider */}
                        <div className="relative">
                            <div className="flex justify-between mb-1 text-[10px] font-bold">
                                <span className={activeTrend?.requiredSpec === 'performance' ? 'text-yellow-400' : 'text-slate-400'}>
                                    {t.performance} {activeTrend?.requiredSpec === 'performance' && `(${activeTrend.minSpecValue}+)`}
                                </span>
                                <span className="text-white font-mono">{spec.performance}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100"
                                value={spec.performance}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    onUpdateDesignSpec(selectedProduct, { performance: val, efficiency: 100 - val });
                                }}
                                className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Efficiency Slider */}
                        <div className="relative">
                            <div className="flex justify-between mb-1 text-[10px] font-bold">
                                <span className={activeTrend?.requiredSpec === 'efficiency' ? 'text-yellow-400' : 'text-slate-400'}>
                                    {t.efficiency} {activeTrend?.requiredSpec === 'efficiency' && `(${activeTrend.minSpecValue}+)`}
                                </span>
                                <span className="text-white font-mono">{spec.efficiency}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100"
                                value={spec.efficiency}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    onUpdateDesignSpec(selectedProduct, { performance: 100 - val, efficiency: val });
                                }}
                                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Production Section */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Package size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{t.production}</span>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between mb-1 text-[10px] font-bold">
                            <span className="text-slate-400">{t.amount}</span>
                            <span className="text-white font-mono">{productionAmount} {t.units}</span>
                        </div>
                        <input
                            type="range"
                            min="1" max="1000"
                            value={productionAmount}
                            onChange={(e) => setProductionAmount(parseInt(e.target.value))}
                            className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />

                        {/* Quick Select Buttons */}
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {(() => {
                                const siliconPerUnit = tech.productionCost / 10;
                                const maxPossible = Math.min(1000, Math.floor(gameState.silicon / siliconPerUnit));
                                return [
                                    { label: '10', val: 10 },
                                    { label: '50', val: 50 },
                                    { label: '100', val: 100 },
                                    { label: 'MAX', val: maxPossible }
                                ].map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setProductionAmount(Math.max(1, opt.val))}
                                        disabled={opt.val < 1}
                                        className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${productionAmount === opt.val
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            } disabled:opacity-30`}
                                    >
                                        {opt.label}
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                            <div className="text-[10px] text-slate-500 font-bold uppercase">{t.cost}</div>
                            <div className={`text-sm font-mono font-bold ${gameState.money >= totalCost ? 'text-white' : 'text-red-400'}`}>
                                ${totalCost.toLocaleString()}
                            </div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                            <div className="text-[10px] text-slate-500 font-bold uppercase">{t.silicon}</div>
                            <div className={`text-sm font-mono font-bold ${gameState.silicon >= totalSiliconNeeded ? 'text-blue-300' : 'text-red-400'}`}>
                                {totalSiliconNeeded}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onProduce(selectedProduct, productionAmount, totalCost, totalSiliconNeeded)}
                        disabled={!canProduce}
                        className={`w-full py-3 rounded-xl font-black text-base uppercase tracking-wider transition-all shadow-lg ${canProduce
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white active:scale-95 shadow-indigo-500/20'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            }`}
                    >
                        {canProduce ? t.produce : t.noSilicon}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full pb-24 overflow-y-auto px-1">
            {/* Overdrive Button */}
            {(isAdReady || gameState.overdriveActive || !isUnlocked || isOnCooldown) && (
                <div className="mb-4 px-1">
                    <button
                        onClick={handleOverdriveClick}
                        disabled={gameState.overdriveActive || isAdLoading || !isUnlocked || isOnCooldown}
                        className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 relative overflow-hidden ${gameState.overdriveActive
                            ? 'bg-yellow-500 text-black shadow-yellow-500/20'
                            : (!isUnlocked || isOnCooldown)
                                ? 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
                                : 'bg-slate-800 text-yellow-400 border border-yellow-500/30 hover:bg-slate-700'
                            }`}
                    >
                        {gameState.overdriveActive && (
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        )}
                        <Zap size={18} className={gameState.overdriveActive ? 'animate-bounce' : ''} />
                        {gameState.overdriveActive
                            ? `OVERDRIVE ACTIVE (${formatTime(timeLeft)})`
                            : !isUnlocked
                                ? `🔒 LOCKED (Office Lv2 or Day 15)`
                                : isOnCooldown
                                    ? `⏱️ COOLDOWN (${cooldownMinutes}m remaining)`
                                    : isAdLoading ? 'LOADING AD...' : 'ACTIVATE OVERDRIVE (2X SPEED)'
                        }
                    </button>
                </div>
            )}

            {/* Office Upgrade/Downgrade Section */}
            <div className="mb-4 px-1 flex flex-col gap-2">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase">Office Level</div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>Lv {gameState.officeLevel}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-emerald-400">
                                {(() => {
                                    const keys = [
                                        'office_garage_name',
                                        'office_basement_name',
                                        'office_startup_name',
                                        'office_corporate_name',
                                        'office_campus_name',
                                        'office_hq_name'
                                    ];
                                    return t[keys[gameState.officeLevel] as keyof typeof t] || OFFICE_CONFIGS[gameState.officeLevel]?.name;
                                })()}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={onDowngradeOffice}
                            disabled={gameState.officeLevel === 0}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg disabled:opacity-30"
                        >
                            <ArrowDownCircle size={16} />
                        </button>
                        <button
                            onClick={() => setShowUpgradeConfirm(true)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg"
                        >
                            <ArrowUpCircle size={16} />
                        </button>
                    </div>
                </div>

                {/* Silicon Purchase Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-xs text-slate-500 font-bold uppercase">Buy Silicon</div>
                        <div className="text-[10px] text-blue-400 font-mono">${Math.floor(gameState.siliconPrice)}/unit</div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-2">
                        {(() => {
                            const currentOffice = OFFICE_CONFIGS[gameState.officeLevel];
                            const maxStorage = currentOffice.siliconCap;
                            const spaceAvailable = Math.max(0, maxStorage - gameState.silicon);
                            const maxAffordable = Math.floor(gameState.money / gameState.siliconPrice);
                            const maxBuyable = Math.min(spaceAvailable, maxAffordable);

                            return [
                                { label: '25%', amount: Math.floor(maxBuyable * 0.25) },
                                { label: '50%', amount: Math.floor(maxBuyable * 0.50) },
                                { label: '100%', amount: maxBuyable },
                                { label: 'MAX', amount: maxBuyable }
                            ].slice(0, 3).map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => onBuySilicon(opt.amount)}
                                    disabled={opt.amount <= 0}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold py-1 rounded disabled:opacity-30"
                                >
                                    {opt.label}
                                </button>
                            ));
                        })()}
                        <button
                            onClick={() => onBuySilicon(siliconBuyAmount)}
                            disabled={siliconBuyAmount <= 0 || gameState.money < siliconBuyAmount * gameState.siliconPrice}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-1 rounded disabled:opacity-30"
                        >
                            BUY {siliconBuyAmount}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={siliconBuyAmount}
                            onChange={(e) => setSiliconBuyAmount(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full bg-slate-950 border border-slate-800 rounded text-center text-xs text-white py-1"
                            placeholder="Custom Amount"
                        />
                    </div>
                </div>
            </div>

            {step === 'select' ? renderSelectionStep() : renderProductionStep()}
            {renderUpgradeModal()}
        </div>
    );
};