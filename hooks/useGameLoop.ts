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
    TICK_RATE_MS
} from '../constants';
import { getReputationBonuses } from '../utils/gameUtils';

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
                if (prev.stage === 'menu' || prev.gameSpeed === 'paused' || prev.hacking.active || prev.offlineReport || prev.activeEvent) return prev;

                const bonuses = getReputationBonuses(prev.reputation);
                let newMoney = prev.money;
                const newDay = prev.day + 1;
                let newLogs = [...prev.logs];
                let activeEvent = prev.activeEvent;

                let newBankruptcyTimer = prev.bankruptcyTimer;
                if (newMoney < 0) {
                    newBankruptcyTimer += 1;
                    if (newBankruptcyTimer === 1 || newBankruptcyTimer % 10 === 0) {
                        playSfx('error');
                        vibrate('error');
                        newLogs.push({ id: Date.now(), message: TRANSLATIONS[prev.language].bankruptcyWarning + ` (${60 - newBankruptcyTimer} days left)`, type: 'danger', timestamp: `Day ${newDay}` });
                    }
                    if (newBankruptcyTimer >= 60) {
                        vibrate('error');
                        return { ...prev, stage: 'game_over' as any };
                    }
                } else {
                    newBankruptcyTimer = 0;
                }

                let dailyLoanCost = 0;
                prev.loans.forEach(loan => dailyLoanCost += loan.dailyPayment);

                let salaryMultiplier = 1.0;
                if (prev.workPolicy === 'relaxed') salaryMultiplier = 0.8;
                if (prev.workPolicy === 'crunch') salaryMultiplier = 1.5;

                const staffCost = prev.researchers * RESEARCHER_DAILY_SALARY * salaryMultiplier;

                let heroSalary = 0;
                prev.hiredHeroes.forEach(hId => {
                    const hero = HEROES.find(h => h.id === hId);
                    if (hero) heroSalary += hero.dailySalary;
                });

                const totalDailyExpenses = staffCost + heroSalary + dailyLoanCost;
                newMoney -= totalDailyExpenses;

                if (dailyLoanCost > 0 && newDay % 7 === 0) {
                    newLogs.push({ id: Date.now(), message: `Bank: Weekly interest deducted.`, type: 'info', timestamp: `Day ${newDay}` });
                }

                const office = OFFICE_CONFIGS[prev.officeLevel];
                if (newDay % 7 === 0 && office.rent > 0) {
                    newMoney -= office.rent;
                    newLogs.push({ id: Date.now(), message: `Office Rent Paid.`, type: 'info', timestamp: `Day ${newDay}` });
                }

                // OPTIMIZATION: Limit logs to last 50
                if (newLogs.length > 50) {
                    newLogs = newLogs.slice(newLogs.length - 50);
                }

                const targetMultiplier = 0.95;
                const diff = targetMultiplier - prev.marketMultiplier;
                const elasticity = diff * 0.05;
                const noise = (Math.random() - 0.5) * 0.1;
                let newMultiplier = prev.marketMultiplier + elasticity + noise;
                newMultiplier = Math.max(0.5, Math.min(1.6, newMultiplier));

                if (newMultiplier > 1.4 && prev.marketMultiplier <= 1.4) {
                    const msg = FLAVOR_TEXTS.marketBoom[Math.floor(Math.random() * FLAVOR_TEXTS.marketBoom.length)];
                    newLogs.push({ id: Date.now(), message: msg, type: 'success', timestamp: `Day ${newDay}` });
                    vibrate('success');
                }
                if (newMultiplier < 0.7 && prev.marketMultiplier >= 0.7) {
                    const msg = FLAVOR_TEXTS.marketCrash[Math.floor(Math.random() * FLAVOR_TEXTS.marketCrash.length)];
                    newLogs.push({ id: Date.now(), message: msg, type: 'danger', timestamp: `Day ${newDay}` });
                    vibrate('error');
                }

                let targetSiliconPrice = BASE_SILICON_PRICE * newMultiplier;
                let currentTrend = prev.activeTrendId;
                let trendMod = 1.0;
                if (currentTrend === 'trend_crypto') trendMod = 4.0;
                else if (currentTrend === 'trend_gamer') trendMod = 2.5;
                else if (currentTrend === 'trend_green') trendMod = 0.8;
                if (prev.activeEvent?.id === 'evt_shortage') trendMod *= 3.0;

                targetSiliconPrice = targetSiliconPrice * trendMod;
                let newSiliconPrice = (prev.siliconPrice * 0.9) + (targetSiliconPrice * 0.1);
                newSiliconPrice += (Math.random() - 0.5);
                newSiliconPrice = Math.max(3, Math.min(200, newSiliconPrice));

                if (newSiliconPrice > 50 && prev.siliconPrice <= 50) {
                    const msg = FLAVOR_TEXTS.siliconSpike[Math.floor(Math.random() * FLAVOR_TEXTS.siliconSpike.length)];
                    newLogs.push({ id: Date.now(), message: msg, type: 'warning', timestamp: `Day ${newDay}` });
                }

                // Küresel Teknoloji (DÜZELTİLDİ)
                const progressChance = 0.002 + (prev.day * 0.00005);
                let newGlobalTechCPU = prev.globalTechLevels.CPU;
                let newGlobalTechGPU = prev.globalTechLevels.GPU;

                if (Math.random() < progressChance && newGlobalTechCPU < CPU_TECH_TREE.length - 1) {
                    newGlobalTechCPU += 1;
                    newLogs.push({ id: Date.now(), message: `Global Tech Advance: Competitors launched Tier ${newGlobalTechCPU} CPU!`, type: 'warning', timestamp: `Day ${newDay}` });
                }
                if (Math.random() < progressChance && newGlobalTechGPU < GPU_TECH_TREE.length - 1) {
                    newGlobalTechGPU += 1;
                    newLogs.push({ id: Date.now(), message: `Global Tech Advance: Competitors launched Tier ${newGlobalTechGPU} GPU!`, type: 'warning', timestamp: `Day ${newDay}` });
                }

                const nextEra = ERAS.find(e => e.startDay === newDay);
                let currentEraId = prev.currentEraId;
                if (nextEra) {
                    currentEraId = nextEra.id;
                    newLogs.push({ id: Date.now(), message: `ERA CHANGE: ${nextEra.name} has begun!`, type: 'info', timestamp: `Day ${newDay}` });
                    vibrate('medium');
                }

                let activeTrendId = prev.activeTrendId;
                if (newDay % 45 === 0) {
                    const possibleTrends = MARKET_TRENDS.filter(t => t.id !== activeTrendId);
                    const nextTrend = possibleTrends[Math.floor(Math.random() * possibleTrends.length)];
                    activeTrendId = nextTrend.id;
                    newLogs.push({ id: Date.now(), message: `MARKET SHIFT: ${nextTrend.name}!`, type: 'warning', timestamp: `Day ${newDay}` });
                    vibrate('medium');
                }

                let activeRivalLaunch = prev.activeRivalLaunch;
                if (activeRivalLaunch) {
                    activeRivalLaunch = { ...activeRivalLaunch, daysRemaining: activeRivalLaunch.daysRemaining - 1 };
                    if (activeRivalLaunch.daysRemaining <= 0) {
                        activeRivalLaunch = null;
                    }
                } else if (newDay > 20 && Math.random() < 0.015) {
                    const rivalStock = prev.stocks[Math.floor(Math.random() * prev.stocks.length)];
                    activeRivalLaunch = {
                        id: `launch_${newDay}`,
                        companyName: rivalStock.name,
                        productName: `Killer-X`,
                        effect: 0.6,
                        daysRemaining: 10
                    };
                    newLogs.push({ id: Date.now(), message: `RIVAL ALERT: ${rivalStock.name} launched a new product!`, type: 'danger', timestamp: `Day ${newDay}` });
                    vibrate('heavy');
                }

                let financialHistory = [...prev.financialHistory];
                if (newDay % 5 === 0) {
                    financialHistory.push({ day: newDay, money: newMoney });
                    if (financialHistory.length > 30) financialHistory.shift();
                }

                let moraleChange = 0;
                let rpPolicyMult = 1.0;
                if (prev.researchers > 0) {
                    if (prev.workPolicy === 'relaxed') {
                        moraleChange = 0.5; // High morale gain
                        rpPolicyMult = 0.7; // Low output
                    } else if (prev.workPolicy === 'normal') {
                        moraleChange = -0.1; // Slight morale loss
                        rpPolicyMult = 1; // Normal output
                    } else if (prev.workPolicy === 'crunch') {
                        moraleChange = -1; // Significant morale loss
                        rpPolicyMult = 1.6; // High output
                    }
                }
                let newMorale = Math.min(100, Math.max(0, prev.staffMorale + moraleChange));
                let newResearchers = prev.researchers;

                // Nuanced Resignation Logic
                if (newResearchers > 0) {
                    let resignedCount = 0;
                    let resignMessage = "";

                    if (newMorale < 15) {
                        // Critical: Very high chance (20%) of losing staff constantly
                        if (Math.random() < 0.2) {
                            resignedCount = 1;
                            resignMessage = "CRITICAL: Toxic environment causing rapid staff turnover!";
                        }
                    } else if (newMorale < 20) {
                        // High Danger: 10% chance of losing 3 staff
                        if (Math.random() < 0.1) {
                            resignedCount = 3;
                            resignMessage = "MASS RESIGNATION: 3 researchers quit in protest!";
                        }
                    } else if (newMorale < 25) {
                        // Danger: 5% chance of losing 2-3 staff
                        if (Math.random() < 0.05) {
                            resignedCount = 2 + Math.floor(Math.random() * 2);
                            resignMessage = `BAD MORALE: ${resignedCount} researchers walked out.`;
                        }
                    } else if (newMorale < 35 && newMorale >= 30) {
                        // Warning: 2% chance of losing 1 staff
                        if (Math.random() < 0.02) {
                            resignedCount = 1;
                            resignMessage = "RESIGNATION: A researcher left for a better offer.";
                        }
                    }

                    if (resignedCount > 0) {
                        newResearchers = Math.max(0, newResearchers - resignedCount);
                        const flavorText = FLAVOR_TEXTS.staffResign[Math.floor(Math.random() * FLAVOR_TEXTS.staffResign.length)];
                        activeEvent = {
                            id: `resign_${Date.now()}`,
                            title: resignMessage,
                            description: flavorText,
                            type: "negative"
                        };
                        playSfx('error');
                        vibrate('heavy');
                        newLogs.push({ id: Date.now(), message: resignMessage, type: 'danger', timestamp: `Day ${newDay}` });
                    }
                }

                const moraleEfficiency = newMorale / 100;
                const rpModifier = prev.hiredHeroes.includes('hero_linus') ? 2 : 1;
                const prestigeMult = 1 + (prev.prestigePoints * 0.01);
                const rpGain = prev.researchers * RP_PER_RESEARCHER_PER_DAY * rpModifier * prestigeMult * bonuses.researchBonus * rpPolicyMult * (0.5 + (moraleEfficiency * 0.5));

                const volMult = prev.hiredHeroes.includes('hero_elon') ? 2.0 : 1.0;
                const newStocks = prev.stocks.map(stock => {
                    const changePercent = (Math.random() - 0.5) * stock.volatility * volMult;
                    let newPrice = stock.currentPrice * (1 + changePercent);
                    newPrice = Math.max(1, newPrice);
                    const newHistory = [...stock.history, newPrice].slice(-10);
                    return { ...stock, currentPrice: newPrice, history: newHistory };
                });

                let currentUnlocked = [...prev.unlockedTabs];
                let newTabUnlocked = false;
                if (!currentUnlocked.includes('rnd') && newMoney >= 10000) {
                    currentUnlocked.push('rnd');
                    newLogs.push({ id: Date.now(), message: "R&D Dept. Established.", type: 'success', timestamp: `Day ${newDay}` });
                    newTabUnlocked = true;
                }
                if (!currentUnlocked.includes('finance') && newMoney >= 50000) {
                    currentUnlocked.push('finance');
                    newLogs.push({ id: Date.now(), message: "Finance Dept. Established. IPO ready.", type: 'success', timestamp: `Day ${newDay}` });
                    newTabUnlocked = true;
                }
                if (newTabUnlocked) {
                    playSfx('success');
                    vibrate('medium');
                }

                let activeContracts = [...prev.activeContracts];
                const keptContracts: Contract[] = [];
                let repPenalty = 0;
                activeContracts.forEach(contract => {
                    if (newDay > contract.deadlineDay) {
                        newMoney -= contract.penalty;
                        repPenalty += 10;
                        playSfx('error');
                        vibrate('error');
                        newLogs.push({ id: Date.now(), message: `Contract FAILED! Client furious.`, type: 'danger', timestamp: `Day ${newDay}` });
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
                        title: `ORDER: ${amount}x ${type}`,
                        description: `Deadline: 10 Days`,
                        requiredProduct: type,
                        requiredAmount: amount,
                        fulfilledAmount: 0,
                        reward: Math.floor(reward),
                        penalty: Math.floor(reward * 0.4),
                        deadlineDay: newDay + 10
                    });
                    if (availableContracts.length > 3) availableContracts.shift();
                }

                const isActivePlayer = prev.inventory.CPU > 0 || prev.inventory.GPU > 0;
                if (!activeEvent && isActivePlayer && Math.random() < 0.02) {
                    const eventTemplate = POTENTIAL_EVENTS[Math.floor(Math.random() * POTENTIAL_EVENTS.length)];
                    activeEvent = eventTemplate;
                    playSfx('error');
                    vibrate('medium');
                }

                // --- Production Logic with Efficiency ---
                let productionSiliconConsumed = 0;
                let productionOutput: Record<ProductType, number> = { [ProductType.CPU]: 0, [ProductType.GPU]: 0 };

                // Update production lines: degrade efficiency and calculate output
                const updatedProductionLines = prev.productionLines.map(line => {
                    if (line.status === 'producing') {
                        // Efficiency degradation: 1-2% per day
                        const degradation = Math.random() * 1 + 1; // 1-2%
                        const newEfficiency = Math.max(0, line.efficiency - degradation);

                        // Calculate actual output based on efficiency
                        const siliconPerUnit = line.specialization === 'efficiency' ? 6 : 10; // -40% for efficiency lines
                        let baseOutput = line.dailyOutput;

                        // Apply specialization modifiers
                        if (line.specialization === 'speed') {
                            baseOutput = Math.floor(baseOutput * 1.5); // +50% output
                        } else if (line.specialization === 'quality') {
                            baseOutput = Math.floor(baseOutput * 0.7); // -30% output
                        }

                        // Apply efficiency modifier
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
                Object.keys(productionOutput).forEach(key => {
                    const type = key as ProductType;
                    newInventory[type] += productionOutput[type];
                });

                // Marketing Logic
                const activeCampaigns = (prev.activeCampaigns || [])
                    .map(c => ({ ...c, daysRemaining: c.daysRemaining - 1 }))
                    .filter(c => c.daysRemaining > 0);

                // Brand Awareness Decay (weekly)
                const brandAwareness = { ...prev.brandAwareness };
                if (newDay % 7 === 0) {
                    Object.keys(brandAwareness).forEach(key => {
                        const type = key as ProductType;
                        brandAwareness[type] = Math.max(0, brandAwareness[type] - 2);
                    });
                }

                // Competitor Simulation
                let competitors = [...prev.competitors];
                if (newDay % 5 === 0 && competitors.length > 0) {
                    competitors = competitors.map(comp => {
                        const newComp = { ...comp };

                        // Quality improvement (simulated R&D)
                        Object.keys(newComp.productQuality).forEach(key => {
                            const type = key as ProductType;
                            const improvementRate = (newComp.aggressiveness / 100) * 0.5 + 0.3;
                            newComp.productQuality[type] = Math.min(100, newComp.productQuality[type] + improvementRate);
                        });

                        // Tech level advancement (rare)
                        if (Math.random() < 0.05) {
                            Object.keys(newComp.techLevel).forEach(key => {
                                const type = key as ProductType;
                                if (newComp.techLevel[type] < prev.globalTechLevels[type]) {
                                    newComp.techLevel[type] += 1;
                                    newLogs.push({
                                        id: Date.now() + Math.random(),
                                        message: `${newComp.name} upgraded their ${type} technology!`,
                                        type: 'warning',
                                        timestamp: `Day ${newDay}`
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
                            const compScore = comp.productQuality[type] * (1 + comp.marketShare[type] / 200);
                            totalScore += compScore;
                            return { id: comp.id, score: compScore };
                        });

                        if (totalScore > 0) {
                            const playerShare = (playerScore / totalScore) * 100;

                            competitors = competitors.map(comp => {
                                const compData = competitorScores.find(c => c.id === comp.id);
                                const newShare = compData ? (compData.score / totalScore) * 100 : comp.marketShare[type];
                                return {
                                    ...comp,
                                    marketShare: { ...comp.marketShare, [type]: Math.max(0, Math.min(100, newShare)) }
                                };
                            });
                        }
                    });
                }

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
                    playerSharePrice: (newMoney + (prev.rp * 10) + (prev.reputation * 2000) + (prev.techLevels.CPU * 50000)) / 10000,
                    bankruptcyTimer: newBankruptcyTimer,
                    globalTechLevels: {
                        [ProductType.CPU]: newGlobalTechCPU,
                        [ProductType.GPU]: newGlobalTechGPU
                    },
                    unlockedTabs: currentUnlocked,
                    logs: newLogs.slice(-10),
                    activeCampaigns,
                    brandAwareness,
                    competitors,
                    productionLines: updatedProductionLines
                };
            });
        };
        const interval = setInterval(tick, gameState.gameSpeed === 'fast' ? TICK_RATE_MS / 3 : TICK_RATE_MS);
        return () => clearInterval(interval);
    }, [gameState.gameSpeed, gameState.activeContracts, gameState.activeEvent, gameState.hacking.active, setGameState, playSfx, vibrate]);
};
