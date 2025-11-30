import { ProductType, TechNode, Stock, OfficeLevel, GameEvent, Hero, GameEra, MarketTrend, Achievement, MarketingCampaign, Competitor, GameState } from './types';

export const INITIAL_MONEY = 5000;
export const INITIAL_RP = 0;
export const INITIAL_RESEARCHERS = 0;
export const INITIAL_SILICON = 200;
export const INITIAL_REPUTATION = 10;

// Simulation Constants
export const TICK_RATE_MS = 1500; // 1.5 seconds per day
export const RESEARCHER_BASE_COST = 3000; // Increased from 1000
export const RESEARCHER_COST_GROWTH = 1.6; // Increased from 1.5  
export const RESEARCHER_DAILY_SALARY = 300; // Increased from 150
export const RP_PER_RESEARCHER_PER_DAY = 8; // Decreased from 10
export const IPO_THRESHOLD_VALUATION = 100000;
export const MAX_ACTIVE_LOANS = 3;

// Silicon Market
export const BASE_SILICON_PRICE = 4;


// Marketing Constants
export const MARKETING_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp_social',
    name: 'Social Media Ads',
    description: 'Targeted ads on popular platforms.',
    cost: 5000,
    duration: 7,
    awarenessBoost: 10,
    type: 'social'
  },
  {
    id: 'camp_influencer',
    name: 'Tech Influencer Review',
    description: 'Send products to top tech YouTubers.',
    cost: 25000,
    duration: 14,
    awarenessBoost: 25,
    type: 'influencer'
  },
  {
    id: 'camp_tv',
    name: 'TV Commercial',
    description: 'Prime time slot on national TV.',
    cost: 100000,
    duration: 30,
    awarenessBoost: 50,
    type: 'tv'
  },
  {
    id: 'camp_event',
    name: 'Tech Expo Booth',
    description: 'Major presence at the annual Tech Expo.',
    cost: 500000,
    duration: 60,
    awarenessBoost: 80,
    type: 'event'
  }
];

// Competitor Constants
export const INITIAL_COMPETITORS: Competitor[] = [
  // Tier 1: Startups (Early Game Rivals)
  {
    id: 'comp_garage',
    name: 'GarageTek',
    marketShare: { [ProductType.CPU]: 0.5, [ProductType.GPU]: 0.5 },
    productQuality: { [ProductType.CPU]: 15, [ProductType.GPU]: 15 },
    aggressiveness: 20,
    cashReserves: 5000,
    techLevel: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
    money: 5000,
    history: [5000],
    lastReleaseDay: -10
  },
  {
    id: 'comp_pixel',
    name: 'PixelDreams',
    marketShare: { [ProductType.CPU]: 0.2, [ProductType.GPU]: 0.8 },
    productQuality: { [ProductType.CPU]: 10, [ProductType.GPU]: 25 },
    aggressiveness: 25,
    cashReserves: 8000,
    techLevel: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
    money: 8000,
    history: [8000],
    lastReleaseDay: -15
  },
  {
    id: 'comp_logic',
    name: 'LogicGate',
    marketShare: { [ProductType.CPU]: 0.8, [ProductType.GPU]: 0.2 },
    productQuality: { [ProductType.CPU]: 25, [ProductType.GPU]: 10 },
    aggressiveness: 30,
    cashReserves: 12000,
    techLevel: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
    money: 12000,
    history: [12000],
    lastReleaseDay: -20
  },

  // Tier 2: Small Cap (Growth)
  {
    id: 'comp_wave',
    name: 'SiliconWave',
    marketShare: { [ProductType.CPU]: 2, [ProductType.GPU]: 2 },
    productQuality: { [ProductType.CPU]: 40, [ProductType.GPU]: 40 },
    aggressiveness: 45,
    cashReserves: 500000,
    techLevel: { [ProductType.CPU]: 1, [ProductType.GPU]: 1 },
    money: 500000,
    history: [500000],
    lastReleaseDay: -40
  },
  {
    id: 'comp_chip',
    name: 'ChipMaster',
    marketShare: { [ProductType.CPU]: 3, [ProductType.GPU]: 1 },
    productQuality: { [ProductType.CPU]: 45, [ProductType.GPU]: 30 },
    aggressiveness: 50,
    cashReserves: 750000,
    techLevel: { [ProductType.CPU]: 1, [ProductType.GPU]: 1 },
    money: 750000,
    history: [750000],
    lastReleaseDay: -35
  },
  {
    id: 'comp_nano',
    name: 'NanoSystems',
    marketShare: { [ProductType.CPU]: 1, [ProductType.GPU]: 3 },
    productQuality: { [ProductType.CPU]: 35, [ProductType.GPU]: 50 },
    aggressiveness: 55,
    cashReserves: 900000,
    techLevel: { [ProductType.CPU]: 1, [ProductType.GPU]: 1 },
    money: 900000,
    history: [900000],
    lastReleaseDay: -45
  },

  // Tier 3: Mid Cap (Established)
  {
    id: 'comp_future',
    name: 'FutureSystems',
    marketShare: { [ProductType.CPU]: 6, [ProductType.GPU]: 6 },
    productQuality: { [ProductType.CPU]: 55, [ProductType.GPU]: 50 },
    aggressiveness: 60,
    cashReserves: 2500000,
    techLevel: { [ProductType.CPU]: 2, [ProductType.GPU]: 1 },
    money: 2500000,
    history: [2500000],
    lastReleaseDay: -60
  },
  {
    id: 'comp_quantum',
    name: 'QuantumCore',
    marketShare: { [ProductType.CPU]: 8, [ProductType.GPU]: 4 },
    productQuality: { [ProductType.CPU]: 65, [ProductType.GPU]: 45 },
    aggressiveness: 65,
    cashReserves: 3500000,
    techLevel: { [ProductType.CPU]: 2, [ProductType.GPU]: 2 },
    money: 3500000,
    history: [3500000],
    lastReleaseDay: -55
  },
  {
    id: 'comp_cyber',
    name: 'CyberDyne',
    marketShare: { [ProductType.CPU]: 4, [ProductType.GPU]: 8 },
    productQuality: { [ProductType.CPU]: 50, [ProductType.GPU]: 65 },
    aggressiveness: 70,
    cashReserves: 4000000,
    techLevel: { [ProductType.CPU]: 1, [ProductType.GPU]: 2 },
    money: 4000000,
    history: [4000000],
    lastReleaseDay: -50
  },

  // Tier 4: Giants (Market Leaders)
  {
    id: 'comp_intel',
    name: 'Intellion',
    marketShare: { [ProductType.CPU]: 30, [ProductType.GPU]: 5 },
    productQuality: { [ProductType.CPU]: 75, [ProductType.GPU]: 40 },
    aggressiveness: 60,
    cashReserves: 15000000,
    techLevel: { [ProductType.CPU]: 3, [ProductType.GPU]: 1 },
    money: 15000000,
    history: [15000000],
    lastReleaseDay: -100
  },
  {
    id: 'comp_amd',
    name: 'Advanced Micro',
    marketShare: { [ProductType.CPU]: 15, [ProductType.GPU]: 20 },
    productQuality: { [ProductType.CPU]: 65, [ProductType.GPU]: 65 },
    aggressiveness: 75,
    cashReserves: 10000000,
    techLevel: { [ProductType.CPU]: 3, [ProductType.GPU]: 3 },
    money: 10000000,
    history: [10000000],
    lastReleaseDay: -80
  },
  {
    id: 'comp_nvidia',
    name: 'Nvidio',
    marketShare: { [ProductType.CPU]: 2, [ProductType.GPU]: 40 },
    productQuality: { [ProductType.CPU]: 30, [ProductType.GPU]: 85 },
    aggressiveness: 80,
    cashReserves: 20000000,
    techLevel: { [ProductType.CPU]: 1, [ProductType.GPU]: 4 },
    money: 20000000,
    history: [20000000],
    lastReleaseDay: -50
  },
  {
    id: 'comp_apple',
    name: 'Fruit Silicon',
    marketShare: { [ProductType.CPU]: 10, [ProductType.GPU]: 5 },
    productQuality: { [ProductType.CPU]: 90, [ProductType.GPU]: 60 },
    aggressiveness: 40,
    cashReserves: 50000000,
    techLevel: { [ProductType.CPU]: 4, [ProductType.GPU]: 2 },
    money: 50000000,
    history: [50000000],
    lastReleaseDay: -120
  }
];

// Achievement Constants
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_chip',
    title: 'Hello World',
    description: 'Produce your first CPU.',
    icon: 'Cpu',
    condition: (state) => state.inventory.CPU > 0 || state.financialHistory.some(h => h.money > INITIAL_MONEY),
    reward: { type: 'reputation', value: 5 }
  },
  {
    id: 'ach_millionaire',
    title: 'Seed Money',
    description: 'Reach $1,000,000 in cash.',
    icon: 'DollarSign',
    condition: (state) => state.money >= 1000000,
    reward: { type: 'rp', value: 100 }
  },
  {
    id: 'ach_decamillionaire',
    title: 'Series A',
    description: 'Reach $10,000,000 in cash.',
    icon: 'Briefcase',
    condition: (state) => state.money >= 10000000,
    reward: { type: 'reputation', value: 10 }
  },
  {
    id: 'ach_centimillionaire',
    title: 'Big Player',
    description: 'Reach $100,000,000 in cash.',
    icon: 'Building2',
    condition: (state) => state.money >= 100000000,
    reward: { type: 'rp', value: 500 }
  },
  {
    id: 'ach_billionaire',
    title: 'Unicorn',
    description: 'Reach $1,000,000,000 in cash.',
    icon: 'TrendingUp',
    condition: (state) => state.money >= 1000000000,
    reward: { type: 'reputation', value: 50 }
  },
  {
    id: 'ach_trillionaire',
    title: 'Global Hegemon',
    description: 'Reach $1 Trillion in cash.',
    icon: 'Globe',
    condition: (state) => state.money >= 1000000000000,
    reward: { type: 'rp', value: 5000 }
  },
  {
    id: 'ach_mass_production',
    title: 'Mass Production',
    description: 'Produce 1,000 total units.',
    icon: 'Package',
    condition: (state) => (state.inventory.CPU + state.inventory.GPU) >= 1000, // Note: This checks current inventory, ideally should track lifetime production
    reward: { type: 'rp', value: 100 }
  },
  {
    id: 'ach_industrial_giant',
    title: 'Industrial Giant',
    description: 'Produce 10,000 total units.',
    icon: 'Factory',
    condition: (state) => (state.inventory.CPU + state.inventory.GPU) >= 10000,
    reward: { type: 'rp', value: 250 }
  },
  {
    id: 'ach_researcher',
    title: 'Eureka!',
    description: 'Complete your first research.',
    icon: 'FlaskConical',
    condition: (state) => state.techLevels.CPU > 0 || state.techLevels.GPU > 0,
    reward: { type: 'rp', value: 250 }
  },
  {
    id: 'ach_tech_pioneer',
    title: 'Tech Pioneer',
    description: 'Reach max CPU tech level.',
    icon: 'Cpu',
    condition: (state) => state.techLevels.CPU >= 5, // Assuming 5 is max for now based on earlier context
    reward: { type: 'reputation', value: 20 }
  },
  {
    id: 'ach_graphics_wizard',
    title: 'Graphics Wizard',
    description: 'Reach max GPU tech level.',
    icon: 'Monitor',
    condition: (state) => state.techLevels.GPU >= 5,
    reward: { type: 'reputation', value: 20 }
  },
  {
    id: 'ach_lab_rat',
    title: 'Lab Rat',
    description: 'Hire 5 Researchers.',
    icon: 'Users',
    condition: (state) => state.researchers >= 5,
    reward: { type: 'rp', value: 100 }
  },
  {
    id: 'ach_research_institute',
    title: 'Research Institute',
    description: 'Hire 20 Researchers.',
    icon: 'Microscope',
    condition: (state) => state.researchers >= 20,
    reward: { type: 'rp', value: 1000 }
  },
  {
    id: 'ach_headhunter',
    title: 'Headhunter',
    description: 'Hire a Hero character.',
    icon: 'UserPlus',
    condition: (state) => state.hiredHeroes.length >= 1,
    reward: { type: 'reputation', value: 15 }
  },
  {
    id: 'ach_dream_team',
    title: 'Dream Team',
    description: 'Hire 3 Hero characters.',
    icon: 'Star',
    condition: (state) => state.hiredHeroes.length >= 3,
    reward: { type: 'rp', value: 2000 }
  },
  {
    id: 'ach_garage_days',
    title: 'Garage Days',
    description: 'Survive 30 days.',
    icon: 'Calendar',
    condition: (state) => state.day >= 30,
    reward: { type: 'rp', value: 50 }
  },
  {
    id: 'ach_anniversary',
    title: 'Anniversary',
    description: 'Survive 365 days.',
    icon: 'Cake',
    condition: (state) => state.day >= 365,
    reward: { type: 'reputation', value: 25 }
  },
  {
    id: 'ach_veteran',
    title: 'Veteran',
    description: 'Survive 1000 days.',
    icon: 'Medal',
    condition: (state) => state.day >= 1000,
    reward: { type: 'rp', value: 5000 }
  },
  {
    id: 'ach_corporate_ladder',
    title: 'Corporate Ladder',
    description: 'Upgrade office to Corporate level.',
    icon: 'Building',
    condition: (state) => state.officeLevel >= OfficeLevel.CORPORATE,
    reward: { type: 'reputation', value: 10 }
  },
  {
    id: 'ach_sky_high',
    title: 'Sky High',
    description: 'Upgrade office to Headquarters.',
    icon: 'Building2',
    condition: (state) => state.officeLevel >= OfficeLevel.HEADQUARTERS,
    reward: { type: 'reputation', value: 50 }
  },
  {
    id: 'ach_famous',
    title: 'Famous',
    description: 'Reach 50% Brand Awareness.',
    icon: 'Megaphone',
    condition: (state) => state.brandAwareness.CPU >= 50 || state.brandAwareness.GPU >= 50,
    reward: { type: 'rp', value: 500 }
  },
  {
    id: 'ach_household_name',
    title: 'Household Name',
    description: 'Reach 100% Brand Awareness.',
    icon: 'Radio',
    condition: (state) => state.brandAwareness.CPU >= 100 || state.brandAwareness.GPU >= 100,
    reward: { type: 'reputation', value: 30 }
  },
  {
    id: 'ach_spy_games',
    title: 'Spy Games',
    description: 'Perform a successful Espionage.',
    icon: 'Eye',
    condition: (state) => state.logs.some(l => l.tag === 'espionage_success'),
    reward: { type: 'rp', value: 500 }
  },
  {
    id: 'ach_saboteur',
    title: 'Saboteur',
    description: 'Perform a successful Sabotage.',
    icon: 'Bomb',
    condition: (state) => state.logs.some(l => l.tag === 'sabotage_success'),
    reward: { type: 'rp', value: 250 }
  },
  {
    id: 'ach_ipo',
    title: 'Going Public',
    description: 'Launch an IPO.',
    icon: 'LineChart',
    condition: (state) => state.isPubliclyTraded,
    reward: { type: 'rp', value: 1000 }
  },
  {
    id: 'ach_monopoly',
    title: 'Market Dominance',
    description: 'Reach 90% Reputation.',
    icon: 'Crown',
    condition: (state) => state.reputation >= 90,
    reward: { type: 'rp', value: 500 }
  }
];

// --- TRANSLATIONS ---


// --- TRANSLATIONS ---
export const TRANSLATIONS = {
  en: {
    repUnknown: "Unknown",
    repLocal: "Local Brand (+10% Price)",
    repNational: "National Star (-15% Silicon Cost)",
    repGlobal: "Global Player (+20% Contract Pay)",
    repTitan: "Tech Titan (+25% Research Speed)",
    startNew: "START NEW CORP",
    continue: "RESUME SESSION",
    welcome: "SILICON TYCOON",
    subtitle: "Corporate Management Simulation",
    resetWarning: "This will wipe your current save.",
    day: "Day",
    netWorth: "Net Worth",
    research: "Research",
    factory: "FACTORY",
    rnd: "R&D",
    market: "MARKET",
    paused: "PAUSED",
    productionHalted: "Production Halted",
    resume: "RESUME",
    saveAndExit: "SAVE & EXIT",
    tabLocked: "FEATURE LOCKED",
    tabLockedDesc: "Upgrade your office or complete the tutorial to unlock.",
    systemOnline: "SYSTEM ONLINE. WAITING FOR DATA...",
    rep: "Rep",
    silicon: "Silicon",
    newRun: "New Run. Legacy:",

    //Manifactoring
    manufacturing: "Manufacturing",
    marketValue: "Market Value",
    price: "Price",
    designLab: "DESIGN LAB",
    engineeringStation: "Engineering Station",
    budgetChip: "Budget Chip",
    flagship: "Flagship",
    defect: "Defect %",
    clock: "Clock",
    tdp: "TDP",

    // Factory
    design: "DESIGN",
    done: "DONE",
    unitCost: "Unit Cost",
    unitPrice: "Unit Price",
    performance: "Performance",
    efficiency: "Efficiency",
    budget: "Budget",
    highEnd: "High-End",
    powerHungry: "Power Hungry",
    ecoFriendly: "Eco-Friendly",
    inStock: "In Stock",
    line: "Line",
    noSilicon: "NO SILICON",
    produce: "PRODUCE",
    marketTrend: "Market Trend",
    requiredSpec: "Required Spec",
    officeLevel: "Office Level",
    upgrade: "Upgrade:",
    maxed: "MAXED",
    upgradeInfra: "UPGRADE INFRASTRUCTURE",
    siliconSupply: "Silicon Supply",
    purchaseSilicon: "PURCHASE 100 UNITS",
    assemblyLines: "Assembly Lines",
    strategy: "Strategy",

    // Research
    nextMilestone: "Next Milestone",
    baseCost: "Base Cost",
    basePrice: "Base Price",
    researchBtn: "RESEARCH",
    techMastered: "Technology Mastered",

    rndDept: "R&D Department",
    dailyOutput: "Daily Output",
    researchers: "Researchers",
    activeStaff: "Active Staff",
    hireStaff: "HIRE STAFF",
    headhunters: "Headhunters",
    scrollMore: "Scroll for more",
    hired: "HIRED",
    hire: "HIRE",
    techRoadmap: "Tech Roadmap",
    cpuArch: "CPU Architecture",
    gpuArch: "GPU Architecture",
    policyRelaxedDesc: "High Morale, Low Output (-20% Salary)",
    policyNormalDesc: "Balanced workflow.",
    policyCrunchDesc: "Danger: High Output, Staff may quit! (+50% Salary)",

    // Market
    sales: "Sales",
    contracts: "Contracts",
    stocks: "Stocks",
    warfare: "Warfare",
    model: "Model",
    trendMatch: "Trend Match",
    trendMiss: "Trend Miss",
    marketPrice: "Market Price",
    inventory: "Inventory",
    sellBatch: "SELL BATCH",
    rivalAlert: "Rival Alert",
    cashFlow: "Cash Flow",
    noContracts: "No Contracts Available",
    daysLeft: "Days Left",
    accept: "ACCEPT",
    privateCompany: "Private Company",
    valuationGoal: "Valuation needs to reach",
    launchIPO: "LAUNCH IPO",
    publiclyTraded: "Publicly Traded",
    sharePrice: "Share Price",
    ownership: "Ownership",
    globalExchange: "Global Exchange",
    owned: "Owned",
    buy: "BUY",
    sell: "SELL",
    espionage: "Espionage",
    stealTech: "Steal Tech",
    sabotage: "Sabotage",
    crippleRivals: "Cripple Rivals",
    retire: "RETIRE (PRESTIGE)",
    impact: "Impact",
    left: "left",
    days: "days",

    //Banka
    bank: "Bank & Loans",
    takeLoan: "TAKE LOAN",
    payLoan: "PAY OFF",
    dailyInterest: "Daily Interest",
    activeLoans: "Active Loans",
    hrPolicy: "HR Policy",
    morale: "Staff Morale",
    policyRelaxed: "Relaxed (Low Stress)",
    policyNormal: "9-to-5 (Standard)",
    policyCrunch: "CRUNCH TIME (High Output)",
    moraleLowWarning: "Staff is burning out!",
    valuation: "Company Valuation",
    buyBack: "BUY BACK SHARES",
    dilute: "SELL SHARES (DILUTE)",
    ownershipWarning: "Danger! Ownership too low!",
    needUpgrade: "Need Office Upgrade",
    finance: "FINANCE",
    bankruptcyWarning: "BANKRUPTCY ALERT! Positive balance required in 60 days!",
    gameOver: "GAME OVER",
    fired: "You have been fired for insolvency.",
    tryAgain: "TRY AGAIN",
    fireStaff: "FIRE (-$500)",
    firedAlert: "Staff fired. Morale dropped!",
    settings: "SETTINGS",
    soundEffects: "Sound Effects",
    soundDesc: "Enable game audio",
    vibration: "Vibration",
    vibrationDesc: "Haptic feedback",
    close: "CLOSE",
    loanRejectedLimit: "Bank rejected! Too many active loans.",
    loanRejectedOffice: "Bank rejected! Office too small.",
    loanApproved: "Loan approved. Interest rate 1.5%",
    loanRepaid: "Loan Repaid! Credit score improved.",
    selectTarget: "SELECT TARGET",
    noActiveDebt: "No Active Debt",
    leader: "LEADER",
    old: "OLD",
    valuationGoalAmount: "$100k",
    returnToMenu: "RETURN TO MAIN MENU",
    designName: "Design Name",
    selectEditDesign: "Select 'Edit Design' to create a new blueprint.",
    noActiveLines: "No active production lines for",
    buildNewLine: "Build New Line ($50k)",
    outputDaily: "Output: {0}/day",
    productionAmount: "Production Amount",
    units: "units",
    siliconNeeded: "Silicon Needed",
    totalCost: "Total Cost",
    available: "Available",
    current: "Current",
    siliconCap: "Silicon Cap",
    welcomeBack: "Welcome Back, CEO",
    offlineMessage: "A.L.I.C.E. managed operations for {0} minutes while you were away.",
    earnings: "Earnings",
    collectResources: "COLLECT RESOURCES",
    achievements: "ACHIEVEMENTS",
    achievementUnlocked: "Achievement Unlocked!",
    marketing: "MARKETING",
    campaigns: "Campaigns",
    brandAwareness: "Brand Awareness",
    activeCampaigns: "Active Campaigns",
    launch: "LAUNCH",
    cost: "Cost",
    duration: "Duration",
    boost: "Boost",
    type: "Type",
    unlocked: "UNLOCKED",
    reward: "REWARD",

    // Bailout & Daily Bonus
    bailoutTitle: "COMPANY BANKRUPT!",
    bailoutDesc: "Your funds have depleted. The board is furious! An Angel Investor is offering a lifeline.",
    bailoutOffer: "INVESTMENT OFFER",
    watchAdGetFunds: "Watch Ad & Get Funds",
    declineBailout: "No thanks, I accept bankruptcy",
    dailyBonus: "DAILY BONUS",
    freeSpinAvailable: "Free Spin Available!",
    adSpinsRemaining: "{0} Ad Spins Remaining",
    spinning: "SPINNING...",
    spinFree: "SPIN FREE",
    watchAdToSpin: "WATCH AD TO SPIN",
    noSpinsLeft: "NO SPINS LEFT",
    youWon: "You Won",

    // General UI
    version: "v1.0.0 • Early Access",
    cash: "CASH",
    rndAcronym: "R&D",
    repAcronym: "REP",
    nextEra: "Next Era",
    marketModifiers: "Market Modifiers",
    cpuDemand: "CPU Demand",
    gpuDemand: "GPU Demand",
    locked: "LOCKED",
    cap: "Cap",
    premium: "Premium",

    // Heroes
    hero_steve_name: "Steve W.",
    hero_steve_role: "Marketing Guru",
    hero_steve_desc: "Increases sales prices by 20%. Very demanding.",
    hero_linus_name: "Linus T.",
    hero_linus_role: "Kernel Architect",
    hero_linus_desc: "Doubles RP production from all researchers.",
    hero_elon_name: "Elon M.",
    hero_elon_role: "Visionary",
    hero_elon_desc: "Increases company valuation and stock volatility.",

    // Eras
    era_pc_name: "PC REVOLUTION",
    era_pc_desc: "Dawn of personal computers. CPUs are king.",
    era_mobile_name: "MOBILE ERA",
    era_mobile_desc: "Smartphones everywhere. Efficiency matters.",
    era_ai_name: "AI SINGULARITY",
    era_ai_desc: "Generative AI explosion. Insane GPU demand.",

    // Market Trends
    trend_neutral_name: "Balanced Market",
    trend_neutral_desc: "Stable demand across all sectors.",
    trend_green_name: "Energy Crisis",
    trend_green_desc: "Energy costs soaring! Efficiency is king.",
    trend_servers_name: "Server Boom",
    trend_servers_desc: "Data centers expanding! Efficient CPUs needed.",
    trend_cloud_name: "Cloud Computing Wave",
    trend_cloud_desc: "Cloud providers buying bulk CPUs!",
    trend_office_name: "Corporate Refresh",
    trend_office_desc: "Companies upgrading office PCs.",
    trend_ai_name: "AI Revolution",
    trend_ai_desc: "Machine learning boom! High GPU demand!",
    trend_gaming_name: "Gaming Craze",
    trend_gaming_desc: "New AAA games released! Gamers need power!",
    trend_crypto_name: "Crypto Mining",
    trend_crypto_desc: "Bitcoin rising! Miners buying all GPUs!",
    trend_vr_name: "VR/AR Boom",
    trend_vr_desc: "Virtual reality entering mainstream!",
    trend_streaming_name: "Creator Boom",
    trend_streaming_desc: "Streamers and creators need powerful GPUs!",

    // Tech Tree
    cpu_0_name: "8-bit Processor",
    cpu_1_name: "16-bit Processor",
    cpu_2_name: "32-bit RISC",
    cpu_3_name: "32-bit CISC",
    cpu_4_perf_name: "64-bit High-Freq",
    cpu_4_eff_name: "64-bit Low-Power",
    cpu_5_perf_name: "Dual-Core HT",
    cpu_5_eff_name: "Dual-Core Budget",
    cpu_6_perf_name: "Quad-Core OC",
    cpu_6_eff_name: "Quad-Core Mobile",
    cpu_7_perf_name: "Octa-Core Extreme",
    cpu_7_eff_name: "Octa-Core Efficient",
    cpu_8_name: "16-Core Workstation",
    cpu_9_name: "64-Core EPYC",

    gpu_0_name: "VGA Graphics",
    gpu_1_name: "SVGA Graphics",
    gpu_2_name: "3D Accelerator",
    gpu_3_name: "T&L GPU",
    gpu_4_perf_name: "Shader Model 1.0",
    gpu_4_eff_name: "Budget Shader",
    gpu_5_perf_name: "Shader Model 2.0",
    gpu_5_eff_name: "DirectX 8.1 GPU",
    gpu_6_perf_name: "Shader Model 3.0",
    gpu_6_eff_name: "DirectX 9c GPU",
    gpu_7_perf_name: "Unified Shader",
    gpu_7_eff_name: "DirectX 10 GPU",
    gpu_8_perf_name: "GDDR5 High-End",
    gpu_8_eff_name: "GDDR5 Mid-Range",
    gpu_9_perf_name: "Real-Time Lighting",
    gpu_9_eff_name: "HBM2 Compute",

    // Market Tab
    estUnitCost: "Est. Unit Cost",
    siliconCost: "Material Cost",
    netProfit: "Net Profit",
    avgCost: "Avg Cost",
    pl: "P/L",

    // Research Tab
    policyRelaxedName: "RELAXED",
    policyNormalName: "NORMAL",
    policyCrunchName: "CRUNCH",

    // Hacking Minigame
    hackProtocol: "BREACH PROTOCOL",
    hackLocked: "LOCKED",
    hackGranted: "ACCESS GRANTED",
    hackDetected: "DETECTED",
    hackInstruction: "Stop the cursor inside the highlighted zone to bypass security firewall.",
    hackExecute: "EXECUTE HACK",
    hackUploading: "UPLOADING VIRUS...",
    hackLost: "CONNECTION LOST",



    // Marketing Campaigns
    camp_social_name: "Social Media Ads",
    camp_social_desc: "Targeted ads on popular platforms.",
    camp_influencer_name: "Tech Influencer Review",
    camp_influencer_desc: "Send products to top tech YouTubers.",
    camp_tv_name: "TV Commercial",
    camp_tv_desc: "Prime time slot on national TV.",
    camp_event_name: "Tech Expo Booth",
    camp_event_desc: "Major presence at the annual Tech Expo.",

    // Office Names & Descs
    office_garage_name: "Mom's Garage",
    office_garage_desc: "Free but tiny. Max 2 staff.",
    office_basement_name: "Basement Lab",
    office_basement_desc: "Cheap underground space. Poor ventilation.",
    office_startup_name: "Startup Office",
    office_startup_desc: "Real business starts here.",
    office_corporate_name: "Corporate Floor",
    office_corporate_desc: "Professional environment with amenities.",
    office_campus_name: "Tech Campus",
    office_campus_desc: "Massive production capacity.",
    office_hq_name: "Silicon HQ",
    office_hq_desc: "Global dominance.",

    // Factory UI
    nextLevel: "Next Level",
    rent: "Rent",
    maxResearchers: "Max Researchers",
    upgradeCost: "Upgrade Cost",

    // Competitors (NEW)
    competitors: "Competitors",
    marketShare: "Market Share",
    quality: "Quality",

    // Production (NEW)
    maintenance: "Maintenance",
    maintain: "MAINTAIN",
    specialization: "Specialization",
    speed: "Speed",
    normal: "Normal",
    defectRate: "Defect Rate",
    // Logs & Notifications
    logRdEstablished: "R&D Dept. Established.",

    // Statistics Tab
    marketValuation: "Market Valuation",
    competitorAnalysis: "Competitor Analysis",
    company: "Company",
    techLevel: "Tech (CPU/GPU)",
    share: "Share",
    you: "You",
    marketRanking: "Market Ranking",
    marketLeader: "MARKET LEADER",
    top3: "TOP 3",
    aheadOfYou: "AHEAD OF YOU",
    behindYou: "BEHIND YOU",
    marketLeaderboard: "Market Leaderboard",
    techAvg: "Tech Avg",
    marketDominance: "Market Dominance",
    cpuMarket: "CPU Market",
    gpuMarket: "GPU Market",
    yourValuation: "Your Valuation",


    // Market Tab
    boardIntervention: "Board Intervention",
    penaltyPrestige: "Penalty: -{0} Prestige",
    logFinanceEstablished: "Finance Dept. Established. IPO ready.",
    logContractFailed: "Contract FAILED! Client furious.",
    logContractOrder: "ORDER: {0}x {1}",
    logContractDeadline: "Deadline: {0} Days",
    logGlobalTech: "Global Tech Advance: Competitors launched Tier {0} {1}!",
    logEraChange: "ERA CHANGE: {0} has begun!",
    logMarketShift: "MARKET SHIFT: {0}!",
    logRivalAlert: "RIVAL ALERT: {0} launched a new product!",
    logResignCritical: "CRITICAL: Toxic environment causing rapid staff turnover!",
    logResignMass: "MASS RESIGNATION: 3 researchers quit in protest!",
    logResignBad: "BAD MORALE: {0} researchers walked out.",
    logResignSingle: "RESIGNATION: A researcher left for a better offer.",
    logBankInterest: "Bank: Weekly interest deducted.",
    logRentPaid: "Office Rent Paid.",
    logEspionageSuccess: "Espionage success! Stole tech from {0}.",
    logSabotageSuccess: "Sabotage success! Crippled {0}.",
    logOpFailed: "Op Failed! {0} traced you.",
    logBankRejectedLimit: "Bank rejected! Too many active loans.",
    logBankRejectedOffice: "Bank rejected! Office too small.",
    logLoanApproved: "Loan approved. Interest rate 1.5%",
    logLoanTaken: "Loan Taken: ${0}k",
    logLoanRepaid: "Loan Repaid! Credit score improved.",
    logLoanPaid: "Paid off ${0}k loan.",
    logWelcomeBack: "Welcome Back, CEO",
    logCampaignLaunched: "Launched {0} for {1}!",
    logOfflineMessage: "While you were away, your company earned {0} and gained {1} RP.",
    logOverdriveExpired: "⚡ Production Overdrive Expired",
    logDailyReset: "🌞 A new day has dawned! Daily bonuses reset.",
    evtMarketBoom: "MARKET BOOM!",
    evtMarketCrash: "MARKET CRASH!",
    evtSiliconShortageTitle: "SILICON SHORTAGE!",
    logResearcherQuit: "A researcher quit due to low morale.",
    selectProduct: "Select Product",
    designSpecs: "Design Specifications",
    production: "Production",
    amount: "Amount",
    insufficientFunds: "Insufficient Funds",
    statistics: "STATISTICS",
    dailyDemand: "Daily Demand",
    lowDemand: "Low Demand",
    currentGen: "Current Gen",
    bonus: "Bonus",
    outdatedTech: "Outdated Tech",
    ancientTech: "Ancient Tech",
    afterEconomy: "After Economy",
    totalRevenue: "Total Revenue",
    noInventory: "No Inventory",
    // Achievements
    ach_millionaire_title: "Seed Money",
    ach_millionaire_desc: "Reach $1,000,000 in cash.",
    ach_decamillionaire_title: "Series A",
    ach_decamillionaire_desc: "Reach $10,000,000 in cash.",
    ach_centimillionaire_title: "Big Player",
    ach_centimillionaire_desc: "Reach $100,000,000 in cash.",
    ach_billionaire_title: "Unicorn",
    ach_billionaire_desc: "Reach $1,000,000,000 in cash.",
    ach_trillionaire_title: "Global Hegemon",
    ach_trillionaire_desc: "Reach $1 Trillion in cash.",
    ach_mass_production_title: "Mass Production",
    ach_mass_production_desc: "Produce 1,000 total units.",
    ach_industrial_giant_title: "Industrial Giant",
    ach_industrial_giant_desc: "Produce 10,000 total units.",
    ach_researcher_title: "Eureka!",
    ach_researcher_desc: "Complete your first research.",
    ach_tech_pioneer_title: "Tech Pioneer",
    ach_tech_pioneer_desc: "Reach max CPU tech level.",
    ach_graphics_wizard_title: "Graphics Wizard",
    ach_graphics_wizard_desc: "Reach max GPU tech level.",
    ach_lab_rat_title: "Lab Rat",
    ach_lab_rat_desc: "Hire 5 Researchers.",
    ach_research_institute_title: "Research Institute",
    ach_research_institute_desc: "Hire 20 Researchers.",
    ach_headhunter_title: "Headhunter",
    ach_headhunter_desc: "Hire a Hero character.",
    ach_dream_team_title: "Dream Team",
    ach_dream_team_desc: "Hire 3 Hero characters.",
    ach_garage_days_title: "Garage Days",
    ach_garage_days_desc: "Survive 30 days.",
    ach_anniversary_title: "Anniversary",
    ach_anniversary_desc: "Survive 365 days.",
    ach_veteran_title: "Veteran",
    ach_veteran_desc: "Survive 1000 days.",
    ach_corporate_ladder_title: "Corporate Ladder",
    ach_corporate_ladder_desc: "Upgrade office to Corporate level.",
    ach_sky_high_title: "Sky High",
    ach_sky_high_desc: "Upgrade office to Headquarters.",
    ach_famous_title: "Famous",
    ach_famous_desc: "Reach 50% Brand Awareness.",
    ach_household_name_title: "Household Name",
    ach_household_name_desc: "Reach 100% Brand Awareness.",
    ach_spy_games_title: "Spy Games",
    ach_spy_games_desc: "Perform a successful Espionage.",
    ach_saboteur_title: "Saboteur",
    ach_saboteur_desc: "Perform a successful Sabotage.",
    ach_ipo_title: "Going Public",
    ach_ipo_desc: "Launch an IPO.",
    ach_monopoly_title: "Market Dominance",
    ach_monopoly_desc: "Reach 90% Reputation.",

    // General Actions
    cancel: "CANCEL",
    confirm: "CONFIRM",
    trendMatched: "Trend Matched",
    trendMissed: "Trend Missed",
    downgrade: "DOWNGRADE",
    downgradeTo: "Downgrade to:",
    downgradeConfirm: "Are you sure you want to downgrade?",
    downgradeCost: "Moving Cost",
    minPerf: "Min Perf",
    minEff: "Min Eff",
    upfront: "Upfront",
    completion: "Completion",
    req: "Req",
    produceCpu: "Produce CPU",
    produceGpu: "Produce GPU",
    balancedMarket: "Balanced Market",
    highVolatility: "High Volatility",
    infrastructure: "Infrastructure",
    now: "Now",
    later: "Later",



    // Logs
    logYield: "Yield: {0}%. {1} defects sold as budget chips for ${2}.",
    logContractFulfilled: "Contract Fulfilled! Payment received.",
    logSold: "Sold {0}x {1} units.",
    logWarehouseFull: "Warehouse Full! Upgrade needed.",
    logHQUpgraded: "HQ Upgraded to {0}!",
    logHQDowngraded: "HQ Downgraded to {0}. Rent reduced.",
    logTechBreakthrough: "Tech Breakthrough! Market Leader! (+{0} Prestige)",
    logTechUnlocked: "Tech Unlocked!",
    logHeadhunted: "Headhunted {0}!",
    logStockBuyback: "Stock Buyback: +{0}% Ownership",
    logStockDilution: "Stock Dilution: -{0}% Ownership",
    logMaintained: "Maintained production line. Efficiency restored to 100%.",
    logInsufficientFunds: "Insufficient Funds for Operation",

    // Events
    evt_cyber_title: "CYBER ATTACK!",
    evt_cyber_desc: "Hackers infiltrated your servers. Research data corrupted.",
    evt_viral_title: "VIRAL REVIEW",
    evt_viral_desc: "A famous tech tuber praised your products. Demand surging!",
    evt_shortage_title: "SILICON SHORTAGE",
    evt_shortage_desc: "Global supply chain issues. Silicon prices skyrocketed.",
    evt_grant_title: "GOVERNMENT GRANT",
    evt_grant_desc: "Received a tech innovation grant.",
    evt_dotcom_title: "DOT-COM BUBBLE BURST",
    evt_dotcom_desc: "Market crash! Tech stocks plummeting.",
    evt_y2k_title: "Y2K BUG SCARE",
    evt_y2k_desc: "Critical software updates needed. Research halted.",
    evt_appstore_title: "APP ECOSYSTEM LAUNCH",
    evt_appstore_desc: "Mobile software demand skyrocketing!",
    evt_social_title: "SOCIAL MEDIA EXPLOSION",
    evt_social_desc: "Data centers expanding. High server CPU demand.",
    evt_agi_title: "AGI BREAKTHROUGH",
    evt_agi_desc: "Artificial General Intelligence achieved! Research speed x2.",
    evt_robot_tax_title: "AUTOMATION TAX",
    evt_robot_tax_desc: "New laws tax AI usage. Costs increased.",
    evt_quantum_title: "QUANTUM SUPREMACY",
    evt_quantum_desc: "Quantum computing breakthrough. Encryption tech valued.",

    // Board Missions
    mission_profit: "Board Demand: Reach ${0} Profit",
    mission_quality: "Board Demand: Achieve {0}% Quality",
    mission_prestige: "Board Demand: Reach {0} Prestige",
    mission_penalty: "Board Mission Failed! Prestige -{0}",
    mission_deadline: "Deadline: {0} Days",

    // IPO
    ipoConfirmTitle: "Launch IPO?",
    ipoConfirmDesc: "You are about to take your company public.",
    ipoShareSale: "You will sell 40% of your shares.",
    ipoCashGain: "Estimated Cash Gain: ${0}",
    ipoWarning: "Warning: If your ownership drops below 50%, the Board will intervene."
  },
  tr: {
    repUnknown: "Bilinmiyor",
    repLocal: "Yerel Marka (+%10 Fiyat)",
    repNational: "Ulusal Yıldız (-%15 Silikon Maliyeti)",
    repGlobal: "Küresel Oyuncu (+%20 Sözleşme Ödemesi)",
    repTitan: "Teknoloji Devi (+%25 Araştırma Hızı)",
    startNew: "YENİ ŞİRKET KUR",
    continue: "DEVAM ET",
    welcome: "SİLİKON TYCOON",
    subtitle: "Şirket Yönetim Simülasyonu",
    resetWarning: "Bu işlem mevcut kaydınızı silecek.",
    day: "Gün",
    netWorth: "Net Değer",
    research: "ARAŞTIR (R&D)",
    factory: "FABRİKA",
    rnd: "AR-GE",
    market: "PAZAR",
    paused: "DURAKLATILDI",
    productionHalted: "Üretim Durduruldu",
    resume: "DEVAM ET",
    saveAndExit: "KAYDET & ÇIK",
    tabLocked: "ÖZELLİK KİLİTLİ",
    tabLockedDesc: "Kilidi açmak için ofisinizi yükseltin veya eğitimi tamamlayın.",
    systemOnline: "SİSTEM ÇEVRİMİÇİ. VERİ BEKLENİYOR...",
    rep: "İtibar",
    silicon: "Silikon",
    newRun: "Yeni Oyun. Miras:",

    //Manifactoring
    manufacturing: "Üretim",
    marketValue: "Piyasa Değeri",
    price: "Fiyat",
    designLab: "TASARIM LAB",
    engineeringStation: "Mühendislik İstasyonu",
    budgetChip: "Bütçe Çipi",
    flagship: "Amiral Gemisi",
    defect: "Hata %",
    clock: "Hız",
    tdp: "TDP",

    // Factory
    design: "TASARIM",
    done: "BİTTİ",
    unitCost: "Birim Maliyet",
    unitPrice: "Birim Fiyat",
    performance: "Performans",
    efficiency: "Verimlilik",
    budget: "Bütçe",
    highEnd: "Yüksek Performans",
    powerHungry: "Güç Canavarı",
    ecoFriendly: "Çevre Dostu",
    inStock: "Stokta",
    line: "Hat",
    noSilicon: "SİLİKON YOK",
    produce: "ÜRET (CRAFT)",
    marketTrend: "Pazar Trendi",
    requiredSpec: "Gereken Özellik",
    officeLevel: "Ofis Seviyesi",
    upgrade: "YÜKSELT (UPGRADE)",
    maxed: "MAKSİMUM",
    upgradeInfra: "ALTYAPIYI YÜKSELT",
    siliconSupply: "Silikon Tedariği",
    purchaseSilicon: "100 BİRİM SATIN AL",
    assemblyLines: "Montaj Hatları",
    strategy: "Strateji",

    // Research
    nextMilestone: "Sonraki Hedef",
    baseCost: "Taban Maliyet",
    basePrice: "Taban Fiyat",
    researchBtn: "ARAŞTIR",
    techMastered: "Teknoloji Tamamlandı",

    rndDept: "Ar-Ge Departmanı",
    dailyOutput: "Günlük Çıktı",
    researchers: "Araştırmacılar",
    activeStaff: "Aktif Personel",
    hireStaff: "PERSONEL AL",
    headhunters: "Kelle Avcıları",
    scrollMore: "Daha fazlası için kaydır",
    hired: "ALINDI",
    hire: "İŞE AL",
    techRoadmap: "Teknoloji Yol Haritası",
    cpuArch: "CPU Mimarisi",
    gpuArch: "GPU Mimarisi",
    policyRelaxedDesc: "Yüksek Moral, Düşük Çıktı (-%20 Maaş)",
    policyNormalDesc: "Dengeli iş akışı.",
    policyCrunchDesc: "Tehlike: Yüksek Çıktı, Personel istifa edebilir! (+%50 Maaş)",

    // Market
    sales: "Satışlar",
    contracts: "Sözleşmeler",
    stocks: "Hisseler",
    warfare: "Savaş",
    model: "Model",
    trendMatch: "Trend Uyumu",
    trendMiss: "Trend Kaçtı",
    marketPrice: "Piyasa Fiyatı",
    inventory: "Envanter",
    sellBatch: "PARTİ SAT",
    rivalAlert: "Rakip Uyarısı",
    cashFlow: "Nakit Akışı",
    noContracts: "Mevcut Sözleşme Yok",
    daysLeft: "Gün Kaldı",
    accept: "KABUL ET",
    privateCompany: "Özel Şirket",
    valuationGoal: "Hedeflenen Değerleme",
    launchIPO: "HALKA ARZ BAŞLAT",
    publiclyTraded: "Halka Açık",
    sharePrice: "Hisse Fiyatı",
    ownership: "Sahiplik",
    globalExchange: "Küresel Borsa",
    owned: "Sahip Olunan",
    buy: "AL",
    sell: "SAT",
    espionage: "Casusluk",
    stealTech: "Teknoloji Çal",
    sabotage: "Sabotaj",
    crippleRivals: "Rakipleri Baltala",
    retire: "EMEKLİ OL (PRESTİJ)",
    impact: "Etki",
    left: "kaldı",
    days: "gün",

    //Banka
    bank: "Banka & Krediler",
    takeLoan: "KREDİ ÇEK",
    payLoan: "ÖDE",
    dailyInterest: "Günlük Faiz",
    activeLoans: "Aktif Krediler",
    hrPolicy: "İK Politikası",
    morale: "Personel Morali",
    policyRelaxed: "Rahat (Düşük Stres)",
    policyNormal: "9-5 (Standart)",
    policyCrunch: "MESAİ (Yüksek Çıktı)",
    moraleLowWarning: "Personel tükeniyor!",
    valuation: "Şirket Değerlemesi",
    buyBack: "HİSSE GERİ AL",
    dilute: "HİSSE SAT (SEYRELT)",
    ownershipWarning: "Tehlike! Sahiplik çok düşük!",
    needUpgrade: "Ofis Yükseltmesi Gerekli",
    finance: "FİNANS",
    bankruptcyWarning: "İFLAS UYARISI! 60 gün içinde pozitif bakiye gerekli!",
    gameOver: "OYUN BİTTİ",
    fired: "İflas nedeniyle kovuldunuz.",
    tryAgain: "TEKRAR DENE",
    fireStaff: "KOV (-$500)",
    firedAlert: "Personel kovuldu. Moral düştü!",
    settings: "AYARLAR",
    soundEffects: "Ses Efektleri",
    soundDesc: "Oyun seslerini aç",
    vibration: "Titreşim",
    vibrationDesc: "Dokunsal geri bildirim",
    close: "KAPAT",
    loanRejectedLimit: "Banka reddetti! Çok fazla aktif kredi var.",
    loanRejectedOffice: "Banka reddetti! Ofis çok küçük.",
    loanApproved: "Kredi onaylandı. Faiz oranı %1.5",
    loanRepaid: "Kredi Ödendi! Kredi puanı arttı.",
    selectTarget: "HEDEF SEÇ",
    noActiveDebt: "Aktif Borç Yok",
    leader: "LİDER",
    old: "ESKİ",
    valuationGoalAmount: "$100k",
    returnToMenu: "ANA MENÜYE DÖN",
    designName: "Tasarım Adı",
    selectEditDesign: "Yeni bir plan oluşturmak için 'Tasarımı Düzenle'yi seçin.",
    noActiveLines: "Aktif üretim hattı yok:",
    buildNewLine: "Yeni Hat Kur ($50k)",
    outputDaily: "Çıktı: {0}/gün",
    productionAmount: "Üretim Miktarı",
    units: "birim",
    siliconNeeded: "Gereken Silikon",
    totalCost: "Toplam Maliyet",
    available: "Mevcut",
    current: "Şu anki",
    siliconCap: "Silikon Kapasitesi",
    welcomeBack: "Tekrar Hoşgeldiniz, CEO",
    offlineMessage: "Siz yokken A.L.I.C.E. operasyonları {0} dakika yönetti.",
    earnings: "Kazançlar",
    collectResources: "KAYNAKLARI TOPLA",
    achievements: "BAŞARILAR",
    achievementUnlocked: "Başarım Kilidi Açıldı!",
    marketing: "PAZARLAMA",
    campaigns: "Kampanyalar",
    brandAwareness: "Marka Bilinirliği",
    activeCampaigns: "Aktif Kampanyalar",
    launch: "BAŞLAT",
    cost: "Maliyet",
    duration: "Süre",
    boost: "BOOST",
    type: "Tür",
    unlocked: "AÇILDI",
    reward: "ÖDÜL",

    // Bailout & Daily Bonus
    bailoutTitle: "ŞİRKET İFLAS ETTİ!",
    bailoutDesc: "Paranız bitti. Yönetim kurulu öfkeli! Bir Melek Yatırımcı can simidi uzatıyor.",
    bailoutOffer: "YATIRIM TEKLİFİ",
    watchAdGetFunds: "Reklam İzle & Fon Al",
    declineBailout: "Hayır, iflası kabul ediyorum",
    dailyBonus: "GÜNLÜK BONUS",
    freeSpinAvailable: "Ücretsiz Çevirme Hakkı!",
    adSpinsRemaining: "{0} Reklamlı Çevirme Kaldı",
    spinning: "ÇEVRİLİYOR...",
    spinFree: "ÜCRETSİZ ÇEVİR",
    watchAdToSpin: "REKLAM İZLE VE ÇEVİR",
    noSpinsLeft: "HAK KALMADI",
    youWon: "Kazandın",

    // Statistics Tab
    marketRanking: "Piyasa Sıralaması",
    marketLeader: "PİYASA LİDERİ",
    top3: "İLK 3",
    aheadOfYou: "ÖNÜNDEKİ RAKİP",
    behindYou: "ARKANDAKİ RAKİP",
    marketLeaderboard: "Liderlik Tablosu",
    you: "SEN",
    techAvg: "Teknoloji Ort.",
    marketDominance: "Pazar Hakimiyeti",
    cpuMarket: "CPU Pazarı",
    gpuMarket: "GPU Pazarı",
    yourValuation: "Şirket Değeri",
    techLevel: "Teknoloji Seviyesi",


    // Gamer Lingo Refinements

    downgrade: "KÜÇÜLT (DOWNGRADE)",
    buff: "BUFF",
    nerf: "NERF",
    drop: "DROP",
    loot: "LOOT",
    grind: "GRIND",
    farm: "FARM",
    op: "OP (Aşırı Güçlü)",
    bug: "BUG",
    glitch: "GLITCH",
    lag: "LAG",
    ban: "BAN",
    kick: "KICK",
    report: "REPORT",
    gg: "GG (İyi Oyundu)",
    wp: "WP (İyi Oynadın)",
    ez: "EZ (Kolaydı)",
    noob: "NOOB (Çaylak)",
    pro: "PRO (Profesyonel)",
    rush: "RUSH (Hücum)",
    camp: "CAMP (Pusu)",
    feed: "FEED (Besleme)",
    carry: "CARRY (Taşıma)",
    tank: "TANK",
    dps: "DPS (Saniye Başına Hasar)",
    healer: "HEALER (Şifacı)",
    support: "SUPPORT (Destek)",
    jungle: "JUNGLE (Orman)",
    mid: "MID (Orta Koridor)",
    top: "TOP (Üst Koridor)",
    bot: "BOT (Alt Koridor)",
    adc: "ADC (Nişancı)",
    apc: "APC (Büyücü)",
    assassin: "ASSASSIN (Suikastçı)",
    mage: "MAGE (Büyücü)",
    warrior: "WARRIOR (Savaşçı)",
    paladin: "PALADIN (Şövalye)",
    rogue: "ROGUE (Hırsız)",
    priest: "PRIEST (Rahip)",
    shaman: "SHAMAN (Şaman)",
    druid: "DRUID (Druid)",
    warlock: "WARLOCK (Cadı)",
    hunter: "HUNTER (Avcı)",
    monk: "MONK (Keşiş)",
    deathknight: "DEATH KNIGHT (Ölüm Şövalyesi)",
    demonhunter: "DEMON HUNTER (İblis Avcısı)",
    bard: "BARD (Ozan)",
    necromancer: "NECROMANCER (Ölüm Büyücüsü)",
    sorcerer: "SORCERER (Büyücü)",
    wizard: "WIZARD (Büyücü)",
    cleric: "CLERIC (Rahip)",
    barbarian: "BARBARIAN (Barbar)",
    fighter: "FIGHTER (Dövüşçü)",
    ranger: "RANGER (Korucu)",

    // General UI
    version: "v1.0.0 • Erken Erişim",
    cash: "NAKİT",
    rndAcronym: "AR-GE",
    repAcronym: "İTİBAR",
    nextEra: "Sonraki Çağ",
    marketModifiers: "Pazar Çarpanları",
    cpuDemand: "CPU Talebi",
    gpuDemand: "GPU Talebi",
    locked: "KİLİTLİ",
    cap: "Kap",

    // Market Tab
    estUnitCost: "Tahmini Birim Maliyet",
    siliconCost: "Malzeme Maliyeti",
    netProfit: "Net Kâr",
    avgCost: "Ort. Maliyet",
    pl: "K/Z",

    // Research Tab
    policyRelaxedName: "RAHAT",
    policyNormalName: "NORMAL",
    policyCrunchName: "MESAİ",

    // Hacking Minigame
    hackProtocol: "İHLAL PROTOKOLÜ",
    hackLocked: "KİLİTLİ",
    hackGranted: "ERİŞİM İZNİ VERİLDİ",
    hackDetected: "TESPİT EDİLDİ",
    hackInstruction: "Güvenlik duvarını aşmak için imleci vurgulanan alanda durdurun.",
    hackExecute: "HACK'İ BAŞLAT",
    hackUploading: "VİRÜS YÜKLENİYOR...",
    hackLost: "BAĞLANTI KOPTU",



    // Marketing Campaigns
    camp_social_name: "Sosyal Medya Reklamları",
    camp_social_desc: "Popüler platformlarda hedefli reklamlar.",
    camp_influencer_name: "Teknoloji Fenomeni İncelemesi",
    camp_influencer_desc: "Ürünleri en iyi teknoloji YouTuber'larına gönder.",
    camp_tv_name: "TV Reklamı",
    camp_tv_desc: "Ulusal kanalda prime time kuşağı.",
    camp_event_name: "Teknoloji Fuarı Standı",
    camp_event_desc: "Yıllık Teknoloji Fuarı'nda büyük katılım.",

    // Office Names & Descs
    office_garage_name: "Annemin Garajı",
    office_garage_desc: "Ücretsiz ama küçük. Maks 2 personel.",
    office_basement_name: "Bodrum Laboratuvarı",
    office_basement_desc: "Ucuz yeraltı alanı. Havalandırma kötü.",
    office_startup_name: "Girişim Ofisi",
    office_startup_desc: "Gerçek iş burada başlıyor.",
    office_corporate_name: "Kurumsal Kat",
    office_corporate_desc: "İmkanları olan profesyonel ortam.",
    office_campus_name: "Teknoloji Kampüsü",
    office_campus_desc: "Devasa üretim kapasitesi.",
    office_hq_name: "Silikon Genel Merkezi",
    office_hq_desc: "Küresel hakimiyet.",

    // Factory UI
    nextLevel: "Sonraki Seviye",
    rent: "Kira",
    maxResearchers: "Maks Araştırmacı",
    upgradeCost: "Yükseltme Maliyeti",

    // Competitors (NEW)
    competitors: "Rakipler",
    marketShare: "Pazar Payı",
    quality: "Kalite",

    // Production (NEW)
    maintenance: "Bakım",
    maintain: "BAKIM YAP",
    specialization: "Uzmanlaşma",
    speed: "Hız",
    normal: "Normal",
    defectRate: "Hata Oranı",
    // Logs & Notifications
    logRdEstablished: "Ar-Ge Departmanı Kuruldu.",

    // Market Tab
    boardIntervention: "Yönetim Kurulu Müdahalesi",
    penaltyPrestige: "Ceza: -{0} Prestij",
    logFinanceEstablished: "Finans Departmanı Kuruldu. Halka Arz hazır.",
    logContractFailed: "Sözleşme BAŞARISIZ! Müşteri öfkeli.",
    logContractOrder: "SİPARİŞ: {0}x {1}",
    logContractDeadline: "Son Tarih: {0} Gün",
    share: "Pay",

    logGlobalTech: "Küresel Teknoloji İlerlemesi: Rakipler Seviye {0} {1} piyasaya sürdü!",
    logEraChange: "ÇAĞ DEĞİŞİMİ: {0} başladı!",
    logMarketShift: "PAZAR DEĞİŞİMİ: {0}!",
    logRivalAlert: "RAKİP UYARISI: {0} yeni bir ürün çıkardı!",
    logResignCritical: "KRİTİK: Zehirli ortam hızlı personel kaybına neden oluyor!",
    logResignMass: "TOPLU İSTİFA: 3 araştırmacı protesto ederek istifa etti!",
    logResignBad: "DÜŞÜK MORAL: {0} araştırmacı işi bıraktı.",
    logResignSingle: "İSTİFA: Bir araştırmacı daha iyi bir teklif için ayrıldı.",
    logBankInterest: "Banka: Haftalık faiz kesildi.",
    logRentPaid: "Ofis Kirası Ödendi.",
    logEspionageSuccess: "Casusluk başarılı! {0} şirketinden teknoloji çalındı.",
    logSabotageSuccess: "Sabotaj başarılı! {0} şirketi baltalandı.",
    logOpFailed: "Operasyon Başarısız! {0} izini sürdü.",
    logBankRejectedLimit: "Banka reddetti! Çok fazla aktif kredi var.",
    logBankRejectedOffice: "Banka reddetti! Ofis çok küçük.",
    logLoanApproved: "Kredi onaylandı. Faiz oranı %1.5",
    logLoanTaken: "${0}k kredi çekildi.",
    logLoanRepaid: "Kredi Ödendi! Kredi puanı arttı.",
    logLoanPaid: "${0}k kredi ödendi.",
    logWelcomeBack: "Tekrar Hoşgeldiniz, CEO",
    logCampaignLaunched: "{1} için {0} başlatıldı!",
    logOfflineMessage: "Siz yokken şirketiniz {0} kazandı ve {1} RP elde etti.",
    logOverdriveExpired: "⚡ Üretim Aşırı Hızı Sona Erdi",
    logDailyReset: "🌞 Yeni bir gün doğdu! Günlük bonuslar sıfırlandı.",
    evtMarketBoom: "PAZAR PATLAMASI!",
    evtMarketCrash: "PAZAR ÇÖKÜŞÜ!",
    evtSiliconShortageTitle: "SİLİKON KITLIĞI!",
    logResearcherQuit: "Düşük moral nedeniyle bir araştırmacı istifa etti.",
    selectProduct: "Ürün Seç",
    dailyDemand: "Günlük Talep",
    lowDemand: "Düşük Talep",
    currentGen: "Güncel Nesil",
    bonus: "Bonus",
    outdatedTech: "Eski Teknoloji",
    ancientTech: "Antika Teknoloji",
    afterEconomy: "Ekonomi Sonrası",
    totalRevenue: "Toplam Gelir",
    noInventory: "Envanter Yok",
    designSpecs: "Tasarım Özellikleri",
    production: "Üretim",
    amount: "Miktar",
    insufficientFunds: "Yetersiz Bakiye",
    premium: "Premium",

    // Heroes
    hero_steve_name: "Steve W.",
    hero_steve_role: "Pazarlama Gurusu",
    hero_steve_desc: "Satış fiyatlarını %20 artırır. Çok talepkar.",
    hero_linus_name: "Linus T.",
    hero_linus_role: "Çekirdek Mimarı",
    hero_linus_desc: "Tüm araştırmacıların AR-GE üretimini ikiye katlar.",
    hero_elon_name: "Elon M.",
    hero_elon_role: "Vizyoner",
    hero_elon_desc: "Şirket değerlemesini ve hisse oynaklığını artırır.",

    // Eras
    era_pc_name: "PC DEVRİMİ",
    era_pc_desc: "Kişisel bilgisayarların doğuşu. CPU'lar kral.",
    era_mobile_name: "MOBİL ÇAĞ",
    era_mobile_desc: "Akıllı telefonlar her yerde. Verimlilik önemli.",
    era_ai_name: "YAPAY ZEKA TEKİLLİĞİ",
    era_ai_desc: "Üretken YZ patlaması. İnanılmaz GPU talebi.",

    // Market Trends
    trend_neutral_name: "Dengeli Pazar",
    trend_neutral_desc: "Tüm sektörlerde istikrarlı talep.",
    trend_green_name: "Enerji Krizi",
    trend_green_desc: "Enerji maliyetleri fırladı! Verimlilik kraldır.",
    trend_servers_name: "Sunucu Patlaması",
    trend_servers_desc: "Veri merkezleri genişliyor! Verimli CPU'lar gerekli.",
    trend_cloud_name: "Bulut Bilişim Dalgası",
    trend_cloud_desc: "Bulut sağlayıcıları toplu CPU alıyor!",
    trend_office_name: "Kurumsal Yenileme",
    trend_office_desc: "Şirketler ofis bilgisayarlarını yeniliyor.",
    trend_ai_name: "YZ Devrimi",
    trend_ai_desc: "Makine öğrenimi patlaması! Yüksek GPU talebi!",
    trend_gaming_name: "Oyun Çılgınlığı",
    trend_gaming_desc: "Yeni AAA oyunlar çıktı! Oyuncuların güce ihtiyacı var!",
    trend_crypto_name: "Kripto Madenciliği",
    trend_crypto_desc: "Bitcoin yükseliyor! Madenciler tüm GPU'ları alıyor!",
    trend_vr_name: "VR/AR Patlaması",
    trend_vr_desc: "Sanal gerçeklik ana akıma giriyor!",
    trend_streaming_name: "Yayıncı Patlaması",
    trend_streaming_desc: "Yayıncılar ve içerik üreticileri güçlü GPU'lara ihtiyaç duyuyor!",

    // Tech Tree
    cpu_0_name: "8-bit İşlemci",
    cpu_1_name: "16-bit İşlemci",
    cpu_2_name: "32-bit RISC",
    cpu_3_name: "32-bit CISC",
    cpu_4_perf_name: "64-bit Yüksek Frekans",
    cpu_4_eff_name: "64-bit Düşük Güç",
    cpu_5_perf_name: "Çift Çekirdek HT",
    cpu_5_eff_name: "Çift Çekirdek Bütçe",
    cpu_6_perf_name: "Dört Çekirdek OC",
    cpu_6_eff_name: "Dört Çekirdek Mobil",
    cpu_7_perf_name: "Sekiz Çekirdek Extreme",
    cpu_7_eff_name: "Sekiz Çekirdek Verimli",
    cpu_8_name: "16-Çekirdek İş İstasyonu",
    cpu_9_name: "64-Çekirdek EPYC",

    gpu_0_name: "VGA Grafik",
    gpu_1_name: "SVGA Grafik",
    gpu_2_name: "3D Hızlandırıcı",
    gpu_3_name: "T&L GPU",
    gpu_4_perf_name: "Shader Model 1.0",
    gpu_4_eff_name: "Bütçe Shader",
    gpu_5_perf_name: "Shader Model 2.0",
    gpu_5_eff_name: "DirectX 8.1 GPU",
    gpu_6_perf_name: "Shader Model 3.0",
    gpu_6_eff_name: "DirectX 9c GPU",
    gpu_7_perf_name: "Unified Shader",
    gpu_7_eff_name: "DirectX 10 GPU",
    gpu_8_perf_name: "GDDR5 Yüksek",
    gpu_8_eff_name: "GDDR5 Orta",
    gpu_9_perf_name: "Gerçek Zamanlı Işıklandırma",
    gpu_9_eff_name: "HBM2 Hesaplama",
    statistics: "İSTATİSTİKLER",
    // Achievements
    ach_millionaire_title: "Başlangıç Sermayesi",
    ach_millionaire_desc: "$1,000,000 nakite ulaş.",
    ach_decamillionaire_title: "Seri A",
    ach_decamillionaire_desc: "$10,000,000 nakite ulaş.",
    ach_centimillionaire_title: "Büyük Oyuncu",
    ach_centimillionaire_desc: "$100,000,000 nakite ulaş.",
    ach_billionaire_title: "Unicorn",
    ach_billionaire_desc: "$1,000,000,000 nakite ulaş.",
    ach_trillionaire_title: "Küresel Hegemonya",
    ach_trillionaire_desc: "$1 Trilyon nakite ulaş.",
    ach_mass_production_title: "Seri Üretim",
    ach_mass_production_desc: "Toplam 1,000 birim üret.",
    ach_industrial_giant_title: "Sanayi Devi",
    ach_industrial_giant_desc: "Toplam 10,000 birim üret.",
    ach_researcher_title: "Buldum!",
    ach_researcher_desc: "İlk araştırmanı tamamla.",
    ach_tech_pioneer_title: "Teknoloji Öncüsü",
    ach_tech_pioneer_desc: "Maksimum CPU teknoloji seviyesine ulaş.",
    ach_graphics_wizard_title: "Grafik Sihirbazı",
    ach_graphics_wizard_desc: "Maksimum GPU teknoloji seviyesine ulaş.",
    ach_lab_rat_title: "Laboratuvar Faresi",
    ach_lab_rat_desc: "5 Araştırmacı işe al.",
    ach_research_institute_title: "Araştırma Enstitüsü",
    ach_research_institute_desc: "20 Araştırmacı işe al.",
    ach_headhunter_title: "Kelle Avcısı",
    ach_headhunter_desc: "Bir Kahraman karakter işe al.",
    ach_dream_team_title: "Rüya Takım",
    ach_dream_team_desc: "3 Kahraman karakter işe al.",
    ach_garage_days_title: "Garaj Günleri",
    ach_garage_days_desc: "30 gün hayatta kal.",
    ach_anniversary_title: "Yıl Dönümü",
    ach_anniversary_desc: "365 gün hayatta kal.",
    ach_veteran_title: "Kıdemli",
    ach_veteran_desc: "1000 gün hayatta kal.",
    ach_corporate_ladder_title: "Kurumsal Merdiven",
    ach_corporate_ladder_desc: "Ofisi Kurumsal seviyeye yükselt.",
    ach_sky_high_title: "Göklerde",
    ach_sky_high_desc: "Ofisi Genel Merkez seviyesine yükselt.",
    ach_famous_title: "Ünlü",
    ach_famous_desc: "%50 Marka Bilinirliğine ulaş.",
    ach_household_name_title: "Herkesin Bildiği İsim",
    ach_household_name_desc: "%100 Marka Bilinirliğine ulaş.",
    ach_spy_games_title: "Casus Oyunları",
    ach_spy_games_desc: "Başarılı bir Casusluk gerçekleştir.",
    ach_saboteur_title: "Sabotajcı",
    ach_saboteur_desc: "Başarılı bir Sabotaj gerçekleştir.",
    ach_ipo_title: "Halka Arz",
    ach_ipo_desc: "Halka arz başlat.",
    ach_monopoly_title: "Pazar Hakimiyeti",
    ach_monopoly_desc: "%90 İtibara ulaş.",

    // General Actions
    cancel: "İPTAL",
    confirm: "ONAYLA",
    trendMatched: "Trend Yakalandı",
    trendMissed: "Trend Kaçırıldı",

    downgradeTo: "Şuna küçült:",
    downgradeConfirm: "Küçültmek istediğinize emin misiniz?",
    downgradeCost: "Taşınma Maliyeti",
    minPerf: "Min Perf",
    minEff: "Min Verim",
    upfront: "Peşin",
    completion: "Tamamlama",
    req: "Gereksinim",
    produceCpu: "CPU Üret",
    produceGpu: "GPU Üret",
    balancedMarket: "Dengeli Pazar",
    highVolatility: "Yüksek Volatilite",
    infrastructure: "Altyapı",
    now: "Şimdi",
    later: "Sonra",

    // Logs
    logYield: "Verim: %{0}. {1} hatalı ürün bütçe çipi olarak ${2} karşılığında satıldı.",
    logContractFulfilled: "Sözleşme Tamamlandı! Ödeme alındı.",
    logSold: "{0}x {1} birim satıldı.",
    logWarehouseFull: "Depo Dolu! Yükseltme gerekiyor.",
    logHQUpgraded: "Genel Merkez {0} seviyesine yükseltildi!",
    logHQDowngraded: "Genel Merkez {0} seviyesine düşürüldü. Kira azaldı.",
    logTechBreakthrough: "Teknolojik Atılım! Pazar Lideri! (+{0} Prestij)",
    logTechUnlocked: "Teknoloji Kilidi Açıldı!",
    logHeadhunted: "{0} transfer edildi!",
    logStockBuyback: "Hisse Geri Alımı: +%{0} Sahiplik",
    logStockDilution: "Hisse Seyreltme: -%{0} Sahiplik",
    logMaintained: "Üretim hattı bakımı yapıldı. Verimlilik %100'e döndü.",
    logInsufficientFunds: "Operasyon için Yetersiz Bakiye",

    // Events
    evt_cyber_title: "SİBER SALDIRI!",
    evt_cyber_desc: "Hackerlar sunucularınıza sızdı. Araştırma verileri bozuldu.",
    evt_viral_title: "VİRAL İNCELEME",
    evt_viral_desc: "Ünlü bir teknoloji yayıncısı ürünlerinizi övdü. Talep patlıyor!",
    evt_shortage_title: "SİLİKON KITLIĞI",
    evt_shortage_desc: "Küresel tedarik zinciri sorunları. Silikon fiyatları fırladı.",
    evt_grant_title: "DEVLET HİBESİ",
    evt_grant_desc: "Teknoloji inovasyon hibesi aldınız.",
    evt_dotcom_title: "DOT-COM BALONU PATLADI",
    evt_dotcom_desc: "Pazar çöküşü! Teknoloji hisseleri çakılıyor.",
    evt_y2k_title: "Y2K HATASI KORKUSU",
    evt_y2k_desc: "Kritik yazılım güncellemeleri gerekli. Araştırma durduruldu.",
    evt_appstore_title: "UYGULAMA EKOSİSTEMİ BAŞLANGICI",
    evt_appstore_desc: "Mobil yazılım talebi hızla artıyor!",
    evt_social_title: "SOSYAL MEDYA PATLAMASI",
    evt_social_desc: "Veri merkezleri genişliyor. Yüksek sunucu CPU talebi.",
    evt_agi_title: "YAPAY GENEL ZEKA ATILIMI",
    evt_agi_desc: "Yapay Genel Zeka'ya ulaşıldı! Araştırma hızı x2.",
    evt_robot_tax_title: "OTOMASYON VERGİSİ",
    evt_robot_tax_desc: "Yeni yasalar yapay zeka kullanımını vergilendiriyor. Maliyetler arttı.",
    evt_quantum_title: "KUANTUM ÜSTÜNLÜĞÜ",
    evt_quantum_desc: "Kuantum hesaplama atılımı. Şifreleme teknolojisi değerlendi.",

    // Board Missions
    mission_profit: "Yönetim Talebi: ${0} Kâra Ulaş",
    mission_quality: "Yönetim Talebi: %{0} Kaliteye Ulaş",
    mission_prestige: "Yönetim Talebi: {0} Prestije Ulaş",
    mission_penalty: "Yönetim Görevi Başarısız! Prestij -{0}",
    mission_deadline: "Son Tarih: {0} Gün",

    // IPO
    ipoConfirmTitle: "Halka Arz Başlatılsın mı?",
    ipoConfirmDesc: "Şirketinizi halka açmak üzeresiniz.",
    ipoShareSale: "Hisselerinizin %40'ını satacaksınız.",
    ipoCashGain: "Tahmini Nakit Kazancı: ${0}",
    ipoWarning: "Uyarı: Sahiplik oranınız %50'nin altına düşerse, Yönetim Kurulu müdahale edecektir."
  }
};



export const MARKET_TRENDS: MarketTrend[] = [
  // Universal Trends
  {
    id: 'trend_neutral',
    name: 'Balanced Market',
    description: 'Stable demand across all sectors.',
    requiredSpec: 'performance',
    minSpecValue: 0,
    priceBonus: 1.0,
    penalty: 1.0,
    affectedProducts: [ProductType.CPU, ProductType.GPU]
  },
  {
    id: 'trend_green',
    name: 'Energy Crisis',
    description: 'Energy costs soaring! Efficiency is king.',
    requiredSpec: 'efficiency',
    minSpecValue: 70,
    priceBonus: 1.6,
    penalty: 0.5,
    affectedProducts: [ProductType.CPU, ProductType.GPU]
  },

  // CPU-Specific Trends
  {
    id: 'trend_servers',
    name: 'Server Boom',
    description: 'Data centers expanding! Efficient CPUs needed.',
    requiredSpec: 'efficiency',
    minSpecValue: 65,
    priceBonus: 1.8,
    penalty: 0.7,
    affectedProducts: [ProductType.CPU],
    requiredEra: ['era_pc', 'era_mobile']
  },
  {
    id: 'trend_cloud',
    name: 'Cloud Computing Wave',
    description: 'Cloud providers buying bulk CPUs!',
    requiredSpec: 'efficiency',
    minSpecValue: 60,
    priceBonus: 1.5,
    penalty: 0.8,
    affectedProducts: [ProductType.CPU],
    requiredEra: ['era_mobile', 'era_ai']
  },
  {
    id: 'trend_office',
    name: 'Corporate Refresh',
    description: 'Companies upgrading office PCs.',
    requiredSpec: 'efficiency',
    minSpecValue: 50,
    priceBonus: 1.3,
    penalty: 0.9,
    affectedProducts: [ProductType.CPU]
  },

  // GPU-Specific Trends
  {
    id: 'trend_ai',
    name: 'AI Revolution',
    description: 'Machine learning boom! High GPU demand!',
    requiredSpec: 'performance',
    minSpecValue: 75,
    priceBonus: 2.0,
    penalty: 0.6,
    affectedProducts: [ProductType.GPU],
    requiredEra: ['era_ai']
  },
  {
    id: 'trend_gaming',
    name: 'Gaming Craze',
    description: 'New AAA games released! Gamers need power!',
    requiredSpec: 'performance',
    minSpecValue: 80,
    priceBonus: 1.9,
    penalty: 0.5,
    affectedProducts: [ProductType.GPU]
  },
  {
    id: 'trend_crypto',
    name: 'Crypto Mining',
    description: 'Bitcoin rising! Miners buying all GPUs!',
    requiredSpec: 'performance',
    minSpecValue: 70,
    priceBonus: 2.2,
    penalty: 0.4,
    affectedProducts: [ProductType.GPU],
    requiredEra: ['era_mobile', 'era_ai'] // Late mobile / AI
  },
  {
    id: 'trend_vr',
    name: 'VR/AR Boom',
    description: 'Virtual reality entering mainstream!',
    requiredSpec: 'performance',
    minSpecValue: 75,
    priceBonus: 1.7,
    penalty: 0.6,
    affectedProducts: [ProductType.GPU],
    requiredEra: ['era_mobile', 'era_ai']
  },
  {
    id: 'trend_streaming',
    name: 'Creator Boom',
    description: 'Streamers and creators need powerful GPUs!',
    requiredSpec: 'performance',
    minSpecValue: 65,
    priceBonus: 1.5,
    penalty: 0.7,
    affectedProducts: [ProductType.GPU],
    requiredEra: ['era_mobile', 'era_ai']
  }
];


// Eras
export const ERAS: GameEra[] = [
  {
    id: 'era_pc',
    name: 'PC REVOLUTION',
    startDay: 0,
    description: 'Dawn of personal computers. CPUs are king.',
    cpuDemandMod: 1.2,
    gpuDemandMod: 0.8
  },
  {
    id: 'era_mobile',
    name: 'MOBILE ERA',
    startDay: 150,
    description: 'Smartphones everywhere. Efficiency matters.',
    cpuDemandMod: 0.9,
    gpuDemandMod: 1.1
  },
  {
    id: 'era_ai',
    name: 'AI SINGULARITY',
    startDay: 365,
    description: 'Generative AI explosion. Insane GPU demand.',
    cpuDemandMod: 1.0,
    gpuDemandMod: 2.0
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

export const OFFICE_CONFIGS = {
  [OfficeLevel.GARAGE]: {
    name: "Mom's Garage",
    rent: 0,
    maxResearchers: 2,
    siliconCap: 200,
    upgradeCost: 25000,
    description: "Free but tiny. Max 2 staff."
  },
  [OfficeLevel.BASEMENT]: {
    name: "Basement Lab",
    rent: 200,
    maxResearchers: 5,
    siliconCap: 1000,
    upgradeCost: 100000,
    description: "Cheap underground space. Poor ventilation."
  },
  [OfficeLevel.STARTUP]: {
    name: "Startup Office",
    rent: 1000,
    maxResearchers: 15,
    siliconCap: 5000,
    upgradeCost: 500000,
    description: "Real business starts here."
  },
  [OfficeLevel.CORPORATE]: {
    name: "Corporate Floor",
    rent: 5000,
    maxResearchers: 40,
    siliconCap: 20000,
    upgradeCost: 2500000,
    description: "Professional environment with amenities."
  },
  [OfficeLevel.CAMPUS]: {
    name: "Tech Campus",
    rent: 15000,
    maxResearchers: 100,
    siliconCap: 100000,
    upgradeCost: 10000000,
    description: "Massive production capacity."
  },
  [OfficeLevel.HEADQUARTERS]: {
    name: "Silicon HQ",
    rent: 50000,
    maxResearchers: 300,
    siliconCap: 1000000,
    upgradeCost: 0,
    description: "Global dominance."
  }
};


// Tech Tree for CPUs (10 TIERS with Branching) - BALANCED PROGRESSION
export const CPU_TECH_TREE: TechNode[] = [
  { id: 'cpu_0', name: '8-bit Processor', tier: 0, productionCost: 25, baseMarketPrice: 50, researchCost: 0, branch: 'balanced', yield: 100 },
  { id: 'cpu_1', name: '16-bit Processor', tier: 1, productionCost: 70, baseMarketPrice: 120, researchCost: 500, branch: 'balanced', prerequisites: ['cpu_0'], yield: 95 },
  { id: 'cpu_2', name: '32-bit RISC', tier: 2, productionCost: 200, baseMarketPrice: 420, researchCost: 1500, branch: 'balanced', prerequisites: ['cpu_1'], yield: 90 },
  { id: 'cpu_3', name: '32-bit CISC', tier: 3, productionCost: 650, baseMarketPrice: 1450, researchCost: 8000, branch: 'balanced', prerequisites: ['cpu_2'], yield: 85 },

  // Tier 4: Branching starts
  { id: 'cpu_4_perf', name: '64-bit High-Freq', tier: 4, productionCost: 1800, baseMarketPrice: 2900, researchCost: 35000, branch: 'performance', prerequisites: ['cpu_3'], specialBonus: { type: 'market', value: 10 }, yield: 75 },
  { id: 'cpu_4_eff', name: '64-bit Low-Power', tier: 4, productionCost: 1400, baseMarketPrice: 2300, researchCost: 28000, branch: 'efficiency', prerequisites: ['cpu_3'], specialBonus: { type: 'production', value: 15 }, yield: 80 },

  // Tier 5
  { id: 'cpu_5_perf', name: 'Dual-Core HT', tier: 5, productionCost: 4500, baseMarketPrice: 7200, researchCost: 120000, branch: 'performance', prerequisites: ['cpu_4_perf'], yield: 70 },
  { id: 'cpu_5_eff', name: 'Dual-Core Budget', tier: 5, productionCost: 3500, baseMarketPrice: 5600, researchCost: 90000, branch: 'efficiency', prerequisites: ['cpu_4_eff'], yield: 75 },

  // Tier 6
  { id: 'cpu_6_perf', name: 'Quad-Core OC', tier: 6, productionCost: 11000, baseMarketPrice: 17500, researchCost: 350000, branch: 'performance', prerequisites: ['cpu_5_perf'], yield: 65 },
  { id: 'cpu_6_eff', name: 'Quad-Core Mobile', tier: 6, productionCost: 8500, baseMarketPrice: 13500, researchCost: 270000, branch: 'efficiency', prerequisites: ['cpu_5_eff'], yield: 70 },

  // Tier 7
  { id: 'cpu_7_perf', name: 'Octa-Core Extreme', tier: 7, productionCost: 28000, baseMarketPrice: 44000, researchCost: 900000, branch: 'performance', prerequisites: ['cpu_6_perf'], yield: 60 },
  { id: 'cpu_7_eff', name: 'Octa-Core Efficient', tier: 7, productionCost: 21000, baseMarketPrice: 33000, researchCost: 660000, branch: 'efficiency', prerequisites: ['cpu_6_eff'], yield: 65 },

  // Tier 8
  { id: 'cpu_8', name: '16-Core Workstation', tier: 8, productionCost: 65000, baseMarketPrice: 102000, researchCost: 2000000, branch: 'balanced', prerequisites: ['cpu_7_perf', 'cpu_7_eff'], yield: 55 },

  // Tier 9
  { id: 'cpu_9', name: '64-Core EPYC', tier: 9, productionCost: 180000, baseMarketPrice: 280000, researchCost: 5500000, branch: 'balanced', prerequisites: ['cpu_8'], yield: 50 },
];


// Tech Tree for GPUs (10 TIERS with Branching) - REBALANCED (Higher cost, lower yield)
export const GPU_TECH_TREE: TechNode[] = [
  { id: 'gpu_0', name: 'VGA Graphics', tier: 0, productionCost: 40, baseMarketPrice: 70, researchCost: 0, branch: 'balanced', yield: 95 },
  { id: 'gpu_1', name: 'SVGA Graphics', tier: 1, productionCost: 120, baseMarketPrice: 200, researchCost: 800, branch: 'balanced', prerequisites: ['gpu_0'], yield: 90 },
  { id: 'gpu_2', name: '3D Accelerator', tier: 2, productionCost: 330, baseMarketPrice: 540, researchCost: 2500, branch: 'balanced', prerequisites: ['gpu_1'], yield: 85 },
  { id: 'gpu_3', name: 'T&L GPU', tier: 3, productionCost: 1000, baseMarketPrice: 1650, researchCost: 12000, branch: 'balanced', prerequisites: ['gpu_2'], yield: 80 },

  // Tier 4: Branching starts  
  { id: 'gpu_4_perf', name: 'Shader Model 1.0', tier: 4, productionCost: 3000, baseMarketPrice: 4950, researchCost: 50000, branch: 'performance', prerequisites: ['gpu_3'], specialBonus: { type: 'market', value: 12 }, yield: 70 },
  { id: 'gpu_4_eff', name: 'Budget Shader', tier: 4, productionCost: 2300, baseMarketPrice: 3800, researchCost: 40000, branch: 'efficiency', prerequisites: ['gpu_3'], specialBonus: { type: 'production', value: 18 }, yield: 75 },

  // Tier 5
  { id: 'gpu_5_perf', name: 'Shader Model 2.0', tier: 5, productionCost: 7500, baseMarketPrice: 12300, researchCost: 180000, branch: 'performance', prerequisites: ['gpu_4_perf'], yield: 65 },
  { id: 'gpu_5_eff', name: 'DirectX 8.1 GPU', tier: 5, productionCost: 5700, baseMarketPrice: 9400, researchCost: 135000, branch: 'efficiency', prerequisites: ['gpu_4_eff'], yield: 70 },

  // Tier 6
  { id: 'gpu_6_perf', name: 'Shader Model 3.0', tier: 6, productionCost: 18000, baseMarketPrice: 29500, researchCost: 500000, branch: 'performance', prerequisites: ['gpu_5_perf'], specialBonus: { type: 'market', value: 18 }, yield: 60 },
  { id: 'gpu_6_eff', name: 'DirectX 9c GPU', tier: 6, productionCost: 13500, baseMarketPrice: 22000, researchCost: 380000, branch: 'efficiency', prerequisites: ['gpu_5_eff'], specialBonus: { type: 'production', value: 25 }, yield: 65 },

  // Tier 7
  { id: 'gpu_7_perf', name: 'Unified Shader', tier: 7, productionCost: 45000, baseMarketPrice: 73500, researchCost: 1300000, branch: 'performance', prerequisites: ['gpu_6_perf'], yield: 55 },
  { id: 'gpu_7_eff', name: 'DirectX 10 GPU', tier: 7, productionCost: 33000, baseMarketPrice: 54000, researchCost: 950000, branch: 'efficiency', prerequisites: ['gpu_6_eff'], yield: 60 },

  // Tier 8
  { id: 'gpu_8_perf', name: 'GDDR5 High-End', tier: 8, productionCost: 120000, baseMarketPrice: 195000, researchCost: 3500000, branch: 'performance', prerequisites: ['gpu_7_perf'], specialBonus: { type: 'market', value: 30 }, yield: 45 },
  { id: 'gpu_8_eff', name: 'GDDR5 Mid-Range', tier: 8, productionCost: 87000, baseMarketPrice: 142000, researchCost: 2500000, branch: 'efficiency', prerequisites: ['gpu_7_eff'], specialBonus: { type: 'production', value: 35 }, yield: 55 },

  // Tier 9: Ultimate
  { id: 'gpu_9_perf', name: 'Real-Time Lighting', tier: 9, productionCost: 300000, baseMarketPrice: 485000, researchCost: 9000000, branch: 'performance', prerequisites: ['gpu_8_perf'], specialBonus: { type: 'market', value: 50 }, yield: 35 },
  { id: 'gpu_9_eff', name: 'HBM2 Compute', tier: 9, productionCost: 220000, baseMarketPrice: 355000, researchCost: 6500000, branch: 'efficiency', prerequisites: ['gpu_8_eff'], specialBonus: { type: 'production', value: 60 }, yield: 45 },
];

// Fictional Companies
export const INITIAL_STOCKS: Stock[] = [
  // Startups (High Volatility, Low Price)
  { id: 'stock_garage', symbol: 'GTK', name: 'GarageTek', currentPrice: 5.0, history: [5.0], owned: 0, avgBuyPrice: 0, volatility: 0.15 },
  { id: 'stock_pixel', symbol: 'PXL', name: 'PixelDreams', currentPrice: 8.0, history: [8.0], owned: 0, avgBuyPrice: 0, volatility: 0.12 },
  { id: 'stock_logic', symbol: 'LGC', name: 'LogicGate', currentPrice: 12.0, history: [12.0], owned: 0, avgBuyPrice: 0, volatility: 0.10 },

  // Small Cap (Growth Potential)
  { id: 'stock_wave', symbol: 'WAV', name: 'SiliconWave', currentPrice: 45.0, history: [45.0], owned: 0, avgBuyPrice: 0, volatility: 0.08 },
  { id: 'stock_chip', symbol: 'CHP', name: 'ChipMaster', currentPrice: 30.0, history: [30.0], owned: 0, avgBuyPrice: 0, volatility: 0.09 },
  { id: 'stock_nano', symbol: 'NNO', name: 'NanoSystems', currentPrice: 60.0, history: [60.0], owned: 0, avgBuyPrice: 0, volatility: 0.07 },

  // Mid Cap (Stable)
  { id: 'stock_future', symbol: 'FUT', name: 'FutureSystems', currentPrice: 120.0, history: [120.0], owned: 0, avgBuyPrice: 0, volatility: 0.05 },
  { id: 'stock_quantum', symbol: 'QTM', name: 'QuantumCore', currentPrice: 150.0, history: [150.0], owned: 0, avgBuyPrice: 0, volatility: 0.06 },
  { id: 'stock_cyber', symbol: 'CYB', name: 'CyberDyne', currentPrice: 180.0, history: [180.0], owned: 0, avgBuyPrice: 0, volatility: 0.04 },

  // Giants (Blue Chip)
  { id: 'stock_fruit', symbol: 'APPL', name: 'Fruit Silicon', currentPrice: 2500.0, history: [2500.0], owned: 0, avgBuyPrice: 0, volatility: 0.02 },
  { id: 'stock_micro', symbol: 'SFT', name: 'MicroSoft', currentPrice: 2800.0, history: [2800.0], owned: 0, avgBuyPrice: 0, volatility: 0.015 },
  { id: 'stock_goog', symbol: 'GGL', name: 'Goggle', currentPrice: 2500.0, history: [2500.0], owned: 0, avgBuyPrice: 0, volatility: 0.025 },
  { id: 'stock_nvid', symbol: 'NVD', name: 'Nvidio', currentPrice: 800.0, history: [800.0], owned: 0, avgBuyPrice: 0, volatility: 0.05 },
  { id: 'stock_intc', symbol: 'INT', name: 'Intellion', currentPrice: 450.0, history: [450.0], owned: 0, avgBuyPrice: 0, volatility: 0.03 },
  { id: 'stock_amd', symbol: 'AMD', name: 'Advanced Micro', currentPrice: 600.0, history: [600.0], owned: 0, avgBuyPrice: 0, volatility: 0.06 }
];

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

// --- HİKAYE & ATMOSFER METİNLERİ ---
export const FLAVOR_TEXTS = {
  en: {
    siliconSpike: [
      "BREAKING: Earthquake in Taiwan halts chip production!",
      "NEWS: Cargo ship stuck in canal. Supply chain frozen.",
      "ALERT: Trade war escalates! Tariffs on raw silicon increased.",
      "MARKET: Tech giant buys 40% of global silicon supply."
    ],
    siliconDrop: [
      "NEWS: New massive silicon deposit found in Africa.",
      "MARKET: Trade restrictions lifted. Materials flowing freely.",
      "UPDATE: Recycling breakthrough lowers material costs.",
      "NEWS: Competitor bankruptcy floods market with cheap supply."
    ],
    marketBoom: [
      "WALL STREET: Tech stocks rallying! Investors are euphoric.",
      "NEWS: Government announces massive tech subsidies.",
      "REPORT: Global demand for electronics hits all-time high.",
      "ANALYSIS: 'Golden Age of Silicon' declared by experts."
    ],
    marketCrash: [
      "PANIC: Global recession fears trigger sell-off!",
      "NEWS: Tech bubble bursts? Analysts advise caution.",
      "SCANDAL: Major bank collapse shakes tech sector.",
      "MARKET: Consumer spending drops to 10-year low."
    ],
    staffResign: [
      "MAIL: 'I can't take this stress anymore. I quit.'",
      "MAIL: 'My health is more important than this deadline. Goodbye.'",
      "HR ALERT: Lead researcher poached by rival company.",
      "MAIL: 'This toxic environment is destroying me. I'm leaving.'"
    ]
  },
  tr: {
    siliconSpike: [
      "SON DAKİKA: Tayvan'daki deprem çip üretimini durdurdu!",
      "HABER: Kargo gemisi kanalda sıkıştı. Tedarik zinciri dondu.",
      "UYARI: Ticaret savaşı kızışıyor! Ham silikon vergileri arttı.",
      "PİYASA: Teknoloji devi küresel silikon arzının %40'ını satın aldı."
    ],
    siliconDrop: [
      "HABER: Afrika'da devasa yeni silikon yatağı bulundu.",
      "PİYASA: Ticaret kısıtlamaları kalktı. Malzeme akışı rahatladı.",
      "GÜNCELLEME: Geri dönüşüm atılımı malzeme maliyetlerini düşürdü.",
      "HABER: Rakip iflası piyasayı ucuz stokla doldurdu."
    ],
    marketBoom: [
      "BORSA: Teknoloji hisseleri ralli yapıyor! Yatırımcılar coşkulu.",
      "HABER: Hükümet devasa teknoloji teşvikleri açıkladı.",
      "RAPOR: Küresel elektronik talebi tüm zamanların en yükseğinde.",
      "ANALİZ: Uzmanlar 'Silikonun Altın Çağı'nı ilan etti."
    ],
    marketCrash: [
      "PANİK: Küresel durgunluk korkuları satış dalgasını tetikledi!",
      "HABER: Teknoloji balonu patladı mı? Analistler dikkatli olunmasını öneriyor.",
      "SKANDAL: Büyük banka çöküşü teknoloji sektörünü sarstı.",
      "PİYASA: Tüketici harcamaları son 10 yılın en düşüğünde."
    ],
    staffResign: [
      "POSTA: 'Bu strese daha fazla dayanamıyorum. İstifa ediyorum.'",
      "POSTA: 'Sağlığım bu teslim tarihinden daha önemli. Hoşçakalın.'",
      "İK UYARISI: Baş araştırmacı rakip şirket tarafından ayartıldı.",
      "POSTA: 'Bu zehirli ortam beni mahvediyor. Gidiyorum.'"
    ]
  }
};

export const INITIAL_GAME_STATE: GameState = {
  stage: 'menu',
  language: 'en',
  companyName: "Silicon Startup",
  day: 1,
  gameSpeed: 'paused',
  lastSaveTime: Date.now(),
  money: INITIAL_MONEY,
  rp: INITIAL_RP,
  researchers: 0,
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
  dailySales: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },  // EKLE
  lastSalesResetDay: 1,  // EKLE
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