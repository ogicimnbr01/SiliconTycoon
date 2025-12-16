
import { GameState, ProductType, OfficeLevel, Researcher, Stock, Contract, BoardMission, GameEvent, LogEntry } from '../types.ts';
import {
    INITIAL_GAME_STATE,
    OFFICE_CONFIGS,
    BASE_SILICON_PRICE,
    CPU_TECH_TREE,
    GPU_TECH_TREE,
    ERAS,
    RP_PER_RESEARCHER_PER_DAY,
    MARKET_TRENDS,
    RESEARCHER_DAILY_SALARY,
    POTENTIAL_EVENTS,
    INITIAL_COMPETITORS
} from '../constants.ts';
import { calculateStorageCost, calculateFinalRevenue, getEraTier, ECONOMY_CONFIG } from '../utils/economySystem.ts';
import { getReputationBonuses } from '../utils/gameUtils.ts';
import * as fs from 'fs';

// Helper to clone state
const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

class EconomySimulation {
    state: GameState;
    history: any[] = [];
    dailyStats = {
        producedCPU: 0,
        producedGPU: 0,
        soldCPU: 0,
        soldGPU: 0,
        revenue: 0,
        expenses: 0
    };

    constructor() {
        this.state = clone(INITIAL_GAME_STATE);
        // Ensure some defaults if missing
        if (!this.state.marketSaturation) this.state.marketSaturation = { [ProductType.CPU]: 0, [ProductType.GPU]: 0 };
        if (!this.state.dailyDemand) this.state.dailyDemand = { [ProductType.CPU]: 100, [ProductType.GPU]: 100 };
        if (!this.state.competitors || this.state.competitors.length === 0) this.state.competitors = clone(INITIAL_COMPETITORS);
        if (!this.state.activeContracts) this.state.activeContracts = [];
    }

    log(msg: string) {
        // console.log(`[Day ${this.state.day}] ${msg}`);
    }

    // --- ACTIONS ---

    produce(type: ProductType, amount: number) {
        const siliconCost = amount * 10;
        if (this.state.silicon < siliconCost) return;

        const techTree = type === ProductType.CPU ? CPU_TECH_TREE : GPU_TECH_TREE;
        const currentLevel = this.state.techLevels[type];
        const node = techTree.find(n => n.tier === currentLevel) || techTree[0];
        const yieldRate = node.yield || 100;

        const qualityMod = this.state.productionQuality === 'high' ? 5 : this.state.productionQuality === 'medium' ? 0 : -5;
        const actualYield = Math.min(100, Math.max(10, yieldRate + qualityMod));

        const successfulAmount = Math.floor(amount * (actualYield / 100));
        const wasteAmount = amount - successfulAmount;
        const scrapValue = Math.floor(wasteAmount * (node.baseMarketPrice * 0.2));

        this.state.silicon -= siliconCost;
        this.state.inventory[type] += successfulAmount;
        this.state.money += scrapValue;

        // Track
        if (type === ProductType.CPU) this.dailyStats.producedCPU += successfulAmount;
        else this.dailyStats.producedGPU += successfulAmount;
        this.dailyStats.revenue += scrapValue;
    }

    sell(type: ProductType) {
        const count = this.state.inventory[type];
        if (count <= 0) return;

        const techTree = type === ProductType.CPU ? CPU_TECH_TREE : GPU_TECH_TREE;
        const currentTech = techTree[this.state.techLevels[type]];
        const productTier = currentTech.tier;
        const marketEra = getEraTier(this.state.currentEraId);
        const basePrice = currentTech.baseMarketPrice;
        const adjustedBasePrice = basePrice * this.state.marketMultiplier;

        const result = calculateFinalRevenue({
            basePrice: adjustedBasePrice,
            amount: count,
            productTier,
            productType: type,
            marketEra,
            marketSaturation: this.state.marketSaturation?.[type] ?? 0
        });

        const bonuses = getReputationBonuses(this.state.reputation);
        const finalRevenue = Math.floor(result.revenue * bonuses.priceBonus);

        this.state.money += finalRevenue;
        this.state.inventory[type] = 0;

        const saturationIncrease = count / 1000;
        this.state.marketSaturation[type] = Math.min(1, (this.state.marketSaturation[type] ?? 0) + saturationIncrease);

        // Track
        if (type === ProductType.CPU) this.dailyStats.soldCPU += count;
        else this.dailyStats.soldGPU += count;
        this.dailyStats.revenue += finalRevenue;
    }

    buySilicon(amount: number) {
        const bonuses = getReputationBonuses(this.state.reputation);
        const discountedPrice = this.state.siliconPrice * bonuses.siliconDiscount;
        const cost = Math.floor(amount * discountedPrice);
        const office = OFFICE_CONFIGS[this.state.officeLevel];

        if (this.state.money >= cost && this.state.silicon + amount <= office.siliconCap) {
            this.state.money -= cost;
            this.state.silicon += amount;
            this.dailyStats.expenses += cost;
        }
    }

    research(type: ProductType) {
        const techTree = type === ProductType.CPU ? CPU_TECH_TREE : GPU_TECH_TREE;
        const currentLevel = this.state.techLevels[type];
        const nextLevel = currentLevel + 1;

        if (nextLevel >= techTree.length) return;

        const nextTech = techTree[nextLevel];
        const cost = nextTech.rpCost || nextTech.researchCost;

        if (this.state.rp >= cost) {
            this.state.rp -= cost;
            this.state.techLevels[type] = nextLevel;
            this.log(`Researched ${type} Tier ${nextTech.tier} (${nextTech.name})`);
        }
    }

    hireResearcher() {
        const office = OFFICE_CONFIGS[this.state.officeLevel];
        const currentCount = Array.isArray(this.state.researchers) ? this.state.researchers.length : this.state.researchers;

        if (currentCount >= office.maxResearchers) return;

        const hireCost = 2000;

        if (this.state.money >= hireCost) {
            this.state.money -= hireCost;
            if (typeof this.state.researchers === 'number') {
                this.state.researchers++;
            } else {
                this.state.researchers.push({
                    id: `res_${Date.now()}`,
                    name: 'Sim Researcher',
                    hiredAt: this.state.day
                });
            }
            this.dailyStats.expenses += hireCost;
        }
    }

    upgradeOffice() {
        const nextLevel = (this.state.officeLevel + 1) as OfficeLevel;
        const nextConfig = OFFICE_CONFIGS[nextLevel];

        if (!nextConfig) return;

        if (this.state.money >= nextConfig.upgradeCost) {
            this.state.money -= nextConfig.upgradeCost;
            this.state.officeLevel = nextLevel;
            this.dailyStats.expenses += nextConfig.upgradeCost;
            this.log(`Upgraded Office to ${nextConfig.name}`);
        }
    }

    // --- NEW MECHANICS ---

    handleEvents() {
        // 1% chance per day
        if (Math.random() > 0.01) return;

        const availableEvents = POTENTIAL_EVENTS.filter(e => {
            if (e.requiredEra && !e.requiredEra.includes(this.state.currentEraId)) return false;
            return true;
        });

        if (availableEvents.length === 0) return;

        const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        this.log(`EVENT: ${event.title} - ${event.description}`);

        // Apply effect
        const effect = event.effect(this.state);
        this.state = { ...this.state, ...effect };
    }

    handleCompetitors() {
        this.state.competitors.forEach(comp => {
            // Simple logic: Release every 100-150 days
            if (this.state.day - comp.lastReleaseDay > 120) {
                comp.lastReleaseDay = this.state.day;
                this.log(`COMPETITOR: ${comp.name} released a new product! Market Saturation increased.`);

                // Hit saturation
                this.state.marketSaturation[ProductType.CPU] = Math.min(1, (this.state.marketSaturation[ProductType.CPU] || 0) + 0.3);
                this.state.marketSaturation[ProductType.GPU] = Math.min(1, (this.state.marketSaturation[ProductType.GPU] || 0) + 0.3);
            }
        });
    }

    handleContracts() {
        // Generate new contract offer occasionally
        if (Math.random() < 0.05 && this.state.availableContracts.length < 3) {
            const contract: Contract = {
                id: `cnt_${this.state.day}_${Math.random()}`,
                title: 'Gov Supply',
                description: 'Supply CPUs for local schools',
                requiredProduct: ProductType.CPU,
                requiredAmount: 500 + Math.floor(Math.random() * 1000),
                fulfilledAmount: 0,
                reward: 0, // Calculated below
                penalty: 0,
                deadlineDay: this.state.day + 30,
                duration: 30,
                upfrontPayment: 0,
                completionPayment: 0
            };
            // Reward is 1.5x market price
            const basePrice = CPU_TECH_TREE[this.state.techLevels[ProductType.CPU]].baseMarketPrice;
            contract.reward = Math.floor(contract.requiredAmount * basePrice * 1.5);
            contract.completionPayment = contract.reward;
            contract.penalty = Math.floor(contract.reward * 0.5);

            this.state.availableContracts.push(contract);
            // this.log(`New Contract Available: ${contract.name} (${contract.requiredAmount} units for $${contract.reward})`);
        }

        // Check active contracts for deadline
        this.state.activeContracts = this.state.activeContracts.filter(c => {
            if (this.state.day > c.deadlineDay) {
                this.log(`CONTRACT FAILED: ${c.title}. Penalty: $${c.penalty}`);
                this.state.money -= c.penalty;
                this.dailyStats.expenses += c.penalty;
                return false;
            }
            return true;
        });
    }

    // --- DAILY TICK ---

    nextDay() {
        this.state.day++;

        // 1. Expenses
        const researcherCount = Array.isArray(this.state.researchers) ? this.state.researchers.length : this.state.researchers;
        const salaryCost = researcherCount * RESEARCHER_DAILY_SALARY;
        this.state.money -= salaryCost;
        this.dailyStats.expenses += salaryCost;

        const office = OFFICE_CONFIGS[this.state.officeLevel];
        if (this.state.day % 7 === 0) {
            this.state.money -= office.rent;
            this.dailyStats.expenses += office.rent;
        }

        const totalInventory = this.state.inventory[ProductType.CPU] + this.state.inventory[ProductType.GPU];
        const storageCost = calculateStorageCost(totalInventory, office.siliconCap);
        this.state.money -= storageCost;
        this.dailyStats.expenses += storageCost;

        // 2. RP Gain
        const decay = 0.96;
        const baseRpTotal = researcherCount > 0
            ? (RP_PER_RESEARCHER_PER_DAY * (1 - Math.pow(decay, researcherCount))) / (1 - decay)
            : 0;

        const bonuses = getReputationBonuses(this.state.reputation);
        const rpGain = Math.floor(baseRpTotal * bonuses.researchBonus);
        this.state.rp += rpGain;

        // 3. Market Dynamics
        this.state.marketSaturation[ProductType.CPU] = Math.max(0, (this.state.marketSaturation[ProductType.CPU] || 0) - ECONOMY_CONFIG.MARKET_RECOVERY_RATE);
        this.state.marketSaturation[ProductType.GPU] = Math.max(0, (this.state.marketSaturation[ProductType.GPU] || 0) - ECONOMY_CONFIG.MARKET_RECOVERY_RATE);

        const noise = (Math.random() - 0.5) * 10;
        this.state.siliconPrice = Math.max(5, Math.min(100, this.state.siliconPrice + noise));

        const currentEraIndex = ERAS.findIndex(e => e.id === this.state.currentEraId);
        const nextEra = ERAS[currentEraIndex + 1];
        if (nextEra && this.state.day >= nextEra.startDay) {
            this.state.currentEraId = nextEra.id;
            this.log(`Entered Era: ${nextEra.name}`);
        }

        // 4. New Mechanics
        this.handleEvents();
        this.handleCompetitors();
        this.handleContracts();

        // Record History
        this.history.push({
            day: this.state.day,
            money: Math.floor(this.state.money),
            rp: Math.floor(this.state.rp),
            cpuTech: this.state.techLevels[ProductType.CPU],
            gpuTech: this.state.techLevels[ProductType.GPU],
            researchers: researcherCount,
            office: this.state.officeLevel,
            ...this.dailyStats
        });

        // Reset Daily Stats
        this.dailyStats = {
            producedCPU: 0,
            producedGPU: 0,
            soldCPU: 0,
            soldGPU: 0,
            revenue: 0,
            expenses: 0
        };
    }

    // --- BOT STRATEGY ---

    runBot() {
        // 1. Buy Silicon if low
        const office = OFFICE_CONFIGS[this.state.officeLevel];
        const siliconNeeded = 1000; // Buffer
        if (this.state.silicon < siliconNeeded) {
            // Don't buy if price is too high, unless critical
            if (this.state.siliconPrice > 30 && this.state.silicon > 200) return;

            const amountToBuy = Math.min(office.siliconCap - this.state.silicon, 2000);
            this.buySilicon(amountToBuy);
        }

        // 2. Produce
        const produceAmount = Math.min(Math.floor(this.state.silicon / 10), 500);
        if (produceAmount > 0) {
            this.produce(ProductType.CPU, produceAmount);
        }

        // 3. Sell
        this.sell(ProductType.CPU);
        this.sell(ProductType.GPU);

        // 4. Research
        this.research(ProductType.CPU);

        // 5. Hire
        const researcherCount = Array.isArray(this.state.researchers) ? this.state.researchers.length : this.state.researchers;
        let targetResearchers = 0;
        if (this.state.money > 10000) targetResearchers = 2;
        if (this.state.money > 50000) targetResearchers = 5;
        if (this.state.money > 200000) targetResearchers = 10;
        if (this.state.money > 1000000) targetResearchers = 20;
        if (this.state.money > 5000000) targetResearchers = 50;
        if (this.state.money > 20000000) targetResearchers = 100;

        if (researcherCount < targetResearchers) {
            this.hireResearcher();
        }

        // 6. Upgrade Office
        const nextLevel = (this.state.officeLevel + 1) as OfficeLevel;
        const nextConfig = OFFICE_CONFIGS[nextLevel];
        if (nextConfig && this.state.money > nextConfig.upgradeCost * 2) {
            this.upgradeOffice();
        }

        // 7. Contracts (Simple Bot Logic)
        // Accept any contract if we have enough money buffer
        const contract = this.state.availableContracts[0];
        if (contract && this.state.activeContracts.length === 0) {
            this.state.activeContracts.push(contract);
            this.state.availableContracts.shift();
            this.log(`Accepted Contract: ${contract.title}`);
        }

        // Fulfill Contract
        if (this.state.activeContracts.length > 0) {
            const active = this.state.activeContracts[0];
            const needed = active.requiredAmount;
            const inStock = this.state.inventory[active.requiredProduct];

            if (inStock >= needed) {
                this.state.inventory[active.requiredProduct] -= needed;
                this.state.money += active.reward;
                this.dailyStats.revenue += active.reward;
                this.log(`CONTRACT COMPLETED: ${active.title}. Reward: $${active.reward}`);
                this.state.activeContracts.shift();
            }
        }
    }

    run(days: number) {
        console.log(`Starting simulation for ${days} days...`);
        console.log(`Initial Money: $${this.state.money}`);

        for (let i = 0; i < days; i++) {
            this.runBot();
            this.nextDay();

            if (this.state.money < -5000) {
                console.log(`Game Over at Day ${this.state.day} due to Bankruptcy!`);
                break;
            }
        }

        this.printReport();
        this.exportCSV();
    }

    printReport() {
        console.log('\n=== SIMULATION REPORT ===');
        console.log(`Final Day: ${this.state.day}`);
        console.log(`Final Money: $${Math.floor(this.state.money).toLocaleString()}`);
        console.log(`Final RP: ${Math.floor(this.state.rp).toLocaleString()}`);
        console.log(`CPU Tech Tier: ${this.state.techLevels[ProductType.CPU]}`);
        console.log(`Office Level: ${OFFICE_CONFIGS[this.state.officeLevel].name}`);

        console.log('\n--- Milestones ---');
        let lastCpuTech = 0;
        this.history.forEach(h => {
            if (h.cpuTech > lastCpuTech) {
                console.log(`Day ${h.day}: Reached CPU Tier ${h.cpuTech}`);
                lastCpuTech = h.cpuTech;
            }
        });

        console.log('\n--- Financial Snapshot (Every 30 Days) ---');
        this.history.forEach(h => {
            if (h.day % 30 === 0) {
                console.log(`Day ${h.day}: $${h.money.toLocaleString()} | Tech: ${h.cpuTech} | Staff: ${h.researchers}`);
            }
        });
    }

    exportCSV() {
        const header = 'Day;Money;RP;CPUTech;GPUTech;Researchers;OfficeLevel;ProducedCPU;ProducedGPU;SoldCPU;SoldGPU;Revenue;Expenses\n';
        const rows = this.history.map(h =>
            `${h.day};${h.money};${h.rp};${h.cpuTech};${h.gpuTech};${h.researchers};${h.office};${h.producedCPU};${h.producedGPU};${h.soldCPU};${h.soldGPU};${h.revenue};${h.expenses}`
        ).join('\n');

        // Add BOM for Excel UTF-8 compatibility and sep=; for column separation
        fs.writeFileSync('simulation_results_v2.csv', '\uFEFFsep=;\n' + header + rows);
        console.log('\nCSV exported to simulation_results_v2.csv (Excel format)');
    }
}

// Run the simulation
const sim = new EconomySimulation();
sim.run(365);
