import { useCallback } from 'react';
import { GameState, ProductType, TabType, OfficeLevel, DesignSpec, Loan } from '../types';
import {
    TRANSLATIONS,
    OFFICE_CONFIGS,
    HEROES,
    INITIAL_MONEY,
    INITIAL_RP,
    INITIAL_SILICON,
    INITIAL_REPUTATION,
    BASE_SILICON_PRICE,
    ERAS,
    MARKET_TRENDS,
    INITIAL_STOCKS,
    MAX_ACTIVE_LOANS,
    MARKETING_CAMPAIGNS,
    INITIAL_GAME_STATE,
    CPU_TECH_TREE,
    GPU_TECH_TREE
} from '../constants';
import { getReputationBonuses } from '../utils/gameUtils';
import { calculateFinalRevenue, getEraTier } from '../utils/economySystem';

export const useGameActions = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    setActiveTab: (tab: TabType) => void,
    playSfx: (sfx: any) => void,
    vibrate: (type: any) => void,
    onShowFloatingText?: (text: string, type: 'income' | 'expense' | 'rp' | 'reputation' | 'neutral', x?: number, y?: number) => void
) => {

    const handleTabSwitch = useCallback((tab: TabType) => {
        playSfx('click');
        vibrate('light');
        setActiveTab(tab);
    }, [setActiveTab, playSfx, vibrate]);

    const handleProduce = useCallback((type: ProductType, amount: number, cost: number, siliconCost: number) => {
        setGameState(prev => {
            if (prev.silicon < siliconCost) {
                playSfx('error');
                vibrate('error');
                return prev;
            }
            if (prev.money < cost) {
                playSfx('error');
                vibrate('error');
                return prev;
            }
            playSfx('click');
            vibrate('light');
            if (onShowFloatingText) onShowFloatingText(`-$${cost}`, 'expense');

            // Yield Rate Logic
            const techTree = type === ProductType.CPU ? CPU_TECH_TREE : GPU_TECH_TREE;
            const currentLevel = prev.techLevels[type];
            const node = techTree.find(n => n.tier === currentLevel) || techTree[0];
            const yieldRate = node.yield || 100;

            // Calculate success vs waste
            // Random fluctuation: +/- 5% based on production quality
            const qualityMod = prev.productionQuality === 'high' ? 5 : prev.productionQuality === 'medium' ? 0 : -5;
            const actualYield = Math.min(100, Math.max(10, yieldRate + qualityMod));

            const successfulAmount = Math.floor(amount * (actualYield / 100));
            const wasteAmount = amount - successfulAmount;

            // Binning: Sell waste as "Budget/Scrap" immediately
            // Value is 20% of base price
            const scrapValue = Math.floor(wasteAmount * (node.baseMarketPrice * 0.2));
            if (scrapValue > 0 && onShowFloatingText) onShowFloatingText(`+$${scrapValue}`, 'income');

            let remainingAmount = successfulAmount;
            const newContracts = prev.activeContracts.map(c => {
                if (c.requiredProduct === type && remainingAmount > 0 && c.fulfilledAmount < c.requiredAmount) {
                    // Check requirements
                    const spec = prev.designSpecs[type];
                    if (c.minPerformance && spec.performance < c.minPerformance) return c;
                    if (c.minEfficiency && spec.efficiency < c.minEfficiency) return c;

                    const take = Math.min(remainingAmount, c.requiredAmount - c.fulfilledAmount);
                    remainingAmount -= take;
                    return { ...c, fulfilledAmount: c.fulfilledAmount + take };
                }
                return c;
            });

            const bonuses = getReputationBonuses(prev.reputation);
            let moneyChange = -cost + scrapValue; // Add scrap revenue
            const completedContractIds: string[] = [];
            let repGainFromContracts = 0;
            newContracts.forEach(c => {
                if (c.fulfilledAmount >= c.requiredAmount) {
                    const payment = c.completionPayment || Math.floor(c.reward * 0.6); // Fallback if old contract
                    moneyChange += payment * bonuses.contractBonus;
                    completedContractIds.push(c.id);
                    repGainFromContracts += 5;
                    playSfx('success');
                    vibrate('success');
                    if (onShowFloatingText) {
                        onShowFloatingText(`+$${Math.floor(payment * bonuses.contractBonus)}`, 'income');
                        onShowFloatingText(`+5 REP`, 'reputation');
                    }
                }
            });

            let newLogs = [...prev.logs];
            if (wasteAmount > 0) {
                const t = TRANSLATIONS[prev.language];
                newLogs.push({
                    id: Date.now(),
                    message: t.logYield.replace('{0}', actualYield.toString()).replace('{1}', wasteAmount.toString()).replace('{2}', scrapValue.toString()),
                    type: 'warning' as const,
                    timestamp: `${t.day} ${prev.day}`
                });
            }
            if (completedContractIds.length > 0) newLogs.push({ id: Date.now() + 1, message: TRANSLATIONS[prev.language].logContractFulfilled, type: 'success' as const, timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}` });

            return {
                ...prev,
                money: prev.money + moneyChange,
                silicon: prev.silicon - siliconCost,
                inventory: { ...prev.inventory, [type]: prev.inventory[type] + remainingAmount },
                activeContracts: newContracts.filter(c => !completedContractIds.includes(c.id)),
                reputation: Math.min(100, Math.max(0, prev.reputation + repGainFromContracts)),
                logs: newLogs.slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleUpdateDesignSpec = useCallback((type: ProductType, spec: DesignSpec) => {
        setGameState(prev => ({
            ...prev,
            designSpecs: {
                ...prev.designSpecs,
                [type]: spec
            }
        }));
    }, [setGameState]);

    const handleSell = useCallback((type: ProductType, currentPrice: number) => {
        setGameState(prev => {
            const count = prev.inventory[type];
            if (count <= 0) {
                playSfx('error');
                return prev;
            }

            // Get current tech tier and market era
            const techTree = type === ProductType.CPU ? CPU_TECH_TREE : GPU_TECH_TREE;
            const currentTech = techTree[prev.techLevels[type]];
            const productTier = currentTech.tier;
            const marketEra = getEraTier(prev.currentEraId);

            // Calculate final revenue with ALL penalties
            const { revenue, breakdown, warnings } = calculateFinalRevenue({
                basePrice: currentPrice,
                amount: count,
                productTier,
                productType: type,
                marketEra,
                marketSaturation: prev.marketSaturation?.[type] ?? 0
            });

            // Update market saturation (increases from this sale)
            const saturationIncrease = count / 1000; // Each 1000 units adds 1.0 saturation
            const newSaturation = {
                ...prev.marketSaturation,
                [type]: Math.min(1, (prev.marketSaturation?.[type] ?? 0) + saturationIncrease)
            };

            playSfx(revenue > 0 ? 'money' : 'error');
            vibrate('medium');

            const bonuses = getReputationBonuses(prev.reputation);
            const finalRevenue = Math.floor(revenue * bonuses.priceBonus);

            if (onShowFloatingText && finalRevenue > 0) {
                onShowFloatingText(`+$${finalRevenue}`, 'income');
            }

            // Rep gain (only if selling current-gen tech)
            let repGain = 0;
            if (count > 10 && productTier >= marketEra - 1 && Math.random() < 0.1) {
                repGain = 1;
            }

            // Create log message with warnings
            let logMessage = TRANSLATIONS[prev.language].logSold
                .replace('{0}', count.toString())
                .replace('{1}', type);

            if (warnings.length > 0) {
                logMessage += ` ${warnings[0]}`; // Show first warning in log
            }

            // Show detailed breakdown in console (for debugging/playtesting)
            console.group(`💰 Sale: ${count}x ${type}`);
            console.log('Base Revenue:', `$${breakdown.baseRevenue.toFixed(0)}`);
            console.log('After Decay:', `$${breakdown.afterDecay.toFixed(0)} (${((breakdown.afterDecay / breakdown.baseRevenue) * 100).toFixed(0)}%)`);
            console.log('After Crash:', `$${breakdown.afterCrash.toFixed(0)} (${((breakdown.afterCrash / breakdown.baseRevenue) * 100).toFixed(0)}%)`);
            console.log('After Saturation:', `$${breakdown.afterSaturation.toFixed(0)} (${((breakdown.afterSaturation / breakdown.baseRevenue) * 100).toFixed(0)}%)`);
            console.log('Final with Rep Bonus:', `$${finalRevenue.toFixed(0)}`);
            if (warnings.length > 0) {
                console.warn('Warnings:', warnings);
            }
            console.groupEnd();

            // Update daily demand (reduce by amount sold)
            const newDailyDemand = {
                ...prev.dailyDemand,
                [type]: Math.max(0, (prev.dailyDemand?.[type] ?? 100) - count)
            };

            // Add warning if demand was exceeded (already applied in economy system)
            const demandRemaining = prev.dailyDemand?.[type] ?? 100;
            if (count > demandRemaining && demandRemaining > 0) {
                logMessage += ` ⚠️ DEMAND EXCEEDED! Severe penalty applied.`;
            }

            return {
                ...prev,
                money: prev.money + finalRevenue,
                inventory: { ...prev.inventory, [type]: 0 },
                reputation: Math.min(100, prev.reputation + repGain),
                marketSaturation: newSaturation,
                dailyDemand: newDailyDemand,
                logs: [...prev.logs, {
                    id: Date.now(),
                    message: logMessage,
                    type: warnings.length > 0 ? 'warning' as const : 'success' as const,
                    timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}`
                }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleBuySilicon = useCallback((amount: number) => {
        setGameState(prev => {
            const bonuses = getReputationBonuses(prev.reputation);
            const discountedPrice = prev.siliconPrice * bonuses.siliconDiscount;
            const cost = amount * discountedPrice;
            const office = OFFICE_CONFIGS[prev.officeLevel];
            if (prev.money < cost) {
                playSfx('error');
                vibrate('error');
                return prev;
            }
            if (prev.silicon + amount > office.siliconCap) {
                playSfx('error');
                return { ...prev, logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].logWarehouseFull, type: 'warning' as const, timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}` }].slice(-10) };
            }
            playSfx('click');
            vibrate('light');
            if (onShowFloatingText) onShowFloatingText(`-$${cost.toFixed(0)}`, 'expense');
            return { ...prev, money: prev.money - cost, silicon: prev.silicon + amount };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleUpgradeOffice = useCallback(() => {
        setGameState(prev => {
            const nextLevel = (prev.officeLevel + 1) as OfficeLevel;
            const config = OFFICE_CONFIGS[prev.officeLevel];
            if (prev.money >= config.upgradeCost) {
                playSfx('success');
                vibrate('success');
                if (onShowFloatingText) onShowFloatingText(`-$${config.upgradeCost}`, 'expense');
                return {
                    ...prev,
                    money: prev.money - config.upgradeCost,
                    officeLevel: nextLevel,
                    logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].logHQUpgraded.replace('{0}', OFFICE_CONFIGS[nextLevel].name), type: 'success' as const, timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}` }].slice(-10)
                };
            }
            playSfx('error');
            vibrate('error');
            return {
                ...prev,
                logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].insufficientFunds, type: 'danger' as const, timestamp: `Day ${prev.day}` }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleDowngradeOffice = useCallback(() => {
        setGameState(prev => {
            if (prev.officeLevel <= 0) return prev;
            const prevLevel = (prev.officeLevel - 1) as OfficeLevel;
            const moveCost = 5000; // Moving cost

            if (prev.money < moveCost) {
                playSfx('error');
                return {
                    ...prev,
                    logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].insufficientFunds, type: 'danger' as const, timestamp: `Day ${prev.day}` }].slice(-10)
                };
            }

            playSfx('click');
            vibrate('medium');
            if (onShowFloatingText) onShowFloatingText(`-$${moveCost}`, 'expense');

            return {
                ...prev,
                money: prev.money - moveCost,
                officeLevel: prevLevel,
                logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].logHQDowngraded.replace('{0}', OFFICE_CONFIGS[prevLevel].name), type: 'info' as const, timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}` }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleAcceptContract = useCallback((contractId: string) => {
        playSfx('click');
        setGameState(prev => {
            const contract = prev.availableContracts.find(c => c.id === contractId);
            if (!contract) return prev;

            // Upfront payment logic
            const upfront = contract.upfrontPayment || 0;
            if (upfront > 0) {
                playSfx('money');
                if (onShowFloatingText) onShowFloatingText(`+$${upfront}`, 'income');
            }

            const activeContract = { ...contract, deadlineDay: prev.day + contract.duration };
            return {
                ...prev,
                money: prev.money + upfront,
                activeContracts: [...prev.activeContracts, activeContract],
                availableContracts: prev.availableContracts.filter(c => c.id !== contractId)
            };
        });
    }, [setGameState, playSfx, onShowFloatingText]);

    const handleEventDismiss = useCallback(() => {
        playSfx('click');
        setGameState(prev => {
            if (prev.activeEvent?.effect) {
                const changes = prev.activeEvent.effect(prev);

                // Calculate differences for floating text
                if (onShowFloatingText) {
                    if (changes.money !== undefined) {
                        const diff = changes.money - prev.money;
                        if (diff !== 0) onShowFloatingText(diff > 0 ? `+$${diff}` : `-$${Math.abs(diff)}`, diff > 0 ? 'income' : 'expense');
                    }
                    if (changes.rp !== undefined) {
                        const diff = changes.rp - prev.rp;
                        if (diff !== 0) onShowFloatingText(diff > 0 ? `+${diff} RP` : `${diff} RP`, 'rp');
                    }
                    if (changes.reputation !== undefined) {
                        const diff = changes.reputation - prev.reputation;
                        if (diff !== 0) onShowFloatingText(diff > 0 ? `+${diff} REP` : `${diff} REP`, 'reputation');
                    }
                    if (changes.siliconPrice !== undefined) {
                        // Price change isn't a direct player gain/loss, maybe skip or show neutral?
                        // Let's skip for now as it's a market condition, not a transaction.
                    }
                }

                return { ...prev, ...changes, activeEvent: null };
            }
            return { ...prev, activeEvent: null };
        });
    }, [setGameState, playSfx, onShowFloatingText]);

    const handleResearch = useCallback((type: ProductType, nextLevelIndex: number, cost: number) => {
        setGameState(prev => {
            if (prev.rp < cost) {
                playSfx('error');
                vibrate('error');
                return prev;
            }
            playSfx('success');
            vibrate('medium');
            if (onShowFloatingText) onShowFloatingText(`-${cost} RP`, 'rp');
            let prestigeGain = 0;
            if (nextLevelIndex > prev.globalTechLevels[type]) prestigeGain = 10;
            const t = TRANSLATIONS[prev.language];
            const msg = prestigeGain > 0 ? t.logTechBreakthrough.replace('{0}', prestigeGain.toString()) : t.logTechUnlocked;

            return {
                ...prev,
                rp: prev.rp - cost,
                prestigePoints: prev.prestigePoints + prestigeGain,
                techLevels: { ...prev.techLevels, [type]: nextLevelIndex },
                logs: [...prev.logs, { id: Date.now(), message: msg, type: 'success' as const, timestamp: `Day ${prev.day}` }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleHireResearcher = useCallback((cost: number) => {
        setGameState(prev => {
            const office = OFFICE_CONFIGS[prev.officeLevel];
            if (prev.researchers >= office.maxResearchers || prev.money < cost) {
                playSfx('error');
                return prev;
            }
            playSfx('click');
            vibrate('light');
            if (onShowFloatingText) onShowFloatingText(`-$${cost}`, 'expense');
            return { ...prev, money: prev.money - cost, researchers: prev.researchers + 1 };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleHireHero = useCallback((heroId: string) => {
        setGameState(prev => {
            const hero = HEROES.find(h => h.id === heroId);
            if (!hero || prev.money < hero.hiringCost) return prev;
            playSfx('success');
            vibrate('success');
            if (onShowFloatingText) onShowFloatingText(`-$${hero.hiringCost}`, 'expense');
            return {
                ...prev,
                money: prev.money - hero.hiringCost,
                hiredHeroes: [...prev.hiredHeroes, heroId],
                logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].logHeadhunted.replace('{0}', hero.name), type: 'success' as const, timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}` }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleFireResearcher = useCallback(() => {
        setGameState(prev => {
            if (prev.researchers <= 0) return prev;
            const severancePay = 500;
            const newMorale = Math.max(0, prev.staffMorale - 5);
            playSfx('error');
            vibrate('medium');
            if (onShowFloatingText) onShowFloatingText(`-$${severancePay}`, 'expense');
            return {
                ...prev,
                money: prev.money - severancePay,
                researchers: prev.researchers - 1,
                staffMorale: newMorale,
                logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].firedAlert, type: 'warning' as const, timestamp: `Day ${prev.day}` }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleSetWorkPolicy = useCallback((policy: 'relaxed' | 'normal' | 'crunch') => {
        playSfx('click');
        setGameState(prev => ({ ...prev, workPolicy: policy }));
    }, [setGameState, playSfx]);

    const handleBuyStock = useCallback((stockId: string, amount: number) => {
        setGameState(prev => {
            const stock = prev.stocks.find(s => s.id === stockId);
            if (!stock) return prev;
            const cost = stock.currentPrice * amount;
            if (prev.money < cost) {
                playSfx('error');
                return prev;
            }

            // Calculate weighted average buy price
            const currentTotalCost = stock.owned * (stock.avgBuyPrice || 0);
            const newTotalCost = currentTotalCost + cost;
            const newOwned = stock.owned + amount;
            const newAvgPrice = newTotalCost / newOwned;

            playSfx('money');
            vibrate('light');
            if (onShowFloatingText) onShowFloatingText(`-$${cost.toFixed(0)}`, 'expense');
            return {
                ...prev,
                money: prev.money - cost,
                stocks: prev.stocks.map(s => s.id === stockId ? { ...s, owned: newOwned, avgBuyPrice: newAvgPrice } : s)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleSellStock = useCallback((id: string, amt: number) => {
        setGameState(prev => {
            const stock = prev.stocks.find(s => s.id === id);
            if (!stock || stock.owned < amt) {
                playSfx('error');
                return prev;
            }
            playSfx('money');
            const income = stock.currentPrice * amt;
            if (onShowFloatingText) onShowFloatingText(`+$${income.toFixed(0)}`, 'income');
            return {
                ...prev,
                money: prev.money + income,
                stocks: prev.stocks.map(s => s.id === id ? { ...s, owned: s.owned - amt } : s)
            };
        });
    }, [setGameState, playSfx, onShowFloatingText]);

    const handleIPO = useCallback(() => {
        setGameState(prev => {
            // Dynamic Valuation Logic
            const techValue = (prev.techLevels[ProductType.CPU] * 50000) + (prev.techLevels[ProductType.GPU] * 50000);
            const rpValue = prev.rp * 10;
            const repValue = prev.reputation * 2000;
            const valuation = prev.money + techValue + rpValue + repValue;

            // Sell 40% of the company
            const sharesSoldPercentage = 40;
            const cashRaised = Math.floor(valuation * (sharesSoldPercentage / 100));
            const initialSharePrice = valuation / 10000; // Assume 10,000 total shares

            playSfx('success');
            vibrate('heavy');
            if (onShowFloatingText) onShowFloatingText(`+$${(cashRaised / 1000000).toFixed(2)}M`, 'income');

            return {
                ...prev,
                money: prev.money + cashRaised,
                isPubliclyTraded: true,
                playerCompanySharesOwned: 100 - sharesSoldPercentage,
                playerSharePrice: initialSharePrice,
                logs: [...prev.logs, {
                    id: Date.now(),
                    message: `IPO SUCCESS! Raised $${(cashRaised / 1000000).toFixed(2)}M at $${initialSharePrice.toFixed(2)}/share.`,
                    type: 'success' as const,
                    timestamp: `Day ${prev.day}`
                }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleCovertOpTrigger = useCallback((type: 'espionage' | 'sabotage', targetId: string) => {
        setGameState(prev => {
            // Find competitor by id
            const competitor = prev.competitors.find(c => c.id === targetId);
            if (!competitor) {
                playSfx('error');
                return prev;
            }

            // Use competitor's money/valuation for cost calculation
            const targetValue = competitor.money || 10000;

            // Dynamic Cost: Scales with target's valuation
            // Espionage: Costs about 10% of target's valuation (min 5k)
            // Sabotage: Costs about 25% of target's valuation (min 15k)
            const espionageCost = Math.max(5000, Math.floor(targetValue * 0.10));
            const sabotageCost = Math.max(15000, Math.floor(targetValue * 0.25));
            const cost = type === 'espionage' ? espionageCost : sabotageCost;

            if (prev.money < cost) {
                playSfx('error');
                return { ...prev, logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].logInsufficientFunds, type: 'danger' as const, timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}` }].slice(-10) };
            }
            playSfx('click');
            if (onShowFloatingText) onShowFloatingText(`-$${cost.toLocaleString()}`, 'expense');
            return {
                ...prev,
                hacking: { active: true, type, difficulty: prev.reputation > 50 ? 1 : 2, targetId, cost }
            };
        });
    }, [setGameState, playSfx, onShowFloatingText]);

    const handleHackingComplete = useCallback((success: boolean) => {
        setGameState(prev => {
            const t = TRANSLATIONS[prev.language];
            const { type, targetId, cost } = prev.hacking;

            // Find competitor
            const competitor = prev.competitors.find(c => c.id === targetId);
            const targetValue = competitor?.money || 10000;
            const targetName = competitor?.name || "Rival";

            // Use stored cost from trigger
            const actualCost = cost || (type === 'espionage' ? 10000 : 25000);

            let newState = { ...prev, money: prev.money - actualCost, hacking: { ...prev.hacking, active: false } };

            const changes: { label: string, before: string, after: string, isPositive: boolean }[] = [];
            let rewardText = "";

            if (success) {
                playSfx('success');
                vibrate('success');

                // Dynamic RP Reward: Scales with target's value
                // Formula: 2-5% of target's valuation (min 100 RP, max 10k RP)
                const rpReward = type === 'espionage'
                    ? Math.min(10000, Math.max(100, Math.floor(targetValue * 0.03)))
                    : 0;

                if (type === 'espionage') {
                    newState.rp += rpReward;
                    changes.push({ label: "RP", before: `${prev.rp}`, after: `${prev.rp + rpReward}`, isPositive: true });
                    rewardText = `+${rpReward} RP`;

                    newState.logs = [...newState.logs, {
                        id: Date.now(),
                        message: t.logEspionageSuccess.replace('{0}', targetName),
                        type: 'success' as const,
                        timestamp: `${t.day} ${prev.day}`,
                        tag: 'espionage_success'
                    }].slice(-10);
                    if (onShowFloatingText) onShowFloatingText(`+${rpReward} RP`, 'rp');
                } else {
                    // Sabotage effect - Damage competitor
                    const targetComp = newState.competitors.find(c => c.id === targetId);
                    if (targetComp) {
                        const cashBefore = targetComp.money;
                        targetComp.money = Math.floor(targetComp.money * 0.8);
                        targetComp.cashReserves = Math.floor(targetComp.cashReserves * 0.8);
                        targetComp.productQuality[ProductType.CPU] = Math.floor(targetComp.productQuality[ProductType.CPU] * 0.9);
                        targetComp.productQuality[ProductType.GPU] = Math.floor(targetComp.productQuality[ProductType.GPU] * 0.9);

                        changes.push({
                            label: `${targetName} Valuation`,
                            before: `$${(cashBefore / 1000).toFixed(0)}k`,
                            after: `$${(targetComp.money / 1000).toFixed(0)}k`,
                            isPositive: true
                        });
                    }
                    newState.logs = [...newState.logs, {
                        id: Date.now(),
                        message: t.logSabotageSuccess.replace('{0}', targetName),
                        type: 'success' as const,
                        timestamp: `${t.day} ${prev.day}`,
                        tag: 'sabotage_success'
                    }].slice(-10);
                }

                newState.hackingResult = { success: true, targetName, type, changes, rewardText };
            } else {
                playSfx('error');
                vibrate('error');
                const repLoss = type === 'espionage' ? 10 : 25;
                changes.push({ label: "Reputation", before: `${prev.reputation}`, after: `${Math.max(0, prev.reputation - repLoss)}`, isPositive: false });

                newState.reputation = Math.max(0, newState.reputation - repLoss);
                newState.logs = [...newState.logs, {
                    id: Date.now(),
                    message: t.logOpFailed.replace('{0}', targetName),
                    type: 'danger' as const,
                    timestamp: `${t.day} ${prev.day}`
                }].slice(-10);
                if (onShowFloatingText) onShowFloatingText(type === 'espionage' ? '-10 REP' : '-25 REP', 'reputation');

                newState.hackingResult = { success: false, targetName, type, changes };
            }
            return newState;
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleRetire = useCallback(() => {
        playSfx('success');
        setGameState(prev => {
            const companyValuation = prev.money + (prev.techLevels[ProductType.CPU] * 5000) + (prev.techLevels[ProductType.GPU] * 5000);
            const gainedPoints = Math.floor(companyValuation / 10000);
            return {
                ...INITIAL_GAME_STATE,
                stage: 'game',
                money: INITIAL_GAME_STATE.money + (gainedPoints * 1000),
                prestigePoints: prev.prestigePoints + gainedPoints,
                logs: [{ id: Date.now(), message: `${TRANSLATIONS[prev.language].newRun} ${prev.prestigePoints + gainedPoints}`, type: 'info' as const, timestamp: `${TRANSLATIONS[prev.language].day} 1` }],
            };
        });
    }, [setGameState, playSfx]);

    const handleTakeLoan = useCallback((amount: number) => {
        setGameState(prev => {
            const t = TRANSLATIONS[prev.language];

            // Loan Limits based on Office Level
            let maxLoans = MAX_ACTIVE_LOANS;
            let maxLoanAmount = 10000000;

            if (prev.officeLevel === OfficeLevel.GARAGE) {
                maxLoans = 1;
                maxLoanAmount = 10000;
            } else if (prev.officeLevel === OfficeLevel.BASEMENT) {
                maxLoans = 1;
                maxLoanAmount = 100000;
            }

            if (prev.loans.length >= maxLoans) {
                playSfx('error');
                return { ...prev, logs: [...prev.logs, { id: Date.now(), message: t.loanRejectedLimit, type: 'danger' as const, timestamp: `${t.day} ${prev.day}` }].slice(-10) };
            }

            if (amount > maxLoanAmount) {
                playSfx('error');
                return { ...prev, logs: [...prev.logs, { id: Date.now(), message: t.loanRejectedOffice, type: 'danger' as const, timestamp: `${t.day} ${prev.day}` }].slice(-10) };
            }
            playSfx('money');
            vibrate('medium');
            if (onShowFloatingText) onShowFloatingText(`+$${amount}`, 'income');
            const interestRate = 0.015;
            const dailyPayment = Math.floor(amount * interestRate);
            const newLoan: Loan = { id: `loan_${Date.now()}`, amount, interestRate, dailyPayment };
            return { ...prev, money: prev.money + amount, loans: [...prev.loans, newLoan], logs: [...prev.logs, { id: Date.now(), message: t.loanApproved, type: 'warning' as const, timestamp: `${t.day} ${prev.day}` }].slice(-10) };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handlePayLoan = useCallback((loanId: string) => {
        setGameState(prev => {
            const t = TRANSLATIONS[prev.language];
            const loan = prev.loans.find(l => l.id === loanId);
            if (!loan || prev.money < loan.amount) {
                playSfx('error');
                return prev;
            }
            playSfx('money');
            if (onShowFloatingText) onShowFloatingText(`-$${loan.amount}`, 'expense');
            return { ...prev, money: prev.money - loan.amount, loans: prev.loans.filter(l => l.id !== loanId), logs: [...prev.logs, { id: Date.now(), message: t.loanRepaid, type: 'success' as const, timestamp: `${t.day} ${prev.day}` }].slice(-10) };
        });
    }, [setGameState, playSfx, onShowFloatingText]);

    const handleTradeOwnShares = useCallback((action: 'buy' | 'sell') => {
        setGameState(prev => {
            if (!prev.isPubliclyTraded) return prev;
            const percent = 5;
            const cost = prev.playerSharePrice * 100 * percent;
            if (action === 'buy') {
                if (prev.money < cost || prev.playerCompanySharesOwned >= 100) {
                    playSfx('error');
                    return prev;
                }
                playSfx('click');
                if (onShowFloatingText) onShowFloatingText(`-$${cost.toFixed(0)}`, 'expense');
                return { ...prev, money: prev.money - cost, playerCompanySharesOwned: Math.min(100, prev.playerCompanySharesOwned + percent), logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].logStockBuyback.replace('{0}', percent.toString()), type: 'success' as const, timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}` }].slice(-10) };
            } else {
                if (prev.playerCompanySharesOwned <= 10) {
                    playSfx('error');
                    return prev;
                }
                playSfx('money');
                if (onShowFloatingText) onShowFloatingText(`+$${cost.toFixed(0)}`, 'income');
                return { ...prev, money: prev.money + cost, playerCompanySharesOwned: Math.max(0, prev.playerCompanySharesOwned - percent), logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].logStockDilution.replace('{0}', percent.toString()), type: 'warning' as const, timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}` }].slice(-10) };
            }
        });
    }, [setGameState, playSfx, onShowFloatingText]);

    const handleLaunchCampaign = useCallback((campaignId: string, productType: ProductType) => {
        setGameState(prev => {
            const campaign = MARKETING_CAMPAIGNS.find((c: any) => c.id === campaignId);
            if (!campaign || prev.money < campaign.cost) {
                playSfx('error');
                return prev;
            }
            playSfx('success');
            vibrate('medium');
            if (onShowFloatingText) onShowFloatingText(`-$${campaign.cost}`, 'expense');

            const newBrandAwareness = { ...prev.brandAwareness };
            newBrandAwareness[productType] = Math.min(100, newBrandAwareness[productType] + campaign.awarenessBoost);

            const t = TRANSLATIONS[prev.language];
            const nameKey = `${campaign.id}_name` as keyof typeof t;
            const campaignName = t[nameKey] || campaign.name;
            const message = t.logCampaignLaunched.replace('{0}', campaignName).replace('{1}', productType);

            return {
                ...prev,
                money: prev.money - campaign.cost,
                activeCampaigns: [...prev.activeCampaigns, { id: campaignId, daysRemaining: campaign.duration }],
                brandAwareness: newBrandAwareness,
                logs: [...prev.logs, {
                    id: Date.now(),
                    message: message,
                    type: 'success' as const,
                    timestamp: `Day ${prev.day}`
                }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    const handleMaintainLine = useCallback((lineId: string) => {
        setGameState(prev => {
            const line = prev.productionLines.find(l => l.id === lineId);
            if (!line || prev.money < line.maintenanceCost) {
                playSfx('error');
                return prev;
            }

            playSfx('success');
            vibrate('medium');
            if (onShowFloatingText) onShowFloatingText(`-$${line.maintenanceCost}`, 'expense');

            return {
                ...prev,
                money: prev.money - line.maintenanceCost,
                productionLines: prev.productionLines.map(l =>
                    l.id === lineId
                        ? { ...l, efficiency: 100, lastMaintenanceDay: prev.day }
                        : l
                ),
                logs: [...prev.logs, {
                    id: Date.now(),
                    message: TRANSLATIONS[prev.language].logMaintained,
                    type: 'success' as const,
                    timestamp: `${TRANSLATIONS[prev.language].day} ${prev.day}`
                }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate, onShowFloatingText]);

    return {
        handleTabSwitch,
        handleProduce,
        handleUpdateDesignSpec,
        handleSell,
        handleBuySilicon,
        handleUpgradeOffice,
        handleAcceptContract,
        handleEventDismiss,
        handleResearch,
        handleHireResearcher,
        handleHireHero,
        handleFireResearcher,
        handleSetWorkPolicy,
        handleBuyStock,
        handleSellStock,
        handleIPO,
        handleCovertOpTrigger,
        handleHackingComplete,
        handleRetire,
        handleTakeLoan,
        handlePayLoan,
        handleTradeOwnShares,
        handleLaunchCampaign,
        handleMaintainLine,
        handleDowngradeOffice
    };
};
