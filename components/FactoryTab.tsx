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
    onSetStrategy: (strategy: 'low' | 'medium' | 'high') => void;
    onUpdateDesignSpec: (type: ProductType, spec: DesignSpec) => void;
}

const FactoryTabComponent: React.FC<FactoryTabProps> = ({
    gameState,
    language,
    onProduce,
    onBuySilicon,
    onUpgradeOffice,
    onSetStrategy,
    onUpdateDesignSpec
}) => {
    const t = TRANSLATIONS[language];
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
                            <div className="text-xs font-bold text-slate-500 uppercase text-center">Current</div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                <div className="font-bold text-white mb-1">{currentOffice.name}</div>
                                <div className="text-[10px] text-slate-400">Cap: {currentOffice.siliconCap}</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-emerald-500 uppercase text-center">Next Level</div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-bl-lg"></div>
                                <div className="font-bold text-emerald-400 mb-1">{nextOffice.name}</div>
                                <div className="text-[10px] text-emerald-300/70">Cap: {nextOffice.siliconCap}</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                            <span className="text-slate-400">Rent</span>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-300">${currentOffice.rent}</span>
                                <span className="text-slate-600">→</span>
                                <span className="text-white font-bold">${nextOffice.rent}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                            <span className="text-slate-400">Max Researchers</span>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-300">{currentOffice.maxResearchers}</span>
                                <span className="text-slate-600">→</span>
                                <span className="text-white font-bold">{nextOffice.maxResearchers}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm pb-2">
                            <span className="text-slate-400">Upgrade Cost</span>
                            <span className="text-emerald-400 font-bold font-mono">${currentOffice.upgradeCost.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setShowUpgradeConfirm(false)}
                            className="py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors"
                        >
                            Cancel
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
                            Confirm
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
                            <h3 className="text-xl font-black text-white leading-tight">Produce CPU</h3>
                            <p className="text-slate-400 text-[10px] mt-2">Balanced Market</p>
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
                            <h3 className="text-xl font-black text-white leading-tight">Produce GPU</h3>
                            <p className="text-slate-400 text-[10px] mt-2">High Volatility</p>
                        </div>
                    </button>
                </div>

                {/* Infrastructure Section */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Building size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Infrastructure</span>
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
                            <div className="grid grid-cols-5 gap-1">
                                <button
                                    onClick={() => onBuySilicon(1)}
                                    disabled={gameState.money < siliconPrice * 1}
                                    className="py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded text-blue-300 transition-colors disabled:opacity-50"
                                >
                                    +1
                                </button>
                                <button
                                    onClick={() => onBuySilicon(10)}
                                    disabled={gameState.money < siliconPrice * 10}
                                    className="py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded text-blue-300 transition-colors disabled:opacity-50"
                                >
                                    +10
                                </button>
                                <button
                                    onClick={() => onBuySilicon(100)}
                                    disabled={gameState.money < siliconPrice * 100}
                                    className="py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded text-blue-300 transition-colors disabled:opacity-50"
                                >
                                    +100
                                </button>
                                <button
                                    onClick={() => onBuySilicon(1000)}
                                    disabled={gameState.money < siliconPrice * 1000}
                                    className="py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded text-blue-300 transition-colors disabled:opacity-50"
                                >
                                    +1k
                                </button>
                                <button
                                    onClick={() => onBuySilicon(10000)}
                                    disabled={gameState.money < siliconPrice * 10000}
                                    className="py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded text-blue-300 transition-colors disabled:opacity-50"
                                >
                                    +10k
                                </button>
                            </div>
                        </div>

                        {/* Office Upgrade */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t.officeLevel}</div>
                                <div className="text-sm font-bold text-white">{office.name}</div>
                            </div>

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
                            {meetsTrend ? 'Trend Matched' : 'Trend Missed'}
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
                            min="1" max="100"
                            value={productionAmount}
                            onChange={(e) => setProductionAmount(parseInt(e.target.value))}
                            className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
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