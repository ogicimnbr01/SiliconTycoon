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
    onShowFloatingText?: (text: string, type: 'income' | 'expense' | 'rp' | 'reputation' | 'neutral', x?: number, y?: number) => void
) => {
    useEffect(() => {
        if (gameState.gameSpeed === 'paused') return;

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
                let newLogs = [...prev.logs];
                let activeEvent = prev.activeEvent;
                let newBankruptcyTimer = prev.bankruptcyTimer;

                // Bankruptcy handling
                if (newMoney < 0) {
                    newBankruptcyTimer += 1;
                    if (newBankruptcyTimer === 1 || newBankruptcyTimer % 10 === 0) {
                        playSfx('error');
                        vibrate('error');
                        newLogs.push({
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
                const staffCost = prev.researchers * RESEARCHER_DAILY_SALARY * salaryMultiplier;

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

                // Hero salaries
                let heroSalary = 0;
                prev.hiredHeroes.forEach(hId => {
                    const hero = HEROES.find(h => h.id === hId);
                    if (hero) heroSalary += hero.dailySalary;
                });

                const totalDailyExpenses = staffCost + heroSalary;
                newMoney -= totalDailyExpenses;
                if (totalDailyExpenses > 0 && onShowFloatingText) {
                    // Show daily salary expense occasionally or aggregated to avoid spam?
                    // For now, let's show it daily but maybe small?
                    // Actually, daily spam might be annoying. Let's show it weekly or if it's significant.
                    // Or just show it. It's a "tick" based game.
                    if (newDay % 7 === 0) { // Weekly summary for salaries to reduce noise?
                        // No, user asked for "invisible" expenses. Daily salary is invisible.
                        // But daily tick is 1.5s.
                        onShowFloatingText(`-$${totalDailyExpenses.toFixed(0)}`, 'expense');
                    }
                }


                // Office rent (weekly)
                const office = OFFICE_CONFIGS[prev.officeLevel];
                if (newDay % 7 === 0 && office.rent > 0) {
                    newMoney -= office.rent;
                    newLogs.push({
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
                        title: "MARKET BOOM!",
                        description: msg,
                        type: "positive"
                    };
                    newLogs.push({ id: Date.now(), message: msg, type: 'success', timestamp: `${t.day} ${newDay}` });
                    vibrate('success');
                }
                if (newMultiplier < 0.7 && prev.marketMultiplier >= 0.7) {
                    const msg = flavor.marketCrash[Math.floor(Math.random() * flavor.marketCrash.length)];
                    activeEvent = {
                        id: `crash_${Date.now()}`,
                        title: "MARKET CRASH!",
                        description: msg,
                        type: "negative"
                    };
                    newLogs.push({ id: Date.now(), message: msg, type: 'danger', timestamp: `${t.day} ${newDay}` });
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
                        title: "SILICON SHORTAGE!",
                        description: msg,
                        type: "negative"
                    };
                    newLogs.push({ id: Date.now(), message: msg, type: 'warning', timestamp: `${t.day} ${newDay}` });
                }

                // Global tech advancement
                const progressChance = 0.002 + prev.day * 0.00005;
                let newGlobalTechCPU = prev.globalTechLevels.CPU;
                let newGlobalTechGPU = prev.globalTechLevels.GPU;
                if (Math.random() < progressChance && newGlobalTechCPU < CPU_TECH_TREE.length - 1) {
                    newGlobalTechCPU += 1;
                    newLogs.push({
                        id: Date.now(),
                        message: format(t.logGlobalTech, newGlobalTechCPU, "CPU"),
                        type: 'warning',
                        timestamp: `${t.day} ${newDay}`,
                    });
                }
                if (Math.random() < progressChance && newGlobalTechGPU < GPU_TECH_TREE.length - 1) {
                    newGlobalTechGPU += 1;
                    newLogs.push({
                        id: Date.now(),
                        message: format(t.logGlobalTech, newGlobalTechGPU, "GPU"),
                        type: 'warning',
                        timestamp: `${t.day} ${newDay}`,
                    });
                }

                // Era change
                const nextEra = ERAS.find(e => e.startDay === newDay);
                let currentEraId = prev.currentEraId;
                if (nextEra) {
                    currentEraId = nextEra.id;
                    newLogs.push({
                        id: Date.now(),
                        message: format(t.logEraChange, nextEra.name),
                        type: 'info',
                        timestamp: `${t.day} ${newDay}`,
                    });
                    vibrate('medium');
                }

                // Market trend shift
                let activeTrendId = prev.activeTrendId;
                if (newDay % 45 === 0) {
                    const possible = MARKET_TRENDS.filter(t => t.id !== activeTrendId);
                    const next = possible[Math.floor(Math.random() * possible.length)];
                    activeTrendId = next.id;
                    newLogs.push({
                        id: Date.now(),
                        message: format(t.logMarketShift, next.name),
                        type: 'warning',
                        timestamp: `${t.day} ${newDay}`,
                    });
                    vibrate('medium');
                }

                // Rival launch
                let activeRivalLaunch = prev.activeRivalLaunch;
                if (activeRivalLaunch) {
                    activeRivalLaunch = { ...activeRivalLaunch, daysRemaining: activeRivalLaunch.daysRemaining - 1 };
                    if (activeRivalLaunch.daysRemaining <= 0) activeRivalLaunch = null;
                } else if (newDay > 20 && Math.random() < 0.015) {
                    const rival = prev.stocks[Math.floor(Math.random() * prev.stocks.length)];
                    activeRivalLaunch = {
                        id: `launch_${newDay}`,
                        companyName: rival.name,
                        productName: `Killer-X`,
                        effect: 0.6,
                        daysRemaining: 10,
                    };
                    newLogs.push({
                        id: Date.now(),
                        message: format(t.logRivalAlert, rival.name),
                        type: 'danger',
                        timestamp: `${t.day} ${newDay}`,
                    });
                    vibrate('heavy');
                }

                // Financial history (weekly)
                let financialHistory = [...prev.financialHistory];
                if (newDay % 5 === 0) {
                    financialHistory.push({ day: newDay, money: newMoney });
                    if (financialHistory.length > 30) financialHistory.shift();
                }

                // Morale & RP policy
                let moraleChange = 0;
                let rpPolicyMult = 1.0;
                if (prev.researchers > 0) {
                    if (prev.workPolicy === 'relaxed') {
                        moraleChange = 0.5;
                        rpPolicyMult = 0.7;
                    } else if (prev.workPolicy === 'normal') {
                        moraleChange = -0.1;
                        rpPolicyMult = 1;
                    } else if (prev.workPolicy === 'crunch') {
                        moraleChange = -1;
                        rpPolicyMult = 1.6;
                    }
                }
                const newMorale = Math.min(100, Math.max(0, prev.staffMorale + moraleChange));
                let newResearchers = prev.researchers;

                // Resignation logic
                if (newResearchers > 0) {
                    let resigned = 0;
                    let msg = '';
                    if (newMorale < 15 && Math.random() < 0.2) {
                        resigned = 1;
                        msg = t.logResignCritical;
                    } else if (newMorale < 20 && Math.random() < 0.1) {
                        resigned = 3;
                        msg = t.logResignMass;
                    } else if (newMorale < 25 && Math.random() < 0.05) {
                        resigned = 2 + Math.floor(Math.random() * 2);
                        msg = format(t.logResignBad, resigned);
                    } else if (newMorale < 35 && newMorale >= 30 && Math.random() < 0.02) {
                        resigned = 1;
                        msg = t.logResignSingle;
                    }
                    if (resigned > 0) {
                        newResearchers = Math.max(0, newResearchers - resigned);
                        const flavorMsg = flavor.staffResign[Math.floor(Math.random() * flavor.staffResign.length)];
                        activeEvent = {
                            id: `resign_${Date.now()}`,
                            title: msg,
                            description: flavorMsg,
                            type: "negative",
                        };
                        playSfx('error');
                        vibrate('heavy');
                        newLogs.push({ id: Date.now(), message: msg, type: 'danger', timestamp: `${t.day} ${newDay}` });
                    }
                }

                // RP gain
                const moraleEfficiency = newMorale / 100;
                const rpModifier = prev.hiredHeroes.includes('hero_linus') ? 2 : 1;
                const prestigeMult = 1 + prev.prestigePoints * 0.01;
                const rpGain =
                    prev.researchers *
                    RP_PER_RESEARCHER_PER_DAY *
                    rpModifier *
                    prestigeMult *
                    bonuses.researchBonus *
                    rpPolicyMult *
                    (0.5 + moraleEfficiency * 0.5);

                // Stock market update
                // Increased volatility for high risk/reward
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

                // Check active missions
                const remainingMissions: BoardMission[] = [];
                boardMissions.forEach(mission => {
                    if (newDay > mission.deadlineDay) {
                        // Mission Failed
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
                        // Check completion
                        let completed = false;
                        if (mission.type === 'profit' && newMoney >= mission.targetValue) completed = true;
                        if (mission.type === 'prestige' && prev.reputation >= mission.targetValue) completed = true;
                        if (mission.type === 'quality') {
                            const avgQuality = (prev.techLevels[ProductType.CPU] + prev.techLevels[ProductType.GPU]) * 5 + 50; // Rough estimate
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

                // Generate new mission if ownership < 50%
                if (prev.playerCompanySharesOwned < 50 && boardMissions.length === 0 && Math.random() < 0.1) {
                    const missionType = ['profit', 'quality', 'prestige'][Math.floor(Math.random() * 3)] as 'profit' | 'quality' | 'prestige';
                    let target = 0;
                    let desc = "";

                    if (missionType === 'profit') {
                        target = Math.floor(newMoney * 1.5) + 10000;
                        desc = format(t.mission_profit, target);
                    } else if (missionType === 'quality') {
                        target = 70 + Math.floor(Math.random() * 20);
                        desc = format(t.mission_quality, target);
                    } else {
                        target = Math.min(100, prev.reputation + 10);
                        desc = format(t.mission_prestige, target);
                    }

                    boardMissions.push({
                        id: `bm_${Date.now()}`,
                        description: desc,
                        type: missionType,
                        targetValue: target,
                        deadlineDay: newDay + 30,
                        penalty: 30
                    });

                    newLogs.push({
                        id: Date.now(),
                        message: "BOARD INTERVENTION: New Mission Assigned!",
                        type: 'warning',
                        timestamp: `${t.day} ${newDay}`
                    });
                }

                // Unlock new tabs (R&D, Finance)
                let currentUnlocked = [...prev.unlockedTabs];
                let newTabUnlocked = false;
                if (!currentUnlocked.includes('rnd') && newMoney >= 10000) {
                    currentUnlocked.push('rnd');
                    newLogs.push({ id: Date.now(), message: t.logRdEstablished, type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('finance') && newMoney >= 0) {
                    currentUnlocked.push('finance');
                    newLogs.push({ id: Date.now(), message: t.logFinanceEstablished, type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('statistics') && newMoney >= 0) {
                    currentUnlocked.push('statistics');
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('marketing') && newMoney >= 100000) {
                    currentUnlocked.push('marketing');
                    newLogs.push({ id: Date.now(), message: "Marketing Dept. Established", type: 'success', timestamp: `${t.day} ${newDay}` });
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
                        newLogs.push({ id: Date.now(), message: t.logContractFailed, type: 'danger', timestamp: `${t.day} ${newDay}` });
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
                    const techLevel = Math.max(0, prev.techLevels[type] - Math.floor(Math.random() * 2));
                    const basePrice = type === ProductType.CPU ? CPU_TECH_TREE[techLevel].baseMarketPrice : GPU_TECH_TREE[techLevel].baseMarketPrice;

                    // Scale reward based on Office Level to make late-game contracts viable
                    const officeScaling = 1 + (prev.officeLevel * 0.5); // +50% per office level
                    const totalReward = Math.floor(amount * basePrice * 1.3 * officeScaling);

                    // Requirements
                    let minPerformance: number | undefined;
                    let minEfficiency: number | undefined;

                    if (type === ProductType.CPU) {
                        // CPU contracts care about Performance
                        minPerformance = 30 + (techLevel * 15) + Math.floor(Math.random() * 10);
                    } else {
                        // GPU contracts care about Efficiency (or Performance too)
                        // Let's say 50% chance for either
                        if (Math.random() > 0.5) {
                            minEfficiency = 30 + (techLevel * 15) + Math.floor(Math.random() * 10);
                        } else {
                            minPerformance = 30 + (techLevel * 15) + Math.floor(Math.random() * 10);
                        }
                    }

                    availableContracts.push({
                        id: `cnt_${Date.now()}`,
                        title: format(t.logContractOrder, amount, type),
                        description: format(t.logContractDeadline, 10),
                        requiredProduct: type,
                        requiredAmount: amount,
                        fulfilledAmount: 0,
                        reward: totalReward,
                        upfrontPayment: Math.floor(totalReward * 0.4),
                        completionPayment: Math.floor(totalReward * 0.6),
                        minPerformance,
                        minEfficiency,
                        penalty: Math.floor(totalReward * 0.4),
                        deadlineDay: newDay + 10,
                        duration: 10,
                    });
                    if (availableContracts.length > 3) availableContracts.shift();
                }

                // Production logic
                let productionSiliconConsumed = 0;
                const productionOutput: Record<ProductType, number> = { [ProductType.CPU]: 0, [ProductType.GPU]: 0 };

                // Marketing Bonus: Brand Awareness boosts demand (sales speed)
                // 100% Awareness = 2x Sales Speed
                const brandBonus = {
                    [ProductType.CPU]: 1 + (prev.brandAwareness[ProductType.CPU] / 100),
                    [ProductType.GPU]: 1 + (prev.brandAwareness[ProductType.GPU] / 100)
                };

                const updatedProductionLines = prev.productionLines.map(line => {
                    if (line.status === 'producing') {
                        const degradation = Math.random() * 1 + 1; // 1‑2%
                        const newEfficiency = Math.max(0, line.efficiency - degradation);
                        const siliconPerUnit = line.specialization === 'efficiency' ? 6 : 10;
                        let baseOutput = line.dailyOutput;
                        if (line.specialization === 'speed') baseOutput = Math.floor(baseOutput * 1.5);
                        else if (line.specialization === 'quality') baseOutput = Math.floor(baseOutput * 0.7);

                        // Apply Brand Bonus to effective output (simulating higher demand clearing stock faster)
                        // Note: This is a simplification. Ideally, demand should be separate.
                        // For now, we assume production is the bottleneck, but high demand allows selling more if we had it?
                        // Actually, let's keep production as is, but sales logic below should use brandBonus.

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

                // Competitor Simulation (Daily)
                let competitors = [...prev.competitors];

                // 1. Competitor Earnings
                competitors = competitors.map(comp => {
                    let dailyRevenue = 0;
                    Object.values(ProductType).forEach(type => {
                        // Revenue based on market share. 
                        // Base market size approx $10M/day distributed.
                        const marketSize = 10000000;
                        const share = comp.marketShare[type] / 100;
                        dailyRevenue += marketSize * share * 0.01; // 1% profit margin for simplicity
                    });

                    const newMoney = comp.money + dailyRevenue;
                    const newHistory = [...(comp.history || []), newMoney].slice(-30); // Keep last 30 days

                    return { ...comp, money: newMoney, history: newHistory };
                });

                // 2. Competitor Actions (Every 5 days)
                if (newDay % 5 === 0 && competitors.length > 0) {
                    competitors = competitors.map(comp => {
                        const newComp = { ...comp };

                        // Check for Product Release
                        // Needs: Money > $1M, Time since last release > 30 days
                        const daysSinceRelease = newDay - (newComp.lastReleaseDay || -999);
                        if (newComp.money > 1000000 && daysSinceRelease > 30) {
                            // Release Logic
                            if (Math.random() < 0.3) { // 30% chance if conditions met
                                newComp.money -= 1000000; // Cost of launch
                                newComp.lastReleaseDay = newDay;

                                // Pick a product type to upgrade
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

                    // Recalculate market share
                    Object.values(ProductType).forEach(type => {
                        const playerQuality = prev.techLevels[type] * 10 + 50;
                        const playerAwareness = brandAwareness[type] || 0;
                        // Brand Awareness significantly boosts player score now
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

                // Assemble new state
                return {
                    ...prev,
                    day: newDay,
                    money: newMoney,
                    silicon: prev.silicon - productionSiliconConsumed,
                    inventory: newInventory,
                    rp: prev.rp + rpGain,
                    siliconPrice: newSiliconPrice,
                    marketMultiplier: newMultiplier,
                    currentEraId,
                    activeTrendId,
                    activeRivalLaunch,
                    financialHistory,
                    stocks: newStocks,
                    activeContracts: keptContracts,
                    availableContracts,
                    activeEvent,
                    reputation: Math.min(100, Math.max(0, prev.reputation - repPenalty)),
                    staffMorale: newMorale,
                    researchers: newResearchers,
                    playerSharePrice:
                        (newMoney + prev.rp * 10 + prev.reputation * 2000 + prev.techLevels.CPU * 50000) / 10000,
                    bankruptcyTimer: newBankruptcyTimer,
                    globalTechLevels: { [ProductType.CPU]: newGlobalTechCPU, [ProductType.GPU]: newGlobalTechGPU },
                    unlockedTabs: currentUnlocked,
                    logs: newLogs.slice(-10),
                    activeCampaigns,
                    brandAwareness,
                    competitors,
                    productionLines: updatedProductionLines,
                    boardMissions,
                    marketSaturation: newSaturation,
                };
            });
        };

        const interval = setInterval(
            tick,
            gameState.gameSpeed === 'fast'
                ? TICK_RATE_MS / 3
                : gameState.gameSpeed === 'normal'
                    ? TICK_RATE_MS * 4.0
                    : TICK_RATE_MS
        );
        return () => clearInterval(interval);
    }, [
        gameState.gameSpeed,
        gameState.activeContracts,
        gameState.activeEvent,
        gameState.hacking.active,
        setGameState,
        playSfx,
        vibrate,
        onShowFloatingText
    ]);
};
