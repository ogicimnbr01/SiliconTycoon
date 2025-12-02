import { Competitor, ProductType, Achievement, OfficeLevel, Hero } from '../types';
import { INITIAL_MONEY } from './baseValues';

// Competitors
export const INITIAL_COMPETITORS: Competitor[] = [
    {
        id: 'comp_intel',
        name: 'Intellion',
        logo: '🔵',
        color: '#0071c5',
        money: 100000000,
        reputation: 90,
        techLevel: { [ProductType.CPU]: 2, [ProductType.GPU]: 0 },
        productQuality: { [ProductType.CPU]: 80, [ProductType.GPU]: 40 },
        aggressiveness: 70,
        cashReserves: 100000000,
        lastReleaseDay: -100,
        marketShare: { [ProductType.CPU]: 80, [ProductType.GPU]: 10 },
        products: [
            {
                id: 'prod_intel_1',
                name: 'Pentium Pro',
                type: ProductType.CPU,
                techTier: 2,
                quality: 80,
                price: 350,
                launchDay: -100,
                salesVolume: 5000
            }
        ],
        personality: 'aggressive',
        history: []
    },
    {
        id: 'comp_amd',
        name: 'Advanced Micro',
        logo: '🔴',
        color: '#ED1C24',
        money: 20000000,
        reputation: 60,
        techLevel: { [ProductType.CPU]: 1, [ProductType.GPU]: 0 },
        productQuality: { [ProductType.CPU]: 70, [ProductType.GPU]: 50 },
        aggressiveness: 40,
        cashReserves: 20000000,
        lastReleaseDay: -50,
        marketShare: { [ProductType.CPU]: 15, [ProductType.GPU]: 5 },
        products: [
            {
                id: 'prod_amd_1',
                name: 'K5',
                type: ProductType.CPU,
                techTier: 1,
                quality: 70,
                price: 140,
                launchDay: -50,
                salesVolume: 1500
            }
        ],
        personality: 'balanced',
        history: []
    },
    {
        id: 'comp_nvidia',
        name: 'Nvidio',
        logo: '🟢',
        color: '#76b900',
        money: 15000000,
        reputation: 70,
        techLevel: { [ProductType.CPU]: 0, [ProductType.GPU]: 1 },
        productQuality: { [ProductType.CPU]: 0, [ProductType.GPU]: 85 },
        aggressiveness: 60,
        cashReserves: 15000000,
        lastReleaseDay: -30,
        marketShare: { [ProductType.CPU]: 0, [ProductType.GPU]: 60 },
        products: [
            {
                id: 'prod_nv_1',
                name: 'Riva 128',
                type: ProductType.GPU,
                techTier: 1,
                quality: 85,
                price: 200,
                launchDay: -30,
                salesVolume: 3000
            }
        ],
        personality: 'innovative',
        history: []
    },
    {
        id: 'comp_3dfx',
        name: '3DFX',
        logo: '⚫',
        color: '#000000',
        money: 5000000,
        reputation: 80,
        techLevel: { [ProductType.CPU]: 0, [ProductType.GPU]: 2 },
        productQuality: { [ProductType.CPU]: 0, [ProductType.GPU]: 95 },
        aggressiveness: 80,
        cashReserves: 5000000,
        lastReleaseDay: -10,
        marketShare: { [ProductType.CPU]: 0, [ProductType.GPU]: 25 },
        products: [
            {
                id: 'prod_3dfx_1',
                name: 'Voodoo 1',
                type: ProductType.GPU,
                techTier: 2,
                quality: 95,
                price: 300,
                launchDay: -10,
                salesVolume: 2000
            }
        ],
        personality: 'risky',
        history: []
    }
];

// Achievements
export const ACHIEVEMENTS: Achievement[] = [
    // Wealth
    {
        id: 'ach_millionaire',
        titleKey: 'ach_millionaire_title',
        descriptionKey: 'ach_millionaire_desc',
        icon: '💰',
        condition: (state) => state.money >= 1000000 || state.financialHistory.some(h => h.money >= 1000000),
        reward: { type: 'prestige', value: 10 }
    },
    {
        id: 'ach_decamillionaire',
        titleKey: 'ach_decamillionaire_title',
        descriptionKey: 'ach_decamillionaire_desc',
        icon: '🏦',
        condition: (state) => state.money >= 10000000 || state.financialHistory.some(h => h.money >= 10000000),
        reward: { type: 'prestige', value: 25 }
    },
    {
        id: 'ach_centimillionaire',
        titleKey: 'ach_centimillionaire_title',
        descriptionKey: 'ach_centimillionaire_desc',
        icon: '🏙️',
        condition: (state) => state.money >= 100000000 || state.financialHistory.some(h => h.money >= 100000000),
        reward: { type: 'prestige', value: 50 }
    },
    {
        id: 'ach_billionaire',
        titleKey: 'ach_billionaire_title',
        descriptionKey: 'ach_billionaire_desc',
        icon: '🦄',
        condition: (state) => state.money >= 1000000000 || state.financialHistory.some(h => h.money >= 1000000000),
        reward: { type: 'prestige', value: 100 }
    },
    {
        id: 'ach_trillionaire',
        titleKey: 'ach_trillionaire_title',
        descriptionKey: 'ach_trillionaire_desc',
        icon: '🌍',
        condition: (state) => state.money >= 1000000000000 || state.financialHistory.some(h => h.money >= 1000000000000),
        reward: { type: 'prestige', value: 500 }
    },

    // Production
    {
        id: 'ach_mass_production',
        titleKey: 'ach_mass_production_title',
        descriptionKey: 'ach_mass_production_desc',
        icon: '🏭',
        condition: (state) => state.inventory.CPU > 0 || state.financialHistory.some(h => h.money > INITIAL_MONEY), // Placeholder condition, ideally track total produced
        reward: { type: 'money', value: 10000 }
    },
    {
        id: 'ach_industrial_giant',
        titleKey: 'ach_industrial_giant_title',
        descriptionKey: 'ach_industrial_giant_desc',
        icon: '🏗️',
        condition: (state) => false, // Placeholder
        reward: { type: 'money', value: 100000 }
    },

    // Research
    {
        id: 'ach_researcher',
        titleKey: 'ach_researcher_title',
        descriptionKey: 'ach_researcher_desc',
        icon: '🔬',
        condition: (state) => state.techLevels.CPU > 0 || state.techLevels.GPU > 0,
        reward: { type: 'rp', value: 500 }
    },
    {
        id: 'ach_tech_pioneer',
        titleKey: 'ach_tech_pioneer_title',
        descriptionKey: 'ach_tech_pioneer_desc',
        icon: '🚀',
        condition: (state) => state.techLevels.CPU >= 9,
        reward: { type: 'prestige', value: 50 }
    },
    {
        id: 'ach_graphics_wizard',
        titleKey: 'ach_graphics_wizard_title',
        descriptionKey: 'ach_graphics_wizard_desc',
        icon: '🎨',
        condition: (state) => state.techLevels.GPU >= 9,
        reward: { type: 'prestige', value: 50 }
    },

    // Staff
    {
        id: 'ach_lab_rat',
        titleKey: 'ach_lab_rat_title',
        descriptionKey: 'ach_lab_rat_desc',
        icon: '🐁',
        condition: (state) => (Array.isArray(state.researchers) ? state.researchers.length : state.researchers) >= 5,
        reward: { type: 'rp', value: 1000 }
    },
    {
        id: 'ach_research_institute',
        titleKey: 'ach_research_institute_title',
        descriptionKey: 'ach_research_institute_desc',
        icon: '🏛️',
        condition: (state) => (Array.isArray(state.researchers) ? state.researchers.length : state.researchers) >= 20,
        reward: { type: 'rp', value: 5000 }
    },
    {
        id: 'ach_headhunter',
        titleKey: 'ach_headhunter_title',
        descriptionKey: 'ach_headhunter_desc',
        icon: '🕵️',
        condition: (state) => state.hiredHeroes.length >= 1,
        reward: { type: 'prestige', value: 10 }
    },
    {
        id: 'ach_dream_team',
        titleKey: 'ach_dream_team_title',
        descriptionKey: 'ach_dream_team_desc',
        icon: '🌟',
        condition: (state) => state.hiredHeroes.length >= 3,
        reward: { type: 'prestige', value: 50 }
    },

    // Survival
    {
        id: 'ach_garage_days',
        titleKey: 'ach_garage_days_title',
        descriptionKey: 'ach_garage_days_desc',
        icon: '🏚️',
        condition: (state) => state.day >= 30,
        reward: { type: 'money', value: 5000 }
    },
    {
        id: 'ach_anniversary',
        titleKey: 'ach_anniversary_title',
        descriptionKey: 'ach_anniversary_desc',
        icon: '🎂',
        condition: (state) => state.day >= 365,
        reward: { type: 'prestige', value: 20 }
    },
    {
        id: 'ach_veteran',
        titleKey: 'ach_veteran_title',
        descriptionKey: 'ach_veteran_desc',
        icon: '🎖️',
        condition: (state) => state.day >= 1000,
        reward: { type: 'prestige', value: 100 }
    },

    // Office
    {
        id: 'ach_corporate_ladder',
        titleKey: 'ach_corporate_ladder_title',
        descriptionKey: 'ach_corporate_ladder_desc',
        icon: '🏢',
        condition: (state) => state.officeLevel >= OfficeLevel.CORPORATE,
        reward: { type: 'prestige', value: 15 }
    },
    {
        id: 'ach_sky_high',
        titleKey: 'ach_sky_high_title',
        descriptionKey: 'ach_sky_high_desc',
        icon: '☁️',
        condition: (state) => state.officeLevel >= OfficeLevel.HEADQUARTERS,
        reward: { type: 'prestige', value: 50 }
    },

    // Fame
    {
        id: 'ach_famous',
        titleKey: 'ach_famous_title',
        descriptionKey: 'ach_famous_desc',
        icon: '📸',
        condition: (state) => state.brandAwareness.CPU >= 50 || state.brandAwareness.GPU >= 50,
        reward: { type: 'sales', value: 0.1 }
    },
    {
        id: 'ach_household_name',
        titleKey: 'ach_household_name_title',
        descriptionKey: 'ach_household_name_desc',
        icon: '📺',
        condition: (state) => state.brandAwareness.CPU >= 100 || state.brandAwareness.GPU >= 100,
        reward: { type: 'sales', value: 0.2 }
    },

    // Corporate Warfare
    {
        id: 'ach_spy_games',
        titleKey: 'ach_spy_games_title',
        descriptionKey: 'ach_spy_games_desc',
        icon: '🕶️',
        condition: (state) => false, // Triggered manually in code
        reward: { type: 'rp', value: 1000 }
    },
    {
        id: 'ach_saboteur',
        titleKey: 'ach_saboteur_title',
        descriptionKey: 'ach_saboteur_desc',
        icon: '💣',
        condition: (state) => false, // Triggered manually in code
        reward: { type: 'prestige', value: 10 }
    },

    // Finance
    {
        id: 'ach_ipo',
        titleKey: 'ach_ipo_title',
        descriptionKey: 'ach_ipo_desc',
        icon: '🔔',
        condition: (state) => state.isPubliclyTraded,
        reward: { type: 'prestige', value: 50 }
    },
    {
        id: 'ach_monopoly',
        titleKey: 'ach_monopoly_title',
        descriptionKey: 'ach_monopoly_desc',
        icon: '🎩',
        condition: (state) => state.reputation >= 90,
        reward: { type: 'prestige', value: 100 }
    }
];

// Heroes
export const HEROES: Hero[] = [
    {
        id: 'hero_steve',
        name: 'Steve W.',
        role: 'Marketing Guru',
        hiringCost: 50000,
        dailySalary: 500,
        description: 'Increases sales prices by 20%. Very demanding.',
        effectType: 'sales',
        effectValue: 0.2
    },
    {
        id: 'hero_linus',
        name: 'Linus T.',
        role: 'Kernel Architect',
        hiringCost: 30000,
        dailySalary: 300,
        description: 'Doubles RP production from all researchers.',
        effectType: 'research',
        effectValue: 1.0 // +100%
    },
    {
        id: 'hero_elon',
        name: 'Elon M.',
        role: 'Visionary',
        hiringCost: 100000,
        dailySalary: 1000,
        description: 'Increases company valuation and stock volatility.',
        effectType: 'stock',
        effectValue: 0.5
    }
];
