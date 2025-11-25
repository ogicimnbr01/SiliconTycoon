// Game Loop Hook
import { useEffect } from 'react';
import { GameState, ProductType, Contract } from '../types';
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
import { getReputationBonuses } from '../utils/gameUtils';

// Helper for string formatting
const format = (str: string, ...args: any[]) => {
    return str.replace(/{(\d+)}/g, (match, number) =>
        typeof args[number] !== 'undefined' ? args[number] : match
    );
};

export const useGameLoop = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    playSfx: (sfx: any) => void,
    vibrate: (type: any) => void
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
                }
                newMoney -= dailyLoanCost;

                // Staff salaries
                let salaryMultiplier = 1.0;
                if (prev.workPolicy === 'relaxed') salaryMultiplier = 0.8;
                if (prev.workPolicy === 'crunch') salaryMultiplier = 1.5;
                const staffCost = prev.researchers * RESEARCHER_DAILY_SALARY * salaryMultiplier;

                // Hero salaries
                let heroSalary = 0;
                prev.hiredHeroes.forEach(hId => {
                    const hero = HEROES.find(h => h.id === hId);
                    if (hero) heroSalary += hero.dailySalary;
                });

                const totalDailyExpenses = staffCost + heroSalary;
                newMoney -= totalDailyExpenses;

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
                    newLogs.push({ id: Date.now(), message: msg, type: 'success', timestamp: `${t.day} ${newDay}` });
                    vibrate('success');
                }
                if (newMultiplier < 0.7 && prev.marketMultiplier >= 0.7) {
                    const msg = flavor.marketCrash[Math.floor(Math.random() * flavor.marketCrash.length)];
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
                const volMult = prev.hiredHeroes.includes('hero_elon') ? 2.0 : 1.0;
                const newStocks = prev.stocks.map(stock => {
                    const change = (Math.random() - 0.5) * stock.volatility * volMult;
                    let price = stock.currentPrice * (1 + change);
                    price = Math.max(1, price);
                    const history = [...stock.history, price].slice(-10);
                    return { ...stock, currentPrice: price, history };
                });

                // Unlock new tabs (R&D, Finance)
                let currentUnlocked = [...prev.unlockedTabs];
                let newTabUnlocked = false;
                if (!currentUnlocked.includes('rnd') && newMoney >= 10000) {
                    currentUnlocked.push('rnd');
                    newLogs.push({ id: Date.now(), message: t.logRdEstablished, type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('finance') && newMoney >= 50000) {
                    currentUnlocked.push('finance');
                    newLogs.push({ id: Date.now(), message: t.logFinanceEstablished, type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('marketing') && newMoney >= 100000) {
                    currentUnlocked.push('marketing');
                    newLogs.push({ id: Date.now(), message: "Marketing Dept. Established", type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('statistics') && newMoney >= 1000) {
                    currentUnlocked.push('statistics');
                    newLogs.push({ id: Date.now(), message: "Analytics Dept. Established", type: 'success', timestamp: `${t.day} ${newDay}` });
                    newTabUnlocked = true;
                }
                if (newTabUnlocked) {
                    playSfx('success');
                    vibrate('medium');
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
                    } else {
                        keptContracts.push(contract);
                    }
                });

                let availableContracts = [...prev.availableContracts];
                if (Math.random() < 0.2) {
                    const type = Math.random() > 0.5 ? ProductType.CPU : ProductType.GPU;
                    const amount = Math.floor(Math.random() * 50) + 10;
                    const techLevel = Math.min(prev.techLevels[type], 2);
                    const reward = amount * (type === ProductType.CPU ? CPU_TECH_TREE[techLevel].baseMarketPrice : GPU_TECH_TREE[techLevel].baseMarketPrice) * 1.3;
                    availableContracts.push({
                        id: `cnt_${Date.now()}`,
                        title: format(t.logContractOrder, amount, type),
                        description: format(t.logContractDeadline, 10),
                        requiredProduct: type,
                        requiredAmount: amount,
                        fulfilledAmount: 0,
                        reward: Math.floor(reward),
                        penalty: Math.floor(reward * 0.4),
                        deadlineDay: newDay + 10,
                    });
                    if (availableContracts.length > 3) availableContracts.shift();
                }

                // Random events
                const isActivePlayer = prev.inventory.CPU > 0 || prev.inventory.GPU > 0;
                if (!activeEvent && isActivePlayer && Math.random() < 0.02) {
                    const ev = POTENTIAL_EVENTS[Math.floor(Math.random() * POTENTIAL_EVENTS.length)];
                    activeEvent = ev;
                    playSfx('error');
                    vibrate('medium');
                }

                // Production logic
                let productionSiliconConsumed = 0;
                const productionOutput: Record<ProductType, number> = { [ProductType.CPU]: 0, [ProductType.GPU]: 0 };
                const updatedProductionLines = prev.productionLines.map(line => {
                    if (line.status === 'producing') {
                        const degradation = Math.random() * 1 + 1; // 1‑2%
                        const newEfficiency = Math.max(0, line.efficiency - degradation);
                        const siliconPerUnit = line.specialization === 'efficiency' ? 6 : 10;
                        let baseOutput = line.dailyOutput;
                        if (line.specialization === 'speed') baseOutput = Math.floor(baseOutput * 1.5);
                        else if (line.specialization === 'quality') baseOutput = Math.floor(baseOutput * 0.7);
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

                // Competitor simulation (every 5 days)
                let competitors = [...prev.competitors];
                if (newDay % 5 === 0 && competitors.length > 0) {
                    competitors = competitors.map(comp => {
                        const newComp = { ...comp };
                        // Quality improvement
                        Object.keys(newComp.productQuality).forEach(k => {
                            const t = k as ProductType;
                            const inc = (newComp.aggressiveness / 100) * 0.5 + 0.3;
                            newComp.productQuality[t] = Math.min(100, newComp.productQuality[t] + inc);
                        });
                        // Rare tech upgrade
                        if (Math.random() < 0.05) {
                            Object.keys(newComp.techLevel).forEach(k => {
                                const prodType = k as ProductType;
                                if (newComp.techLevel[prodType] < prev.globalTechLevels[prodType]) {
                                    newComp.techLevel[prodType] += 1;
                                    newLogs.push({
                                        id: Date.now() + Math.random(),
                                        message: format(t.logGlobalTech, newComp.name, prodType),
                                        type: 'warning',
                                        timestamp: `${t.day} ${newDay}`,
                                    });
                                }
                            });
                        }
                        return newComp;
                    });
                    // Recalculate market share
                    Object.values(ProductType).forEach(type => {
                        const playerQuality = prev.techLevels[type] * 10 + 50;
                        const playerAwareness = brandAwareness[type] || 0;
                        const playerScore = playerQuality * (1 + playerAwareness / 100);
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
    ]);
};
