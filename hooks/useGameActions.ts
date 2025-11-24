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
    MAX_ACTIVE_LOANS
} from '../constants';
import { getReputationBonuses } from '../utils/gameUtils';

export const useGameActions = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    setActiveTab: (tab: TabType) => void,
    playSfx: (sfx: any) => void,
    vibrate: (type: any) => void
) => {

    const handleTabSwitch = useCallback((tab: TabType) => {
        playSfx('click');
        vibrate('light');
        setActiveTab(tab);
    }, [setActiveTab, playSfx, vibrate]);

    const handleProduce = useCallback((type: ProductType, amount: number, cost: number) => {
        setGameState(prev => {
            if (prev.silicon < amount) {
                playSfx('error');
                vibrate('error');
                return prev;
            }
            playSfx('click');
            vibrate('light');

            const spec = prev.designSpecs[type];
            const defectChance = prev.productionQuality === 'high' ? 0.01 : prev.productionQuality === 'medium' ? 0.05 : 0.20;
            const defectiveAmount = Math.floor(amount * Math.random() * defectChance);
            const successfulAmount = amount - defectiveAmount;
            let repChange = 0;
            if (defectiveAmount > 0) repChange -= 1;
            if (prev.productionQuality === 'high') repChange += 0.5;

            let remainingAmount = successfulAmount;
            const newContracts = prev.activeContracts.map(c => {
                if (c.requiredProduct === type && remainingAmount > 0 && c.fulfilledAmount < c.requiredAmount) {
                    const take = Math.min(remainingAmount, c.requiredAmount - c.fulfilledAmount);
                    remainingAmount -= take;
                    return { ...c, fulfilledAmount: c.fulfilledAmount + take };
                }
                return c;
            });

            const bonuses = getReputationBonuses(prev.reputation);
            let moneyChange = -cost;
            const completedContractIds: string[] = [];
            let repGainFromContracts = 0;

            newContracts.forEach(c => {
                if (c.fulfilledAmount >= c.requiredAmount) {
                    moneyChange += c.reward * bonuses.contractBonus;
                    completedContractIds.push(c.id);
                    repGainFromContracts += 5;
                    playSfx('success');
                    vibrate('success');
                }
            });

            let newLogs = [...prev.logs];
            if (defectiveAmount > 0) newLogs.push({ id: Date.now(), message: `${defectiveAmount} defects reported.`, type: 'danger' as const, timestamp: `Day ${prev.day}` });
            if (completedContractIds.length > 0) newLogs.push({ id: Date.now(), message: `Contract Fulfilled! Payment received.`, type: 'success' as const, timestamp: `Day ${prev.day}` });

            return {
                ...prev,
                money: prev.money + moneyChange,
                silicon: prev.silicon - amount,
                inventory: { ...prev.inventory, [type]: prev.inventory[type] + remainingAmount },
                activeContracts: newContracts.filter(c => !completedContractIds.includes(c.id)),
                reputation: Math.min(100, Math.max(0, prev.reputation + repChange + repGainFromContracts)),
                logs: newLogs.slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate]);

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
            playSfx('money');
            vibrate('medium');

            const bonuses = getReputationBonuses(prev.reputation);
            const finalPrice = Math.floor(currentPrice * bonuses.priceBonus);
            let repGain = 0;
            if (count > 10 && Math.random() < 0.1) repGain = 1;

            return {
                ...prev,
                money: prev.money + (count * finalPrice),
                inventory: { ...prev.inventory, [type]: 0 },
                reputation: Math.min(100, prev.reputation + repGain),
                logs: [...prev.logs, { id: Date.now(), message: `Sold ${count}x ${type} units.`, type: 'success' as const, timestamp: `Day ${prev.day}` }].slice(-10)
            }
        });
    }, [setGameState, playSfx, vibrate]);

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
                return { ...prev, logs: [...prev.logs, { id: Date.now(), message: `Warehouse Full! Upgrade needed.`, type: 'warning' as const, timestamp: `Day ${prev.day}` }].slice(-10) };
            }
            playSfx('click');
            vibrate('light');
            return { ...prev, money: prev.money - cost, silicon: prev.silicon + amount };
        });
    }, [setGameState, playSfx, vibrate]);

    const handleUpgradeOffice = useCallback(() => {
        setGameState(prev => {
            const nextLevel = (prev.officeLevel + 1) as OfficeLevel;
            const config = OFFICE_CONFIGS[prev.officeLevel];
            if (prev.money >= config.upgradeCost) {
                playSfx('success');
                vibrate('success');
                return {
                    ...prev,
                    money: prev.money - config.upgradeCost,
                    officeLevel: nextLevel,
                    logs: [...prev.logs, { id: Date.now(), message: `HQ Upgraded to ${OFFICE_CONFIGS[nextLevel].name}!`, type: 'success' as const, timestamp: `Day ${prev.day}` }].slice(-10)
                };
            }
            playSfx('error');
            vibrate('error');
            return prev;
        });
    }, [setGameState, playSfx, vibrate]);

    const handleAcceptContract = useCallback((contractId: string) => {
        playSfx('click');
        setGameState(prev => {
            const contract = prev.availableContracts.find(c => c.id === contractId);
            if (!contract) return prev;
            return {
                ...prev,
                activeContracts: [...prev.activeContracts, contract],
                availableContracts: prev.availableContracts.filter(c => c.id !== contractId)
            };
        });
    }, [setGameState, playSfx]);

    const handleEventDismiss = useCallback(() => {
        playSfx('click');
        setGameState(prev => {
            if (prev.activeEvent?.effect) {
                const changes = prev.activeEvent.effect(prev);
                return { ...prev, ...changes, activeEvent: null };
            }
            return { ...prev, activeEvent: null };
        });
    }, [setGameState, playSfx]);

    const handleResearch = useCallback((type: ProductType, nextLevelIndex: number, cost: number) => {
        setGameState(prev => {
            if (prev.rp < cost) {
                playSfx('error');
                vibrate('error');
                return prev;
            }
            playSfx('success');
            vibrate('medium');
            let prestigeGain = 0;
            if (nextLevelIndex > prev.globalTechLevels[type]) prestigeGain = 10;
            const msg = prestigeGain > 0 ? `Tech Breakthrough! Market Leader! (+${prestigeGain} Prestige)` : `Tech Unlocked!`;

            return {
                ...prev,
                rp: prev.rp - cost,
                prestigePoints: prev.prestigePoints + prestigeGain,
                techLevels: { ...prev.techLevels, [type]: nextLevelIndex },
                logs: [...prev.logs, { id: Date.now(), message: msg, type: 'success' as const, timestamp: `Day ${prev.day}` }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate]);

    const handleHireResearcher = useCallback((cost: number) => {
        setGameState(prev => {
            const office = OFFICE_CONFIGS[prev.officeLevel];
            if (prev.researchers >= office.maxResearchers || prev.money < cost) {
                playSfx('error');
                return prev;
            }
            playSfx('click');
            vibrate('light');
            return { ...prev, money: prev.money - cost, researchers: prev.researchers + 1 };
        });
    }, [setGameState, playSfx, vibrate]);

    const handleHireHero = useCallback((heroId: string) => {
        setGameState(prev => {
            const hero = HEROES.find(h => h.id === heroId);
            if (!hero || prev.money < hero.hiringCost) return prev;
            playSfx('success');
            vibrate('success');
            return {
                ...prev,
                money: prev.money - hero.hiringCost,
                hiredHeroes: [...prev.hiredHeroes, heroId],
                logs: [...prev.logs, { id: Date.now(), message: `Headhunted ${hero.name}!`, type: 'success' as const, timestamp: `Day ${prev.day}` }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate]);

    const handleFireResearcher = useCallback(() => {
        setGameState(prev => {
            if (prev.researchers <= 0) return prev;
            const severancePay = 500;
            const newMorale = Math.max(0, prev.staffMorale - 5);
            playSfx('error');
            vibrate('medium');
            return {
                ...prev,
                money: prev.money - severancePay,
                researchers: prev.researchers - 1,
                staffMorale: newMorale,
                logs: [...prev.logs, { id: Date.now(), message: TRANSLATIONS[prev.language].firedAlert, type: 'warning' as const, timestamp: `Day ${prev.day}` }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate]);

    const handleSetWorkPolicy = useCallback((policy: 'relaxed' | 'normal' | 'crunch') => {
        playSfx('click');
        setGameState(prev => ({ ...prev, workPolicy: policy }));
    }, [setGameState, playSfx]);

    const handleBuyStock = useCallback((id: string, amt: number) => {
        setGameState(prev => {
            const stock = prev.stocks.find(s => s.id === id);
            if (!stock || prev.money < stock.currentPrice * amt) {
                playSfx('error');
                return prev;
            }
            playSfx('click');
            return {
                ...prev,
                money: prev.money - (stock.currentPrice * amt),
                stocks: prev.stocks.map(s => s.id === id ? { ...s, owned: s.owned + amt } : s)
            };
        });
    }, [setGameState, playSfx]);

    const handleSellStock = useCallback((id: string, amt: number) => {
        setGameState(prev => {
            const stock = prev.stocks.find(s => s.id === id);
            if (!stock || stock.owned < amt) {
                playSfx('error');
                return prev;
            }
            playSfx('money');
            return {
                ...prev,
                money: prev.money + (stock.currentPrice * amt),
                stocks: prev.stocks.map(s => s.id === id ? { ...s, owned: s.owned - amt } : s)
            };
        });
    }, [setGameState, playSfx]);

    const handleIPO = useCallback(() => {
        playSfx('success');
        vibrate('success');
        setGameState(prev => ({ ...prev, money: prev.money + 50000, isPubliclyTraded: true, playerCompanySharesOwned: 60, logs: [...prev.logs, { id: Date.now(), message: "IPO Launched! Ticker: SILC", type: 'success' as const, timestamp: `Day ${prev.day}` }].slice(-10) }));
    }, [setGameState, playSfx, vibrate]);

    const handleCovertOpTrigger = useCallback((type: 'espionage' | 'sabotage', targetId: string) => {
        const cost = type === 'espionage' ? 10000 : 25000;
        setGameState(prev => {
            if (prev.money < cost) {
                playSfx('error');
                return { ...prev, logs: [...prev.logs, { id: Date.now(), message: "Insufficient Funds for Operation", type: 'danger' as const, timestamp: `Day ${prev.day}` }].slice(-10) };
            }
            playSfx('click');
            return {
                ...prev,
                hacking: { active: true, type, difficulty: prev.reputation > 50 ? 1 : 2, targetId }
            };
        });
    }, [setGameState, playSfx]);

    const handleHackingComplete = useCallback((success: boolean) => {
        setGameState(prev => {
            const { type, targetId } = prev.hacking;
            const cost = type === 'espionage' ? 10000 : 25000;
            let newState = { ...prev, money: prev.money - cost, hacking: { ...prev.hacking, active: false } };
            const targetStock = prev.stocks.find(s => s.id === targetId);
            const targetName = targetStock ? targetStock.name : "Rival";

            if (success) {
                playSfx('success');
                vibrate('success');
                if (type === 'espionage') {
                    newState.rp += 1000;
                    if (targetStock) {
                        newState.stocks = prev.stocks.map(s => s.id === targetId ? { ...s, currentPrice: Math.max(1, s.currentPrice * 0.95) } : s);
                    }
                    newState.logs = [...newState.logs, { id: Date.now(), message: `Espionage success! Stole tech from ${targetName}.`, type: 'success' as const, timestamp: `Day ${prev.day}` }].slice(-10);
                } else {
                    if (targetStock) {
                        newState.stocks = prev.stocks.map(s => s.id === targetId ? { ...s, currentPrice: Math.max(1, s.currentPrice * 0.70) } : s);
                    }
                    newState.logs = [...newState.logs, { id: Date.now(), message: `Sabotage success! ${targetName} stock crashed!`, type: 'success' as const, timestamp: `Day ${prev.day}` }].slice(-10);
                }
            } else {
                playSfx('error');
                vibrate('error');
                newState.reputation = Math.max(0, newState.reputation - (type === 'espionage' ? 10 : 25));
                newState.logs = [...newState.logs, { id: Date.now(), message: `Op Failed! ${targetName} traced you.`, type: 'danger' as const, timestamp: `Day ${prev.day}` }].slice(-10);
            }
            return newState;
        });
    }, [setGameState, playSfx, vibrate]);

    const handleRetire = useCallback(() => {
        playSfx('success');
        setGameState(prev => {
            const companyValuation = prev.money + (prev.techLevels[ProductType.CPU] * 5000) + (prev.techLevels[ProductType.GPU] * 5000);
            const gainedPoints = Math.floor(companyValuation / 10000);
            return {
                stage: 'game', language: prev.language, day: 1, gameSpeed: 'paused', lastSaveTime: Date.now(),
                money: INITIAL_MONEY + (gainedPoints * 1000), rp: INITIAL_RP, researchers: 0, hiredHeroes: [],
                officeLevel: OfficeLevel.GARAGE, silicon: INITIAL_SILICON, siliconPrice: BASE_SILICON_PRICE, reputation: INITIAL_REPUTATION, productionQuality: 'medium',
                designSpecs: {
                    [ProductType.CPU]: { performance: 50, efficiency: 50 },
                    [ProductType.GPU]: { performance: 50, efficiency: 50 }
                },
                inventory: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
                techLevels: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
                currentEraId: ERAS[0].id, marketMultiplier: 1.0, activeTrendId: MARKET_TRENDS[0].id, activeRivalLaunch: null, financialHistory: [{ day: 1, money: INITIAL_MONEY + (gainedPoints * 1000) }],
                activeContracts: [], availableContracts: [], stocks: INITIAL_STOCKS, isPubliclyTraded: false, playerCompanySharesOwned: 100, playerSharePrice: 10.0,
                prestigePoints: prev.prestigePoints + gainedPoints, activeEvent: null, productionLines: [],
                globalTechLevels: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
                unlockedTabs: ['factory', 'market'],
                logs: [{ id: Date.now(), message: `${TRANSLATIONS[prev.language].newRun} ${prev.prestigePoints + gainedPoints}`, type: 'info' as const, timestamp: `${TRANSLATIONS[prev.language].day} 1` }],
                loans: [], staffMorale: 100, workPolicy: 'normal', bankruptcyTimer: 0,

                hacking: { active: false, type: 'espionage', difficulty: 1 },
                offlineReport: null,
                activeCampaigns: [],
                brandAwareness: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
                competitors: []
            };
        });
    }, [setGameState, playSfx]);

    const handleTakeLoan = useCallback((amount: number) => {
        setGameState(prev => {
            const t = TRANSLATIONS[prev.language];
            if (prev.loans.length >= MAX_ACTIVE_LOANS) {
                playSfx('error');
                return { ...prev, logs: [...prev.logs, { id: Date.now(), message: t.loanRejectedLimit, type: 'danger' as const, timestamp: `${t.day} ${prev.day}` }].slice(-10) };
            }

            let requiredLevel = 0;
            if (amount === 50000) requiredLevel = 2;
            if (amount === 100000) requiredLevel = 3;
            if (amount === 500000) requiredLevel = 4;
            if (prev.officeLevel < requiredLevel) {
                playSfx('error');
                return { ...prev, logs: [...prev.logs, { id: Date.now(), message: t.loanRejectedOffice, type: 'danger' as const, timestamp: `${t.day} ${prev.day}` }].slice(-10) };
            }
            playSfx('money');
            vibrate('medium');
            const interestRate = 0.015;
            const dailyPayment = Math.floor(amount * interestRate);
            const newLoan: Loan = { id: `loan_${Date.now()}`, amount, interestRate, dailyPayment };
            return { ...prev, money: prev.money + amount, loans: [...prev.loans, newLoan], logs: [...prev.logs, { id: Date.now(), message: t.loanApproved, type: 'warning' as const, timestamp: `${t.day} ${prev.day}` }].slice(-10) };
        });
    }, [setGameState, playSfx, vibrate]);

    const handlePayLoan = useCallback((loanId: string) => {
        setGameState(prev => {
            const t = TRANSLATIONS[prev.language];
            const loan = prev.loans.find(l => l.id === loanId);
            if (!loan || prev.money < loan.amount) {
                playSfx('error');
                return prev;
            }
            playSfx('money');
            return { ...prev, money: prev.money - loan.amount, loans: prev.loans.filter(l => l.id !== loanId), logs: [...prev.logs, { id: Date.now(), message: t.loanRepaid, type: 'success' as const, timestamp: `${t.day} ${prev.day}` }].slice(-10) };
        });
    }, [setGameState, playSfx]);

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
                return { ...prev, money: prev.money - cost, playerCompanySharesOwned: Math.min(100, prev.playerCompanySharesOwned + percent), logs: [...prev.logs, { id: Date.now(), message: `Stock Buyback: +${percent}% Ownership`, type: 'success' as const, timestamp: `Day ${prev.day}` }].slice(-10) };
            } else {
                if (prev.playerCompanySharesOwned <= 10) {
                    playSfx('error');
                    return prev;
                }
                playSfx('money');
                return { ...prev, money: prev.money + cost, playerCompanySharesOwned: Math.max(0, prev.playerCompanySharesOwned - percent), logs: [...prev.logs, { id: Date.now(), message: `Stock Dilution: -${percent}% Ownership`, type: 'warning' as const, timestamp: `Day ${prev.day}` }].slice(-10) };
            }
        });
    }, [setGameState, playSfx]);

    const handleLaunchCampaign = useCallback((campaignId: string, productType: ProductType) => {
        setGameState(prev => {
            const campaign = require('../constants').MARKETING_CAMPAIGNS.find((c: any) => c.id === campaignId);
            if (!campaign || prev.money < campaign.cost) {
                playSfx('error');
                return prev;
            }
            playSfx('success');
            vibrate('medium');

            const newBrandAwareness = { ...prev.brandAwareness };
            newBrandAwareness[productType] = Math.min(100, newBrandAwareness[productType] + campaign.awarenessBoost);

            return {
                ...prev,
                money: prev.money - campaign.cost,
                activeCampaigns: [...prev.activeCampaigns, { id: campaignId, daysRemaining: campaign.duration }],
                brandAwareness: newBrandAwareness,
                logs: [...prev.logs, {
                    id: Date.now(),
                    message: `Launched ${campaign.name} for ${productType}!`,
                    type: 'success' as const,
                    timestamp: `Day ${prev.day}`
                }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate]);

    const handleMaintainLine = useCallback((lineId: string) => {
        setGameState(prev => {
            const line = prev.productionLines.find(l => l.id === lineId);
            if (!line || prev.money < line.maintenanceCost) {
                playSfx('error');
                return prev;
            }

            playSfx('success');
            vibrate('medium');

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
                    message: `Maintained production line. Efficiency restored to 100%.`,
                    type: 'success' as const,
                    timestamp: `Day ${prev.day}`
                }].slice(-10)
            };
        });
    }, [setGameState, playSfx, vibrate]);

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
        handleMaintainLine
    };
};
