import React, { useState } from 'react';
import { GameState, ProductType, DesignSpec } from '../types';
import { TRANSLATIONS, CPU_TECH_TREE, GPU_TECH_TREE, OFFICE_CONFIGS, MARKET_TRENDS } from '../constants';
import { Cpu, Zap, Settings, TrendingUp, Package, ArrowLeft, ShoppingCart, Building } from 'lucide-react';
import { getReputationBonuses } from '../utils/gameUtils';

interface FactoryTabProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onProduce: (type: ProductType, amount: number, cost: number, siliconCost: number) => void;
    onBuySilicon: (amount: number) => void;
    onUpgradeOffice: () => void;
    onDowngradeOffice: () => void;
    onSetStrategy: (strategy: 'low' | 'medium' | 'high') => void;
    onUpdateDesignSpec: (type: ProductType, spec: DesignSpec) => void;
}

const FactoryTabComponent: React.FC<FactoryTabProps> = ({
    gameState,
    language,
    onProduce,
    onBuySilicon,
    onUpgradeOffice,
    onDowngradeOffice,
    onSetStrategy,
    onUpdateDesignSpec
}) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
    const [step, setStep] = useState<'select' | 'produce'>('select');
    const [selectedProduct, setSelectedProduct] = useState<ProductType>(ProductType.CPU);
    const [productionAmount, setProductionAmount] = useState(10);
    const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
    const [upgradeError, setUpgradeError] = useState<string | null>(null);

    React.useEffect(() => {
        if (showUpgradeConfirm) setUpgradeError(null);
    }, [showUpgradeConfirm]);

    const handleSelectProduct = (type: ProductType) => {
        setSelectedProduct(type);
        setStep('produce');
    };

    const renderUpgradeModal = () => {
        if (!showUpgradeConfirm) return null;

        const currentOffice = OFFICE_CONFIGS[gameState.officeLevel];
        const nextLevel = (gameState.officeLevel + 1) as any;
        const nextOffice = OFFICE_CONFIGS[nextLevel];

        if (!nextOffice) return null;

        const getOfficeName = (level: number) => {
            const keys = [
                'office_garage_name',
                'office_basement_name',
                'office_startup_name',
                'office_corporate_name',
                'office_campus_name',
                'office_hq_name'
            ];
            return t[keys[level] as keyof typeof t] || OFFICE_CONFIGS[level as any].name;
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
                                <div className="text-[10px] text-slate-400">Cap: {currentOffice.siliconCap}</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-emerald-500 uppercase text-center">{t.nextLevel}</div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-bl-lg"></div>
                                <div className="font-bold text-emerald-400 mb-1">{getOfficeName(gameState.officeLevel + 1)}</div>
                                <div className="text-[10px] text-emerald-300/70">Cap: {nextOffice.siliconCap}</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                            <span className="text-slate-400">{t.rent}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-300">${currentOffice.rent}</span>
                                <span className="text-slate-600">→</span>
                                <span className="text-white font-bold">${nextOffice.rent}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                            <span className="text-slate-400">{t.maxResearchers}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-300">{currentOffice.maxResearchers}</span>
                                <span className="text-slate-600">→</span>
                                <span className="text-white font-bold">{nextOffice.maxResearchers}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm pb-2">
                            <span className="text-slate-400">{t.upgradeCost}</span>
                            <span className="text-emerald-400 font-bold font-mono">${currentOffice.upgradeCost.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setShowUpgradeConfirm(false)}
                            className="py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors"
                        >
                            {t.cancel}
                        </button>
                        <button
                            onClick={() => {
                                if (gameState.money < currentOffice.upgradeCost) {
                                    setUpgradeError(t.insufficientFunds);
                                    onUpgradeOffice(); // Trigger error sfx
                                    return;
                                }
                                onUpgradeOffice();
                                setShowUpgradeConfirm(false);
                            }}
                            className="py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        >
                            {t.confirm}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSelectionStep = () => {
        const office = OFFICE_CONFIGS[gameState.officeLevel];
        const hasNextLevel = OFFICE_CONFIGS[(gameState.officeLevel + 1) as any] !== undefined;
        const bonuses = getReputationBonuses(gameState.reputation);
        const siliconPrice = gameState.siliconPrice * bonuses.siliconDiscount;

        return (
            <div className="space-y-6 h-full content-center p-4">
                {/* Active Trend Banner - Moved from MarketTab */}
                {(() => {
                    const activeTrend = MARKET_TRENDS.find(tr => tr.id === gameState.activeTrendId);
                    if (activeTrend && activeTrend.id !== 'trend_neutral') {
                        return (
                            <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-4 rounded-2xl border border-indigo-500/30 shadow-lg mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
                                        <TrendingUp size={24} className="text-indigo-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-tight mb-1">
                                            {activeTrend.name}
                                        </h3>
                                        <p className="text-sm text-indigo-200 leading-snug">
                                            {activeTrend.description}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                +{Math.round((activeTrend.priceBonus - 1) * 100)}% {t.price}
                                            </span>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                {activeTrend.requiredSpec === 'performance' ? t.performance : t.efficiency} &gt; {activeTrend.minSpecValue}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => { setSelectedProduct(ProductType.CPU); setStep('produce'); }}
                        className="group relative bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-blue-500/20 text-left flex flex-col items-center justify-center gap-4 aspect-square"
                    >
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowLeft className="rotate-180 text-blue-500" size={20} />
                        </div>
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Cpu size={32} className="text-blue-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black text-white leading-tight">{t.produceCpu}</h3>
                            <p className="text-slate-400 text-[10px] mt-2">{t.balancedMarket}</p>
                        </div>
                    </button>

                    <button
                        onClick={() => { setSelectedProduct(ProductType.GPU); setStep('produce'); }}
                        className="group relative bg-slate-900 border border-slate-800 hover:border-purple-500 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-purple-500/20 text-left flex flex-col items-center justify-center gap-4 aspect-square"
                    >
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowLeft className="rotate-180 text-purple-500" size={20} />
                        </div>
                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap size={32} className="text-purple-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black text-white leading-tight">{t.produceGpu}</h3>
                            <p className="text-slate-400 text-[10px] mt-2">{t.highVolatility}</p>
                        </div>
                    </button>
                </div>

                {/* Infrastructure Section */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Building size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{t.infrastructure}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Silicon Supply */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-center mb-3">
                                <div className="text-[10px] text-slate-500 font-bold uppercase">{t.siliconSupply}</div>
                                <div className="flex items-end gap-1">
                                    <div className="text-lg font-mono text-blue-400">{gameState.silicon}</div>
                                    <div className="text-xs text-slate-600">/ {office.siliconCap}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {(() => {
                                    const remaining = office.siliconCap - gameState.silicon;
                                    const amounts = [
                                        { label: '25%', val: Math.floor(remaining * 0.25) },
                                        { label: '50%', val: Math.floor(remaining * 0.50) },
                                        { label: 'MAX', val: remaining }
                                    ];
                                    return amounts.map((opt, i) => {
                                        const cost = opt.val * siliconPrice;
                                        const canAfford = gameState.money >= cost;
                                        const isValid = opt.val > 0;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => onBuySilicon(opt.val)}
                                                disabled={!canAfford || !isValid}
                                                className="py-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-blue-300 transition-colors disabled:opacity-50 flex flex-col items-center justify-center"
                                            >
                                                <span>{opt.label}</span>
                                                <span className="text-[9px] opacity-60 font-mono mt-0.5">
                                                    {isValid ? `$${cost.toLocaleString()}` : '-'}
                                                </span>
                                            </button>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Office Upgrade */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t.officeLevel}</div>
                                <div className="text-sm font-bold text-white">{t[`office_${['garage', 'basement', 'startup', 'corporate', 'campus', 'hq'][gameState.officeLevel]}_name` as keyof typeof t] || office.name}</div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                {hasNextLevel ? (
                                    <button
                                        onClick={() => setShowUpgradeConfirm(true)}
                                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded text-purple-300 transition-colors"
                                    >
                                        {t.upgrade}
                                    </button>
                                ) : (
                                    <div className="px-6 py-2 text-center text-[10px] font-bold text-slate-600 bg-slate-900 rounded border border-slate-800">
                                        {t.maxed}
                                    </div>
                                )}
                                {gameState.officeLevel > 0 && (
                                    <button
                                        onClick={onDowngradeOffice}
                                        className="text-[10px] font-bold text-red-400/60 hover:text-red-400 transition-colors underline decoration-red-400/30 hover:decoration-red-400"
                                    >
                                        {t.downgrade}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderProductionStep = () => {
        const spec = gameState.designSpecs[selectedProduct];
        const techTree = selectedProduct === ProductType.CPU ? CPU_TECH_TREE : GPU_TECH_TREE;
        const tech = techTree[gameState.techLevels[selectedProduct]];

        // Fix: Correctly find active trend using ID
        const activeTrend = MARKET_TRENDS.find(tr => tr.id === gameState.activeTrendId);

        // Fix: Correct trend applicability check
        const isTrendApplicable = activeTrend?.affectedProducts.includes(selectedProduct);
        const meetsTrend = isTrendApplicable && activeTrend && spec[activeTrend.requiredSpec] >= activeTrend.minSpecValue;

        const siliconPerUnit = tech.productionCost / 10;
        const totalSiliconNeeded = Math.ceil(siliconPerUnit * productionAmount);
        const totalCost = tech.productionCost * productionAmount;
        const canProduce = gameState.money >= totalCost && gameState.silicon >= totalSiliconNeeded;

        // Yield Calculation
        const yieldRate = tech.yield || 100;
        const qualityMod = gameState.productionQuality === 'high' ? 5 : gameState.productionQuality === 'medium' ? 0 : -5;
        const actualYield = Math.min(100, Math.max(10, yieldRate + qualityMod));
        const defectRate = 100 - actualYield;

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
                            {tech.name}
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

                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t.siliconNeeded}</div>
                            <div className={`font-mono font-bold text-sm ${canProduce ? 'text-orange-400' : 'text-red-500'}`}>
                                {totalSiliconNeeded} kg
                            </div>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t.totalCost}</div>
                            <div className="font-mono font-bold text-sm text-emerald-400">${totalCost.toFixed(0)}</div>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t.defectRate}</div>
                            <div className={`font-mono font-bold text-sm ${defectRate > 15 ? 'text-red-400' : 'text-emerald-400'}`}>
                                %{defectRate}
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
            {step === 'select' ? renderSelectionStep() : renderProductionStep()}
            {renderUpgradeModal()}
        </div>
    );
};

export const FactoryTab = React.memo(FactoryTabComponent);