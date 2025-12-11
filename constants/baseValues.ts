import { OfficeLevel, GameEvent } from '../types';

// --- SIMULATION CONSTANTS ---
export const TICK_RATE_MS = 3000; // 3.0 seconds per day (Slower 1x)
export const INITIAL_MONEY = 10000; // $10k Start (Faster onboarding)
export const INITIAL_RP = 0;
export const INITIAL_RESEARCHERS = 0;
export const INITIAL_SILICON = 1000; // 1000 units
export const INITIAL_REPUTATION = 0; // 0-100

export const RESEARCHER_BASE_COST = 1500; // Reduced from 2000
export const RESEARCHER_COST_GROWTH = 1.3; // Reduced from 1.5
export const RESEARCHER_DAILY_SALARY = 150;
export const RP_PER_RESEARCHER_PER_DAY = 20; // Increased from 10

export const IPO_THRESHOLD_VALUATION = 10000000; // $10M Valuation to IPO
export const MAX_ACTIVE_LOANS = 3;

// --- SILICON MARKET ---
export const BASE_SILICON_PRICE = 10; // $10 per unit

export const OFFICE_CONFIGS = {
    [OfficeLevel.GARAGE]: {
        name: "Mom's Garage",
        rent: 0, // Safe Zone
        maxResearchers: 2,
        siliconCap: 200,
        upgradeCost: 15000, // To Basement
        description: "Free but tiny. Max 2 staff.",
        requiredTech: null
    },
    [OfficeLevel.BASEMENT]: {
        name: "Basement Lab",
        rent: 200,
        maxResearchers: 5,
        siliconCap: 1000,
        upgradeCost: 35000, // To Co-Working
        description: "Bonus: +5% Research Speed",
        requiredTech: null
    },
    [OfficeLevel.COWORKING]: {
        name: "Co-Working Space",
        rent: 500,
        maxResearchers: 10,
        siliconCap: 2500,
        upgradeCost: 75000, // To Startup
        description: "Bonus: +10% Sales Price (Networking)",
        requiredTech: null
    },
    [OfficeLevel.STARTUP]: {
        name: "Startup Office",
        rent: 1000,
        maxResearchers: 20, // Increased capacity
        siliconCap: 5000,
        upgradeCost: 350000,
        description: "Bonus: -7% Staff Salary",
        requiredTech: 'mass_production'
    },
    [OfficeLevel.CORPORATE]: {
        name: "Corporate Floor",
        rent: 5000,
        maxResearchers: 50, // Increased capacity
        siliconCap: 20000,
        upgradeCost: 2000000,
        description: "Bonus: +15% Production Speed",
        requiredTech: 'advanced_logistics'
    },
    [OfficeLevel.CAMPUS]: {
        name: "Tech Campus",
        rent: 15000,
        maxResearchers: 150, // Increased capacity
        siliconCap: 100000,
        upgradeCost: 10000000,
        description: "Bonus: Hype Bonus Duration x2",
        requiredTech: 'ai_procurement'
    },
    [OfficeLevel.HEADQUARTERS]: {
        name: "Silicon HQ",
        rent: 50000,
        maxResearchers: 500, // Increased capacity
        siliconCap: 1000000,
        upgradeCost: 0,
        description: "Bonus: No Market Saturation Penalty",
        requiredTech: 'quantum_manufacturing'
    }
};

// Random Events
export const POTENTIAL_EVENTS: GameEvent[] = [
    {
        id: 'evt_cyber',
        title: 'CYBER ATTACK!',
        description: 'Hackers infiltrated your servers. Research data corrupted.',
        type: 'negative',
        effect: (s) => ({ rp: Math.max(0, s.rp - 200) })
    },
    {
        id: 'evt_viral',
        title: 'VIRAL REVIEW',
        description: 'A famous tech tuber praised your products. Demand surging!',
        type: 'positive',
        effect: (s) => ({ marketMultiplier: s.marketMultiplier + 0.3 })
    },
    {
        id: 'evt_shortage',
        title: 'SILICON SHORTAGE',
        description: 'Global supply chain issues. Silicon prices skyrocketed.',
        type: 'negative',
        effect: (s) => ({ siliconPrice: s.siliconPrice * 2.5 })
    },
    {
        id: 'evt_grant',
        title: 'GOVT GRANT',
        description: 'You received a technology innovation grant.',
        type: 'positive',
        effect: (s) => ({ money: s.money + 5000 })
    },
    // PC Era Events
    {
        id: 'evt_dotcom',
        title: 'DOT-COM BUBBLE BURST',
        description: 'Market crash! Tech stocks plummeting.',
        type: 'negative',
        requiredEra: ['era_pc'],
        effect: (s) => ({ marketMultiplier: 0.5, money: Math.max(0, s.money * 0.8) })
    },
    {
        id: 'evt_y2k',
        title: 'Y2K BUG SCARE',
        description: 'Critical software updates needed. Research halted.',
        type: 'negative',
        requiredEra: ['era_pc'],
        effect: (s) => ({ rp: Math.max(0, s.rp - 500) })
    },
    // Mobile Era Events
    {
        id: 'evt_appstore',
        title: 'APP ECOSYSTEM LAUNCH',
        description: 'Mobile software demand skyrocketing!',
        type: 'positive',
        requiredEra: ['era_mobile'],
        effect: (s) => ({ marketMultiplier: s.marketMultiplier + 0.4 })
    },
    {
        id: 'evt_social',
        title: 'SOCIAL MEDIA EXPLOSION',
        description: 'Data centers expanding. High server CPU demand.',
        type: 'positive',
        requiredEra: ['era_mobile'],
        effect: (s) => ({ marketMultiplier: s.marketMultiplier + 0.2 }) // Also could boost CPU price if we had per-product price mod
    },
    // AI Era Events
    {
        id: 'evt_agi',
        title: 'AGI BREAKTHROUGH',
        description: 'Artificial General Intelligence achieved! Research speed x2.',
        type: 'positive',
        requiredEra: ['era_ai'],
        effect: (s) => ({ rp: s.rp + 2000 })
    },
    {
        id: 'evt_robot_tax',
        title: 'AUTOMATION TAX',
        description: 'New laws tax AI usage. Costs increased.',
        type: 'negative',
        requiredEra: ['era_ai'],
        effect: (s) => ({ money: Math.max(0, s.money - 50000) })
    },
    {
        id: 'evt_quantum',
        title: 'QUANTUM SUPREMACY',
        description: 'Quantum computing breakthrough. Encryption tech valued.',
        type: 'positive',
        requiredEra: ['era_ai'],
        effect: (s) => ({ rp: s.rp + 1000, marketMultiplier: s.marketMultiplier + 0.2 })
    }
];

export const FACTORY_UPGRADES = {
    LAND_COST: 5000000, // $5M
    MODULE_COSTS: {
        procurement: 10000,
        assembly: 25000,
        logistics: 15000
    },
    MODULE_RATES: {
        procurement: 5, // Silicon per tick
        assembly: 1,    // Chips per tick
        logistics: 2    // Sales per tick
    }
};
