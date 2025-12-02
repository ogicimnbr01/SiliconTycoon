import { GameState, OfficeLevel, ProductType } from '../types';
import { INITIAL_MONEY, INITIAL_RP, INITIAL_SILICON, BASE_SILICON_PRICE, INITIAL_REPUTATION } from './baseValues';
import { ERAS, MARKET_TRENDS, INITIAL_STOCKS } from './marketData';
import { INITIAL_COMPETITORS } from './entities';

export const INITIAL_GAME_STATE: GameState = {
    stage: 'menu',
    language: 'en',
    companyName: "Silicon Startup",
    day: 1,
    gameSpeed: 'paused',
    lastSaveTime: Date.now(),
    money: INITIAL_MONEY,
    rp: INITIAL_RP,
    researchers: [],
    hiredHeroes: [],
    officeLevel: OfficeLevel.GARAGE,
    silicon: INITIAL_SILICON,
    siliconPrice: BASE_SILICON_PRICE,
    reputation: INITIAL_REPUTATION,
    productionQuality: 'medium',
    designSpecs: {
        [ProductType.CPU]: { performance: 50, efficiency: 50 },
        [ProductType.GPU]: { performance: 50, efficiency: 50 }
    },
    inventory: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
    techLevels: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
    globalTechLevels: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
    currentEraId: ERAS[0].id,
    marketMultiplier: 1.0,
    activeTrendId: MARKET_TRENDS[0].id,
    activeRivalLaunch: null,
    financialHistory: [{ day: 1, money: INITIAL_MONEY }],
    activeContracts: [],
    availableContracts: [],
    stocks: INITIAL_STOCKS,
    isPubliclyTraded: false,
    playerCompanySharesOwned: 100,
    playerSharePrice: 10.0,
    prestigePoints: 0,
    activeEvent: null,
    unlockedTabs: ['factory', 'market'],
    logs: [],
    hacking: { active: false, type: 'espionage', difficulty: 1 },
    hackingResult: null,
    offlineReport: null,
    unlockedAchievements: [],
    activeCampaigns: [],
    brandAwareness: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
    marketSaturation: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
    dailyDemand: { [ProductType.CPU]: 80, [ProductType.GPU]: 90 },
    dailySales: {
        [ProductType.CPU]: 0,
        [ProductType.GPU]: 0
    },
    lastSalesResetDay: 1,
    factory: {
        landOwned: false,
        modules: {
            procurement: { level: 0, rate: 0 },
            assembly: { level: 0, rate: 0 },
            logistics: { level: 0, rate: 0 }
        }
    },
    manufacturingTechLevels: { mass_production: 0 },
    competitors: INITIAL_COMPETITORS,
    boardMissions: [],
    loans: [],
    staffMorale: 100,
    workPolicy: 'normal',
    researchPolicy: 'balanced',

    // AdMob & Monetization
    bailoutUsedToday: false,
    overdriveActive: false,
    overdriveEndsAt: 0,
    lastOverdriveTime: 0,
    offlineAdWatched: false,
    dailySpinCount: 0,
    nextSpinTime: 0,
    lastDailyReset: Date.now(),

    isPremium: false,
    bankruptcyTimer: 0,
    productionLines: []
};
