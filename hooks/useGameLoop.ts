// Game Loop Hook
import { useEffect } from 'react';
import { GameState, ProductType, Contract, BoardMission } from '../types';
import {
    TRANSLATIONS,
    RESEARCHER_DAILY_SALARY,
    HEROES,
    OFFICE_CONFIGS,
    FLAVOR_TEXTS,
    BASE_SILICON_PRICE,
    MARKET_TRENDS,
    POTENTIAL_EVENTS,
    CPU_TECH_TREE,
    GPU_TECH_TREE,
    ERAS,
    RP_PER_RESEARCHER_PER_DAY,
    TICK_RATE_MS,
} from '../constants';
import { getReputationBonuses, format } from '../utils/gameUtils';
import { calculateStorageCost, ECONOMY_CONFIG } from '../utils/economySystem';

export const useGameLoop = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    playSfx: (sfx: any) => void,
    vibrate: (type: any) => void,
    onShowFloatingText?: (text: string, type: 'income' | 'expense' | 'rp' | 'reputation' | 'neutral', x?: number, y?: number) => void,
    isPaused?: boolean
) => {
    // Define tickRate based on gameSpeed
    const tickRate = gameState.gameSpeed === 'fast' ? TICK_RATE_MS / 4 : TICK_RATE_MS;

    useEffect(() => {
        // Pause if watching ad or if game speed is paused
        if (gameState.gameSpeed === 'paused' || isPaused) return;

        const tick = () => {
            setGameState(prev => {
                // Early exit for non‑playable states
                if (
                    prev.stage === 'menu' ||
                    prev.gameSpeed === 'paused' ||
                    prev.hacking.active ||
                    prev.offlineReport ||
                    prev.activeEvent
                )
                    return prev;

                const t = TRANSLATIONS[prev.language];
                const flavor = FLAVOR_TEXTS[prev.language];

                const bonuses = getReputationBonuses(prev.reputation);
                let newMoney = prev.money;
                const newDay = prev.day + 1;

                // OPTIMIZATION: Copy-on-write for logs
                let newLogs = prev.logs;

                const addLog = (entry: any) => {
                    if (newLogs === prev.logs) {
                        newLogs = [...prev.logs];
                    }
                    newLogs.push(entry);
                };

                let activeEvent = prev.activeEvent;
                let newBankruptcyTimer = prev.bankruptcyTimer;

                // Overdrive Timer Check
                let overdriveActive = prev.overdriveActive;
                if (overdriveActive && Date.now() > prev.overdriveEndsAt) {
                    overdriveActive = false;
                    addLog({
                        id: Date.now(),
                        message: t.logOverdriveExpired,
                        type: 'info',
                        timestamp: `${t.day} ${newDay}`,
                    });
                }

                // Daily Reset Logic (Real-time)
                let dailySpinCount = prev.dailySpinCount;
                let bailoutUsedToday = prev.bailoutUsedToday;
                let lastDailyReset = prev.lastDailyReset;

                const lastResetDate = new Date(prev.lastDailyReset);
                const currentDate = new Date();
                if (lastResetDate.getDate() !== currentDate.getDate()) {
                    dailySpinCount = 0;
                    bailoutUsedToday = false;
                    lastDailyReset = Date.now();
                    addLog({
                        id: Date.now(),
                        message: t.logDailyReset,
                        type: 'info',
                        timestamp: `${t.day} ${newDay}`,
                    });
                }

                // Era Progression
                let currentEraId = prev.currentEraId;
                const currentEraIndex = ERAS.findIndex(e => e.id === currentEraId);
                const nextEra = ERAS[currentEraIndex + 1];
                if (nextEra && newDay >= nextEra.startDay) {
                    currentEraId = nextEra.id;
                    addLog({
                        id: Date.now(),
                        message: format(t.logEraChange, t[`${nextEra.id}_name` as keyof typeof t] || nextEra.name),
                        type: 'warning',
                        timestamp: `${t.day} ${newDay}`,
                    });
                }

                // Trend Rotation
                let activeTrendId = prev.activeTrendId;
                if (newDay % 30 === 0) {
                    const availableTrends = MARKET_TRENDS.filter(trend => {
                        if (!trend.requiredEra) return true;
                        return trend.requiredEra.includes(currentEraId);
                    });

                    if (availableTrends.length > 0) {
                        const randomTrend = availableTrends[Math.floor(Math.random() * availableTrends.length)];
                        activeTrendId = randomTrend.id;
                        addLog({
                            id: Date.now(),
                            message: format(t.logMarketShift, t[`${randomTrend.id}_name` as keyof typeof t] || randomTrend.name),
                            type: 'info',
                            timestamp: `${t.day} ${newDay}`,
                        });
                    }
                }

                // Bankruptcy handling
                if (newMoney < 0) {
                    newBankruptcyTimer += 1;
                    if (newBankruptcyTimer === 1 || newBankruptcyTimer % 10 === 0) {
                        playSfx('error');
                        vibrate('error');
                        addLog({
                            id: Date.now(),
                            message: t.bankruptcyWarning + ` (${60 - newBankruptcyTimer} ${t.days || 'days'} ${t.left || 'left'})`,
                            type: 'danger',
                            timestamp: `${t.day} ${newDay}`,
                        });
                    }
                    if (newBankruptcyTimer >= 60) {
                        vibrate('error');
                        return { ...prev, stage: 'game_over' as any };
                    }
                } else {
                    newBankruptcyTimer = 0;
                }

                // Loan interest
                let dailyLoanCost = 0;
                prev.loans.forEach(l => (dailyLoanCost += l.dailyPayment));
                if (dailyLoanCost > 0 && newDay % 7 === 0) {
                    newLogs.push({
                        id: Date.now(),
                        message: t.logBankInterest,
                        type: 'info',
                        timestamp: `${t.day} ${newDay}`,
                    });
                    if (onShowFloatingText) onShowFloatingText(`-$${dailyLoanCost * 7}`, 'expense');
                }
                newMoney -= dailyLoanCost;

                // Staff salaries
                let salaryMultiplier = 1.0;
                if (prev.workPolicy === 'relaxed') salaryMultiplier = 0.8;
                if (prev.workPolicy === 'crunch') salaryMultiplier = 1.5;

                const researcherCount = Array.isArray(prev.researchers) ? prev.researchers.length : prev.researchers;
                const staffCost = researcherCount * RESEARCHER_DAILY_SALARY * salaryMultiplier;

                // Storage Costs (Progressive Economy)
                const currentOfficeConfig = OFFICE_CONFIGS[prev.officeLevel];
                const totalInventory = prev.inventory[ProductType.CPU] + prev.inventory[ProductType.GPU];

                // Calculate average product tier for early game relief
                const totalTier = (prev.techLevels[ProductType.CPU] * prev.inventory[ProductType.CPU]) +
                    (prev.techLevels[ProductType.GPU] * prev.inventory[ProductType.GPU]);
                const avgProductTier = totalInventory > 0 ? totalTier / totalInventory : 0;

                const storageCost = calculateStorageCost(totalInventory, currentOfficeConfig.siliconCap, avgProductTier);
                newMoney -= storageCost;

                if (storageCost > 0 && newDay % 7 === 0 && onShowFloatingText) {
                    onShowFloatingText(`-$${(storageCost * 7).toFixed(0)} Storage`, 'expense');
                }

                // Market Saturation Recovery
                const newSaturation = { ...prev.marketSaturation };
                if (!newSaturation[ProductType.CPU]) newSaturation[ProductType.CPU] = 0;
                if (!newSaturation[ProductType.GPU]) newSaturation[ProductType.GPU] = 0;

                newSaturation[ProductType.CPU] = Math.max(0, newSaturation[ProductType.CPU] - ECONOMY_CONFIG.MARKET_RECOVERY_RATE);
                newSaturation[ProductType.GPU] = Math.max(0, newSaturation[ProductType.GPU] - ECONOMY_CONFIG.MARKET_RECOVERY_RATE);


                // Daily Market Demand (Random refresh each day)
                // Daily Market Demand (Random refresh each day)
                const baseDemandCPU = 300;
                const baseDemandGPU = 300;

                // Random variation: ±30%
                const cpuVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
                const gpuVariation = 0.7 + Math.random() * 0.6;

                // Scale with tech level (higher tier = lower base demand but higher price)
                const cpuTierScaling = Math.pow(0.95, prev.techLevels[ProductType.CPU]);
                const gpuTierScaling = Math.pow(0.95, prev.techLevels[ProductType.GPU]);

                // Scale with office level (bigger warehouse = bigger market!)
                const officeScaling = Math.pow(2, prev.officeLevel);

                // Era Modifiers
                const currentEra = ERAS.find(e => e.id === currentEraId) || ERAS[0];
                const eraCpuMod = currentEra.cpuDemandMod || 1.0;
                const eraGpuMod = currentEra.gpuDemandMod || 1.0;

                // Trend Modifiers (Hype increases demand too!)
                const activeTrend = MARKET_TRENDS.find(t => t.id === prev.activeTrendId);
                let trendCpuMod = 1.0;
                let trendGpuMod = 1.0;

                if (activeTrend) {
                    // If trend boosts price, it also boosts demand (hype)
                    if (activeTrend.affectedProducts.includes(ProductType.CPU)) trendCpuMod = activeTrend.priceBonus;
                    if (activeTrend.affectedProducts.includes(ProductType.GPU)) trendGpuMod = activeTrend.priceBonus;
                }

                const newDailyDemand = {
                    [ProductType.CPU]: Math.floor(baseDemandCPU * cpuVariation * cpuTierScaling * officeScaling * eraCpuMod * trendCpuMod),
                    [ProductType.GPU]: Math.floor(baseDemandGPU * gpuVariation * gpuTierScaling * officeScaling * eraGpuMod * trendGpuMod)
                };

                // Hero salaries
                let heroSalary = 0;
                prev.hiredHeroes.forEach(hId => {
                    const hero = HEROES.find(h => h.id === hId);
                    if (hero) heroSalary += hero.dailySalary;
                });

                const totalDailyExpenses = staffCost + heroSalary;
                newMoney -= totalDailyExpenses;
                if (totalDailyExpenses > 0 && onShowFloatingText) {
                    if (newDay % 7 === 0) {
                        onShowFloatingText(`-$${totalDailyExpenses.toFixed(0)}`, 'expense');
                    }
                }

                // Office rent (weekly)
                const office = OFFICE_CONFIGS[prev.officeLevel];
                if (newDay % 7 === 0 && office.rent > 0) {
                    newMoney -= office.rent;
                    addLog({
                        id: Date.now(),
                        message: t.logRentPaid,
                        type: 'info',
                        timestamp: `${t.day} ${newDay}`,
                    });
                    if (onShowFloatingText) onShowFloatingText(`-$${office.rent}`, 'expense');
                }

                // Trim logs
                if (newLogs.length > 50) newLogs = newLogs.slice(-50);

                // Market dynamics
                const targetMultiplier = 0.95;
                const diff = targetMultiplier - prev.marketMultiplier;
                const elasticity = diff * 0.05;
                const noise = (Math.random() - 0.5) * 0.1;
                let newMultiplier = prev.marketMultiplier + elasticity + noise;
                newMultiplier = Math.max(0.5, Math.min(1.6, newMultiplier));

                if (newMultiplier > 1.4 && prev.marketMultiplier <= 1.4) {
                    const msg = flavor.marketBoom[Math.floor(Math.random() * flavor.marketBoom.length)];
                    activeEvent = {
                        id: `boom_${Date.now()}`,
                        title: t.evtMarketBoom,
                        description: msg,
                        type: "positive"
                    };
                    addLog({ id: Date.now(), message: msg, type: 'success', timestamp: `${t.day} ${newDay}` });
                    vibrate('success');
                }
                if (newMultiplier < 0.7 && prev.marketMultiplier >= 0.7) {
                    const msg = flavor.marketCrash[Math.floor(Math.random() * flavor.marketCrash.length)];
                    activeEvent = {
                        id: `crash_${Date.now()}`,
                        title: t.evtMarketCrash,
                        description: msg,
                        type: "negative"
                    };
                    addLog({ id: Date.now(), message: msg, type: 'danger', timestamp: `${t.day} ${newDay}` });
                    vibrate('error');
                }

                // Silicon price
                let targetSiliconPrice = BASE_SILICON_PRICE * newMultiplier;
                const currentTrend = prev.activeTrendId;
                let trendMod = 1.0;
                if (currentTrend === 'trend_crypto') trendMod = 4.0;
                else if (currentTrend === 'trend_gamer') trendMod = 2.5;
                else if (currentTrend === 'trend_green') trendMod = 0.8;
                if (prev.activeEvent?.id === 'evt_shortage') trendMod *= 3.0;
                targetSiliconPrice *= trendMod;
                let newSiliconPrice = prev.siliconPrice * 0.9 + targetSiliconPrice * 0.1;
                newSiliconPrice += Math.random() - 0.5;
                newSiliconPrice = Math.max(3, Math.min(200, newSiliconPrice));

                if (newSiliconPrice > 50 && prev.siliconPrice <= 50) {
                    const msg = flavor.siliconSpike[Math.floor(Math.random() * flavor.siliconSpike.length)];
                    activeEvent = {
                        id: `spike_${Date.now()}`,
                        title: t.evtSiliconShortageTitle,
                        description: msg,
                        type: "negative"
                    };
                    addLog({ id: Date.now(), message: msg, type: 'warning', timestamp: `${t.day} ${newDay}` });
                }

                // Global tech advancement
                const progressChance = 0.002 + prev.day * 0.00005;
                let newGlobalTechCPU = prev.globalTechLevels.CPU;
                let newGlobalTechGPU = prev.globalTechLevels.GPU;
                if (Math.random() < progressChance && newGlobalTechCPU < CPU_TECH_TREE.length - 1) {
                    newGlobalTechCPU += 1;
                    addLog({
                        id: Date.now(),
                        message: format(t.logGlobalTech, newGlobalTechCPU, "CPU"),
                        type: 'warning',
                        timestamp: `${t.day} ${newDay}`,
                    });
                }
                if (Math.random() < progressChance && newGlobalTechGPU < GPU_TECH_TREE.length - 1) {
                    newGlobalTechGPU += 1;
                    addLog({
                        id: Date.now(),
                        message: format(t.logGlobalTech, newGlobalTechGPU, "GPU"),
                        type: 'warning',
                        timestamp: `${t.day} ${newDay}`,
                    });
                }

                // RP gain
                let rpPolicyMult = 1;
                if (prev.researchPolicy === 'aggressive') rpPolicyMult = 1.5;
                if (prev.researchPolicy === 'safe') rpPolicyMult = 0.8;

                let newMorale = prev.staffMorale;
                if (prev.workPolicy === 'crunch' && researcherCount > 0) newMorale = Math.max(0, newMorale - 1);
                if (prev.workPolicy === 'relaxed') newMorale = Math.min(100, newMorale + 1);

                let newResearchers = prev.researchers;
                if (newMorale < 20 && Math.random() < 0.05 && researcherCount > 0) {
                    if (Array.isArray(newResearchers)) {
                        newResearchers = [...newResearchers];
                        newResearchers.pop(); // Remove last hired
                    } else {
                        newResearchers = (newResearchers as number) - 1;
                    }
                    addLog({
                        id: Date.now(),
                        message: t.logResearcherQuit,
                        type: 'danger',
                        timestamp: `${t.day} ${newDay}`,
                    });
                }

                const moraleEfficiency = newMorale / 100;
                const rpModifier = prev.hiredHeroes.includes('hero_linus') ? 2 : 1;
                const prestigeMult = 1 + prev.prestigePoints * 0.01;
                const rpGain =
                    researcherCount *
                    RP_PER_RESEARCHER_PER_DAY *
                    rpModifier *
                    prestigeMult *
                    bonuses.researchBonus *
                    rpPolicyMult *
                    (0.5 + moraleEfficiency * 0.5);

                // Stock market update
                const volMult = prev.hiredHeroes.includes('hero_elon') ? 4.0 : 2.5;
                const newStocks = prev.stocks.map(stock => {
                    const change = (Math.random() - 0.5) * stock.volatility * volMult;
                    let price = stock.currentPrice * (1 + change);
                    price = Math.max(1, price);
                    const history = [...stock.history, price].slice(-10);
                    return { ...stock, currentPrice: price, history };
                });

                // Board Missions Logic
                let boardMissions = [...(prev.boardMissions || [])];
                let prestigePenalty = 0;

                const remainingMissions: BoardMission[] = [];
                boardMissions.forEach(mission => {
                    if (newDay > mission.deadlineDay) {
                        prestigePenalty += mission.penalty;
                        newLogs.push({
                            id: Date.now(),
                            message: format(t.mission_penalty, mission.penalty),
                            type: 'danger',
                            timestamp: `${t.day} ${newDay}`
                        });
                        playSfx('error');
                        vibrate('heavy');
                    } else {
                        let completed = false;
                        if (mission.type === 'profit' && newMoney >= mission.targetValue) completed = true;
                        if (mission.type === 'prestige' && prev.reputation >= mission.targetValue) completed = true;
                        if (mission.type === 'quality') {
                            const avgQuality = (prev.techLevels[ProductType.CPU] + prev.techLevels[ProductType.GPU]) * 5 + 50;
                            if (avgQuality >= mission.targetValue) completed = true;
                        }

                        if (completed) {
                            newLogs.push({
                                id: Date.now(),
                                message: "Board Mission Completed! Reputation Secured.",
                                type: 'success',
                                timestamp: `${t.day} ${newDay}`
                            });
                            playSfx('success');
                        } else {
                            remainingMissions.push(mission);
                        }
                    }
                });
                boardMissions = remainingMissions;

                if (prev.playerCompanySharesOwned < 50 && boardMissions.length === 0 && Math.random() < 0.1) {
                    const missionType = ['profit', 'prestige'][Math.floor(Math.random() * 2)] as 'profit' | 'prestige';
                    let target = 0;
                    let desc = "";

                    if (missionType === 'profit') {
                        target = Math.floor(newMoney * 1.5) + 10000;
                        desc = `Reach $${target.toLocaleString()} cash balance`;
                    } else {
                        target = Math.min(100, prev.reputation + 10);
                        desc = `Reach ${target}% Reputation`;
                    }

                    boardMissions.push({
                        id: `mission_${Date.now()}`,
                        title: "Board Directive",
                        description: desc,
                        type: missionType,
                        targetValue: target,
                        deadlineDay: newDay + 30,
                        penalty: 10,
                        reward: 0
                    });

                    addLog({
                        id: Date.now(),
                        message: "New Board Mission Received!",
                        type: 'warning',
                        timestamp: `${t.day} ${newDay}`,
                    });
                    playSfx('notification');
                }

                // Unlock new tabs
                let currentUnlocked = [...prev.unlockedTabs];
                let newTabUnlocked = false;
                if (!currentUnlocked.includes('rnd') && newMoney >= 10000) {
                    currentUnlocked.push('rnd');
                    addLog({ id: Date.now(), message: t.logRdEstablished, type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('finance') && newMoney >= 50000) {
                    currentUnlocked.push('finance');
                    addLog({ id: Date.now(), message: "Finance Dept. Established", type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('automation') && newMoney >= 0) {
                    currentUnlocked.push('automation');
                    addLog({ id: Date.now(), message: t.logAutomationEstablished, type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('management') && newMoney >= 100000) {
                    currentUnlocked.push('management');
                    addLog({ id: Date.now(), message: "Management Dept. Established", type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                    if (newTabUnlocked) {
                        playSfx('success');
                        vibrate('medium');
                    }
                }

                // Contracts handling
                let activeContracts = [...prev.activeContracts];
                const keptContracts: Contract[] = [];
                let repPenalty = 0;
                activeContracts.forEach(contract => {
                    if (newDay > contract.deadlineDay) {
                        newMoney -= contract.penalty;
                        repPenalty += 10;
                        playSfx('error');
                        vibrate('error');
                        addLog({ id: Date.now(), message: t.logContractFailed, type: 'danger', timestamp: `${t.day} ${newDay}` });
                        if (onShowFloatingText) {
                            onShowFloatingText(`-$${contract.penalty}`, 'expense');
                            onShowFloatingText(`-10 REP`, 'reputation');
                        }
                    } else {
                        keptContracts.push(contract);
                    }
                });

                let availableContracts = [...prev.availableContracts];
                if (Math.random() < 0.2) {
                    const type = Math.random() > 0.5 ? ProductType.CPU : ProductType.GPU;
                    const amount = Math.floor(Math.random() * 50) + 10;

                    // Tech Scaling: Ensure requested tech is relevant (current or slightly lower/higher)
                    const currentTechLevel = prev.techLevels[type];
                    const techLevel = Math.max(0, Math.min(
                        (type === ProductType.CPU ? CPU_TECH_TREE.length : GPU_TECH_TREE.length) - 1,
                        currentTechLevel + (Math.random() > 0.7 ? 1 : 0) // Small chance to request next tier
                    ));

                    const basePrice = type === ProductType.CPU ? CPU_TECH_TREE[techLevel].baseMarketPrice : GPU_TECH_TREE[techLevel].baseMarketPrice;

                    // Difficulty & Reward Multipliers
                    // Easy: 1.2x, Medium: 1.5x, Hard: 2.0x
                    const difficultyRoll = Math.random();
                    let difficultyMult = 1.2;
                    let duration = 15; // More time for easier contracts

                    if (difficultyRoll > 0.6) {
                        difficultyMult = 1.5;
                        duration = 10;
                    }
                    if (difficultyRoll > 0.9) {
                        difficultyMult = 2.0;
                        duration = 7; // High risk, high reward
                    }

                    const totalReward = Math.floor(amount * basePrice * difficultyMult);

                    let minPerformance: number | undefined;
                    let minEfficiency: number | undefined;

                    // Helper to round to nearest 5
                    const round5 = (n: number) => Math.round(n / 5) * 5;

                    if (type === ProductType.CPU) {
                        // Base 50 + Tech Scaling + Random
                        const rawReq = 50 + (techLevel * 10) + Math.random() * 15;
                        minPerformance = round5(rawReq);
                    } else {
                        const rawReq = 50 + (techLevel * 10) + Math.random() * 15;
                        if (Math.random() > 0.5) {
                            minEfficiency = round5(rawReq);
                        } else {
                            minPerformance = round5(rawReq);
                        }
                    }

                    availableContracts.push({
                        id: `cnt_${Date.now()}`,
                        title: format(t.logContractOrder, amount, type),
                        description: format(t.logContractDeadline, duration),
                        requiredProduct: type,
                        requiredAmount: amount,
                        fulfilledAmount: 0,
                        reward: totalReward,
                        upfrontPayment: Math.floor(totalReward * 0.4),
                        completionPayment: Math.floor(totalReward * 0.6),
                        minPerformance,
                        minEfficiency,
                        penalty: Math.floor(totalReward * 0.4),
                        deadlineDay: newDay + duration,
                        duration: duration,
                    });
                    if (availableContracts.length > 3) availableContracts.shift();
                }

                // Manual Production logic
                let productionSiliconConsumed = 0;
                let productionOutput: Record<ProductType, number> = { [ProductType.CPU]: 0, [ProductType.GPU]: 0 };

                const updatedProductionLines = prev.productionLines.map(line => {
                    if (line.status === 'producing') {
                        const degradation = Math.random() * 1 + 1;
                        const newEfficiency = Math.max(0, line.efficiency - degradation);
                        const siliconPerUnit = line.specialization === 'efficiency' ? 6 : 10;
                        let baseOutput = line.dailyOutput;
                        if (line.specialization === 'speed') baseOutput = Math.floor(baseOutput * 1.5);
                        else if (line.specialization === 'quality') baseOutput = Math.floor(baseOutput * 0.7);

                        if (overdriveActive) {
                            baseOutput = baseOutput * 2;
                        }

                        const actualOutput = Math.floor(baseOutput * (newEfficiency / 100));
                        const siliconNeeded = actualOutput * siliconPerUnit;
                        if (prev.silicon >= productionSiliconConsumed + siliconNeeded) {
                            productionSiliconConsumed += siliconNeeded;
                            productionOutput[line.productType] += actualOutput;
                        }
                        return { ...line, efficiency: newEfficiency };
                    }
                    return line;
                });

                // Update inventory with production output
                const newInventory = { ...prev.inventory };
                Object.keys(productionOutput).forEach(k => {
                    const t = k as ProductType;
                    newInventory[t] += productionOutput[t];
                });

                // --- Factory Automation Logic ---
                let factoryMoneyChange = 0;
                let factoryProduction: Record<ProductType, number> = { [ProductType.CPU]: 0, [ProductType.GPU]: 0 };
                let newSilicon = prev.silicon - productionSiliconConsumed;

                if (prev.factory.landOwned) {
                    // 1. Procurement (Buy Silicon)
                    const procurementRate = prev.factory.modules.procurement.rate;
                    const siliconSpace = currentOfficeConfig.siliconCap - newSilicon;
                    const siliconToBuy = Math.min(procurementRate, siliconSpace);

                    if (siliconToBuy > 0) {
                        const cost = Math.floor(siliconToBuy * prev.siliconPrice);
                        if (newMoney >= cost) {
                            factoryMoneyChange -= cost;
                            newSilicon += siliconToBuy;
                        }
                    }

                    // 2. Assembly (Produce Chips)
                    const assemblyRate = prev.factory.modules.assembly.rate;
                    const amountPerType = Math.floor(assemblyRate / 2);

                    [ProductType.CPU, ProductType.GPU].forEach(type => {
                        const siliconPerUnit = 10;
                        const needed = amountPerType * siliconPerUnit;
                        if (newSilicon >= needed) {
                            newSilicon -= needed;
                            factoryProduction[type] += amountPerType;
                        }
                    });
                }

                newMoney += factoryMoneyChange;
                newInventory[ProductType.CPU] += factoryProduction[ProductType.CPU];
                newInventory[ProductType.GPU] += factoryProduction[ProductType.GPU];

                // Campaign decay
                const activeCampaigns = (prev.activeCampaigns || [])
                    .map(c => ({ ...c, daysRemaining: c.daysRemaining - 1 }))
                    .filter(c => c.daysRemaining > 0);

                // Brand awareness decay (weekly)
                const brandAwareness = { ...prev.brandAwareness };
                if (newDay % 7 === 0) {
                    Object.keys(brandAwareness).forEach(k => {
                        const t = k as ProductType;
                        brandAwareness[t] = Math.max(0, brandAwareness[t] - 2);
                    });
                }

                // Competitor Simulation
                let competitors = [...prev.competitors];
                competitors = competitors.map(comp => {
                    let dailyRevenue = 0;
                    Object.values(ProductType).forEach(type => {
                        const marketSize = 10000000;
                        const share = comp.marketShare[type] / 100;
                        dailyRevenue += marketSize * share * 0.01;
                    });

                    const newCompMoney = comp.money + dailyRevenue;
                    const newHistory = [...(comp.history || []), newCompMoney].slice(-30);

                    return { ...comp, money: newCompMoney, history: newHistory };
                });

                if (newDay % 10 === 0 && competitors.length > 0) {
                    competitors = competitors.map(comp => {
                        const newComp = { ...comp };
                        const daysSinceRelease = newDay - (newComp.lastReleaseDay || -999);
                        if (newComp.money > 1000000 && daysSinceRelease > 60) {
                            if (Math.random() < 0.2) {
                                newComp.money -= 1000000;
                                newComp.lastReleaseDay = newDay;
                                const type = Math.random() > 0.5 ? ProductType.CPU : ProductType.GPU;
                                newComp.productQuality[type] = Math.min(100, newComp.productQuality[type] + 5);
                                newComp.techLevel[type] += 1;

                                newLogs.push({
                                    id: Date.now() + Math.random(),
                                    message: `${newComp.name} released a new ${type} generation!`,
                                    type: 'warning',
                                    timestamp: `${t.day} ${newDay}`,
                                });
                            }
                        }
                        return newComp;
                    });

                    Object.values(ProductType).forEach(type => {
                        const playerQuality = prev.techLevels[type] * 10 + 50;
                        const playerAwareness = brandAwareness[type] || 0;
                        const playerScore = playerQuality * (1 + playerAwareness / 50);

                        let totalScore = playerScore;
                        const competitorScores = competitors.map(comp => {
                            const score = comp.productQuality[type] * (1 + comp.marketShare[type] / 200);
                            totalScore += score;
                            return { id: comp.id, score };
                        });

                        if (totalScore > 0) {
                            competitors = competitors.map(comp => {
                                const data = competitorScores.find(c => c.id === comp.id);
                                const newShare = data ? (data.score / totalScore) * 100 : comp.marketShare[type];
                                return { ...comp, marketShare: { ...comp.marketShare, [type]: Math.max(0, Math.min(100, newShare)) } };
                            });
                        }
                    });
                }

                return {
                    ...prev,
                    day: newDay,
                    money: newMoney,
                    rp: prev.rp + rpGain,
                    silicon: newSilicon,
                    researchers: newResearchers,
                    staffMorale: newMorale,
                    logs: newLogs.slice(-30), // OPTIMIZATION: Cap logs at 30
                    bankruptcyTimer: newBankruptcyTimer,
                    activeEvent,
                    overdriveActive,
                    dailySpinCount,
                    bailoutUsedToday,
                    lastDailyReset,
                    productionLines: updatedProductionLines,
                    inventory: newInventory,
                    activeCampaigns,
                    brandAwareness,
                    competitors,
                    stocks: newStocks,
                    boardMissions,
                    unlockedTabs: currentUnlocked,
                    activeContracts: keptContracts,
                    availableContracts,
                    marketMultiplier: newMultiplier,
                    siliconPrice: newSiliconPrice,
                    globalTechLevels: { CPU: newGlobalTechCPU, GPU: newGlobalTechGPU },
                    prestigePoints: Math.max(0, prev.prestigePoints - prestigePenalty),
                    reputation: Math.max(0, prev.reputation - repPenalty),
                    currentEraId,
                    activeTrendId,
                    dailyDemand: newDailyDemand,
                };
            });
        };

        const interval = setInterval(tick, tickRate);
        return () => clearInterval(interval);
    }, [
        gameState.gameSpeed,
        isPaused,
        tickRate,
        setGameState,
        playSfx,
        vibrate,
        onShowFloatingText
    ]);
};
