import React, { useState } from 'react';
import { GameState, ProductType, DesignSpec } from '../types';
import { TRANSLATIONS, CPU_TECH_TREE, GPU_TECH_TREE, OFFICE_CONFIGS, MARKET_TRENDS } from '../constants';
import { Cpu, Zap, Settings, TrendingUp, Package } from 'lucide-react';

interface FactoryTabProps {
    gameState: GameState;
    language: 'en' | 'tr';
    onProduce: (type: ProductType, amount: number, cost: number) => void;
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
    const [selectedProduct, setSelectedProduct] = useState<ProductType>(ProductType.CPU);
    const [productionAmount, setProductionAmount] = useState(10);

    const getProductIcon = (type: ProductType) => {
        switch (type) {
            case ProductType.CPU: return <Cpu size={20} />;
            case ProductType.GPU: return <Zap size={20} />;
        }
    };

    const renderProductionSection = (type: ProductType, techTree: any[]) => {
        const techLevel = gameState.techLevels[type];
        const tech = techTree[techLevel];
        const spec = gameState.designSpecs[type];
        const count = gameState.inventory[type];

        const siliconPerUnit = tech.productionCost / 10;
        const totalSiliconNeeded = Math.ceil(siliconPerUnit * productionAmount);
        const totalCost = totalSiliconNeeded * gameState.siliconPrice;
        const canProduce = gameState.silicon >= totalSiliconNeeded;

        return (
            <div className="space-y-6">
                {/* Design Controls */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Settings className="text-indigo-400" />
                        <h3 className="text-xl font-bold text-white">{t.design}</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-slate-400 text-sm">{t.performance}</label>
                                <span className="text-white font-mono">{spec.performance}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={spec.performance}
                                onChange={(e) => {
                                    const newPerf = parseInt(e.target.value);
                                    const newEff = 100 - newPerf;
                                    onUpdateDesignSpec(selectedProduct, { performance: newPerf, efficiency: newEff });
                                }}
                                className="w-full accent-indigo-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-slate-400 text-sm">{t.efficiency}</label>
                                <span className="text-white font-mono">{spec.efficiency}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={spec.efficiency}
                                onChange={(e) => {
                                    const newEff = parseInt(e.target.value);
                                    const newPerf = 100 - newEff;
                                    onUpdateDesignSpec(selectedProduct, { performance: newPerf, efficiency: newEff });
                                }}
                                className="w-full accent-emerald-500"
                            />
                        </div>

                        <div className="text-xs text-slate-500 mt-2">
                            {t.performance} + {t.efficiency} = 100
                        </div>


                        {/* Market Trend Info */}
                        <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.marketTrend}</div>
                            {(() => {
                                const activeTrend = MARKET_TRENDS.find(tr => tr.id === gameState.activeTrendId);
                                if (!activeTrend) return null;

                                const isApplicable = activeTrend.affectedProducts.includes(selectedProduct);
                                const spec = gameState.designSpecs[selectedProduct];
                                const specValue = spec[activeTrend.requiredSpec];
                                const meetsRequirement = specValue >= activeTrend.minSpecValue;

                                return (
                                    <>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="text-sm font-bold text-white">{activeTrend.name}</div>
                                            {isApplicable && (
                                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${meetsRequirement ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {meetsRequirement ? '✓ BONUS' : '✗ PENALTY'}
                                                </span>
                                            )}
                                            {!isApplicable && (
                                                <span className="text-[8px] px-1.5 py-0.5 rounded font-bold bg-slate-700 text-slate-400">
                                                    N/A
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {isApplicable ? (
                                                `${activeTrend.requiredSpec === 'performance' ? t.performance : t.efficiency} ${activeTrend.minSpecValue}+ needed`
                                            ) : (
                                                `Affects ${activeTrend.affectedProducts.join(', ')} only`
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Production Section */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Package className="text-emerald-400" />
                        <h3 className="text-xl font-bold text-white">{t.manufacturing}</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-xl">
                            <div className="text-sm text-slate-400 mb-1">{t.inStock}</div>
                            <div className="text-3xl font-mono font-bold text-white">{count}</div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-slate-400 text-sm">{t.productionAmount}</label>
                                <span className="text-white font-mono">{productionAmount} {t.units}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={productionAmount}
                                onChange={(e) => setProductionAmount(parseInt(e.target.value))}
                                className="w-full accent-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                                <div className="text-slate-500 mb-1">{t.siliconNeeded}</div>
                                <div className="text-orange-400 font-mono">{totalSiliconNeeded} kg</div>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                                <div className="text-slate-500 mb-1">{t.totalCost}</div>
                                <div className="text-emerald-400 font-mono">${totalCost.toFixed(0)}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => onProduce(type, productionAmount, totalCost)}
                            disabled={!canProduce}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${canProduce
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {canProduce ? t.produce : t.noSilicon}
                        </button>
                    </div>
                </div>

                {/* Silicon Supply */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">{t.siliconSupply}</h3>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-400">{t.available}</span>
                        <span className="text-orange-400 font-mono text-xl">{Math.floor(gameState.silicon)} kg</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => onBuySilicon(100)} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-white transition-colors">
                            +100 (${(gameState.siliconPrice * 100).toFixed(0)})
                        </button>
                        <button onClick={() => onBuySilicon(1000)} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-white transition-colors">
                            +1k (${(gameState.siliconPrice * 1000).toFixed(0)})
                        </button>
                        <button onClick={() => onBuySilicon(10000)} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-white transition-colors">
                            +10k (${(gameState.siliconPrice * 10000).toFixed(0)})
                        </button>
                    </div>
                </div>

                {/* Office Upgrade */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">{t.officeLevel}</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-400">{t.current}</span>
                            <span className="text-white font-bold">{OFFICE_CONFIGS[gameState.officeLevel].name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">{t.siliconCap}</span>
                            <span className="text-orange-400 font-mono">{OFFICE_CONFIGS[gameState.officeLevel].siliconCap} kg</span>
                        </div>
                        {gameState.officeLevel < 5 && (
                            <button
                                onClick={onUpgradeOffice}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all active:scale-95"
                            >
                                {t.upgrade} ${OFFICE_CONFIGS[gameState.officeLevel].upgradeCost.toLocaleString()}
                            </button>
                        )}
                        {gameState.officeLevel === 5 && (
                            <div className="text-center text-yellow-400 font-bold py-3">{t.maxed}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Product Type Selector */}
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedProduct(ProductType.CPU)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${selectedProduct === ProductType.CPU
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    <Cpu size={20} />
                    CPU
                </button>
                <button
                    onClick={() => setSelectedProduct(ProductType.GPU)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${selectedProduct === ProductType.GPU
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    <Zap size={20} />
                    GPU
                </button>
            </div>

            {/* Production Content */}
            {selectedProduct === ProductType.CPU && renderProductionSection(ProductType.CPU, CPU_TECH_TREE)}
            {selectedProduct === ProductType.GPU && renderProductionSection(ProductType.GPU, GPU_TECH_TREE)}
        </div>
    );
};

export const FactoryTab = React.memo(FactoryTabComponent);