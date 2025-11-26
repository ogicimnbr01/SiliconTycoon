import { ProductType, TechNode, Stock, OfficeLevel, GameEvent, Hero, GameEra, MarketTrend, Achievement, MarketingCampaign, Competitor, GameState } from './types';

export const INITIAL_MONEY = 10000;
export const INITIAL_RP = 0;
export const INITIAL_RESEARCHERS = 0;
export const INITIAL_SILICON = 200;
export const INITIAL_REPUTATION = 10;

// Simulation Constants
export const TICK_RATE_MS = 1500; // 1.5 seconds per day
export const RESEARCHER_BASE_COST = 1000;
export const RESEARCHER_COST_GROWTH = 1.5;
export const RESEARCHER_DAILY_SALARY = 150;
export const RP_PER_RESEARCHER_PER_DAY = 10;
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
  {
    id: 'comp_techcorp',
    name: 'TechCorp',
    marketShare: { [ProductType.CPU]: 25, [ProductType.GPU]: 20 },
    productQuality: { [ProductType.CPU]: 70, [ProductType.GPU]: 65 },
    aggressiveness: 50,
    cashReserves: 500000,
    techLevel: { [ProductType.CPU]: 1, [ProductType.GPU]: 1 }
  },
  {
    id: 'comp_budgetchips',
    name: 'BudgetChips',
    marketShare: { [ProductType.CPU]: 30, [ProductType.GPU]: 15 },
    productQuality: { [ProductType.CPU]: 45, [ProductType.GPU]: 40 },
    aggressiveness: 80,
    cashReserves: 300000,
    techLevel: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 }
  },
  {
    id: 'comp_innovate',
    name: 'InnovateTech',
    marketShare: { [ProductType.CPU]: 20, [ProductType.GPU]: 35 },
    productQuality: { [ProductType.CPU]: 60, [ProductType.GPU]: 75 },
    aggressiveness: 40,
    cashReserves: 800000,
    techLevel: { [ProductType.CPU]: 1, [ProductType.GPU]: 2 }
  },
  {
    id: 'comp_global',
    name: 'GlobalSemi',
    marketShare: { [ProductType.CPU]: 25, [ProductType.GPU]: 30 },
    productQuality: { [ProductType.CPU]: 65, [ProductType.GPU]: 70 },
    aggressiveness: 60,
    cashReserves: 1000000,
    techLevel: { [ProductType.CPU]: 1, [ProductType.GPU]: 1 }
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
    condition: (state) => state.logs.some(l => l.message.includes('Espionage success')),
    reward: { type: 'rp', value: 500 }
  },
  {
    id: 'ach_saboteur',
    title: 'Saboteur',
    description: 'Perform a successful Sabotage.',
    icon: 'Bomb',
    condition: (state) => state.logs.some(l => l.message.includes('Sabotage success')),
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

    // Market Tab
    estUnitCost: "Est. Unit Cost",
    siliconCost: "Silicon Cost",
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
    // Logs & Notifications
    logRdEstablished: "R&D Dept. Established.",
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
    logBankRejectedLimit: "Bank rejected! Too many active loans.",
    logBankRejectedOffice: "Bank rejected! Office too small.",
    logLoanApproved: "Loan approved. Interest rate 1.5%",
    logLoanRepaid: "Loan Repaid! Credit score improved.",
    logWelcomeBack: "Welcome Back, CEO",
    logCampaignLaunched: "Launched {0} for {1}!",
    logOfflineMessage: "While you were away, your company earned {0} and gained {1} RP.",
    selectProduct: "Select Product",
    designSpecs: "Design Specifications",
    production: "Production",
    amount: "Amount",
    insufficientFunds: "Insufficient Funds",
    statistics: "STATISTICS",
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
  },
  tr: {
    logOfflineMessage: "Siz yokken şirketiniz {0} kazandı ve {1} AP elde etti.",
    selectProduct: "Ürün Seç",
    designSpecs: "Tasarım Özellikleri",
    production: "Üretim",
    amount: "Miktar",
    insufficientFunds: "Yetersiz Bakiye",
    statistics: "İSTATİSTİK",
    marketing: "PAZARLAMA",
    campaigns: "Kampanyalar",
    brandAwareness: "Marka Bilinirliği",
    activeCampaigns: "Aktif Kampanyalar",
    launch: "BAŞLAT",
    cost: "Maliyet",
    duration: "Süre",
    boost: "Artış",
    type: "Tür",
    // General UI
    version: "v1.0.0 • Erken Erişim",
    cash: "NAKİT",
    rndAcronym: "AR-GE",
    repAcronym: "İTB",
    nextEra: "Sonraki Çağ",
    marketModifiers: "Pazar Etkileri",
    cpuDemand: "CPU Talebi",
    gpuDemand: "GPU Talebi",
    locked: "KİLİTLİ",

    // Market Tab
    estUnitCost: "Tahmini Birim Maliyet",
    siliconCost: "Silikon Maliyeti",
    netProfit: "Net Kâr",
    avgCost: "Ort. Maliyet",
    pl: "K/Z",

    // Research Tab
    policyRelaxedName: "RAHAT",
    policyNormalName: "NORMAL",
    policyCrunchName: "AĞIR MESAİ",

    // Hacking Minigame
    hackProtocol: "GÜVENLİK PROTOKOLÜ",
    hackLocked: "KİLİTLİ",
    hackGranted: "ERİŞİM BAŞARILI",
    hackDetected: "TESPİT EDİLDİ",
    hackInstruction: "Güvenlik duvarını aşmak için imleci işaretli alanda durdur.",
    hackExecute: "HACKLE",
    hackUploading: "VİRÜS YÜKLENİYOR...",
    hackLost: "BAĞLANTI KOPTU",
    // Marketing Campaigns
    camp_social_name: "Sosyal Medya Reklamları",
    camp_social_desc: "Popüler platformlarda hedefli reklamlar.",
    camp_influencer_name: "Fenomen İncelemesi",
    camp_influencer_desc: "Ürünleri ünlü teknoloji YouTuber'larına gönder.",
    camp_tv_name: "TV Reklamı",
    camp_tv_desc: "Ulusal kanallarda prime-time reklamı.",
    camp_event_name: "Teknoloji Fuarı Standı",
    camp_event_desc: "Yıllık Teknoloji Fuarı'nda büyük bir stant.",

    // Office Names & Descs
    office_garage_name: "Annemin Garajı",
    office_garage_desc: "Bedava ama minik. Maksimum 2 personel.",
    office_basement_name: "Bodrum Laboratuvarı",
    office_basement_desc: "Ucuz yeraltı alanı. Kötü havalandırma.",
    office_startup_name: "Startup Ofisi",
    office_startup_desc: "Gerçek iş buradan başlıyor.",
    office_corporate_name: "Kurumsal Kat",
    office_corporate_desc: "Olanaklarla profesyonel ortam.",
    office_campus_name: "Teknoloji Kampüsü",
    office_campus_desc: "Devasa üretim kapasitesi.",
    office_hq_name: "Silikon Merkezi",
    office_hq_desc: "Küresel hakimiyet.",

    // Factory UI
    nextLevel: "Sonraki Seviye",
    rent: "Kira",
    maxResearchers: "Maks. Araştırmacı",
    upgradeCost: "Yükseltme Maliyeti",
    achievements: "BAŞARIMLAR",
    achievementUnlocked: "Başarım Açıldı!",
    repUnknown: "Bilinmiyor",
    repLocal: "Yerel Marka (+%10 Fiyat)",
    repNational: "Ulusal Yıldız (-%15 Silikon M.)",
    repGlobal: "Küresel Oyuncu (+%20 Kontrat)",
    repTitan: "Teknoloji Devi (+%25 Ar-Ge Hızı)",
    startNew: "YENİ ŞİRKET KUR",
    continue: "DEVAM ET",
    welcome: "SILICON TYCOON",
    subtitle: "Kurumsal Yönetim Simülasyonu",
    resetWarning: "Mevcut kayıt silinecektir.",
    day: "Gün",
    netWorth: "Şirket Değeri",
    research: "Ar-Ge",
    factory: "FABRİKA",
    rnd: "AR-GE",
    market: "PAZAR",
    paused: "DURAKLATILDI",
    productionHalted: "Üretim Durduruldu",
    resume: "DEVAM ET",
    saveAndExit: "KAYDET VE ÇIK",
    tabLocked: "ÖZELLİK KİLİTLİ",
    tabLockedDesc: "Açmak için ofis seviyesini yükselt veya eğitimi tamamla.",
    systemOnline: "SİSTEM AÇIK. VERİ BEKLENİYOR...",
    rep: "İtibar",
    silicon: "Silikon",
    newRun: "Yeni Oyun. Miras:",

    // Factory
    design: "TASARIM",
    done: "TAMAM",
    unitCost: "Birim Maliyet",
    unitPrice: "Birim Fiyat",
    performance: "Performans",
    efficiency: "Verimlilik",
    budget: "Bütçe",
    highEnd: "Yüksek Performans",
    powerHungry: "Güç Canavarı",
    ecoFriendly: "Çevre Dostu",
    inStock: "Stokta",
    line: "Hattı",
    noSilicon: "SİLİKON YOK",
    produce: "ÜRET",
    marketTrend: "Pazar Trendi",
    requiredSpec: "Gereksinim",
    officeLevel: "Ofis Seviyesi",
    upgrade: "Yükselt:",
    maxed: "MAKSİMUM",
    upgradeInfra: "OFİSİ YÜKSELT",
    siliconSupply: "Silikon Stoğu",
    purchaseSilicon: "100 BİRİM SATIN AL",
    assemblyLines: "Üretim Hatları",
    strategy: "Strateji",

    //Üretimhane
    manufacturing: "Üretim Maliyeti",
    marketValue: "Pazar Değeri",
    designLab: "TASARIM LAB",
    engineeringStation: "Mühendislik İstasyonu",
    budgetChip: "Bütçe Dostu",
    flagship: "Amiral Gemisi",
    defect: "Hata %",
    clock: "Hız",
    tdp: "Isı (TDP)",

    // Research
    nextMilestone: "Sıradaki Hedef",
    baseCost: "Baz Maliyet",
    basePrice: "Baz Fiyat",
    researchBtn: "ARAŞTIR",
    techMastered: "Teknoloji Tamamlandı",

    rndDept: "Ar-Ge Departmanı",
    dailyOutput: "Günlük Üretim",
    researchers: "Araştırmacı",
    activeStaff: "Aktif Personel",
    hireStaff: "PERSONEL AL",
    headhunters: "Kafa Avcıları",
    scrollMore: "Kaydır",
    hired: "İŞE ALINDI",
    hire: "İŞE AL",
    techRoadmap: "Teknoloji Haritası",
    cpuArch: "CPU Mimarisi",
    gpuArch: "GPU Mimarisi",
    policyRelaxedDesc: "Yüksek Moral, Düşük Çıktı (-%20 Maaş)",
    policyNormalDesc: "Dengeli iş akışı.",
    policyCrunchDesc: "Dikkat: Yüksek Çıktı, İstifa Riski! (+%50 Maaş)",

    // Market
    sales: "Satış",
    contracts: "Kontratlar",
    stocks: "Borsa",
    warfare: "Savaş",
    model: "Model",
    trendMatch: "Trend Uyumu",
    trendMiss: "Trend Uyumsuzluğu",
    marketPrice: "Pazar Fiyatı",
    inventory: "Envanter",
    sellBatch: "PARTİYİ SAT",
    rivalAlert: "Rakip Alarmı",
    cashFlow: "Nakit Akışı",
    noContracts: "Mevcut Kontrat Yok",
    daysLeft: "Gün Kaldı",
    accept: "KABUL ET",
    privateCompany: "Özel Şirket",
    valuationGoal: "Hedef Değerleme",
    launchIPO: "HALKA ARZ OL",
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
    crippleRivals: "Rakipleri Çökert",
    retire: "EMEKLİ OL (PRESTİJ)",
    impact: "Etki",
    left: "kaldı",
    days: "gün",

    //Banka
    bank: "Banka & Kredi",
    takeLoan: "KREDİ ÇEK",
    payLoan: "BORCU KAPAT",
    dailyInterest: "Günlük Faiz",
    activeLoans: "Aktif Krediler",
    hrPolicy: "İK Politikası",
    morale: "Personel Morali",
    policyRelaxed: "Rahat (Düşük Stres)",
    policyNormal: "Standart (9-5 Mesai)",
    policyCrunch: "AĞIR MESAİ (Yüksek Çıktı)",
    moraleLowWarning: "Personel tükeniyor!",
    valuation: "Şirket Değerlemesi",
    buyBack: "HİSSE GERİ AL",
    dilute: "HİSSE SAT (FONLA)",
    ownershipWarning: "Dikkat! Sahiplik çok düşük!",
    needUpgrade: "Ofis Yükseltmesi Gerek",
    finance: "FİNANS",
    bankruptcyWarning: "İFLAS UYARISI! 60 gün içinde bakiyeyi düzeltmezsen kovulacaksın!",
    gameOver: "OYUN BİTTİ",
    fired: "Şirketi batırdığın için kovuldun.",
    tryAgain: "TEKRAR DENE",
    fireStaff: "KOV (-$500)",
    firedAlert: "Personel kovuldu. Moral düştü!",
    settings: "AYARLAR",
    soundEffects: "Ses Efektleri",
    soundDesc: "Oyun seslerini aç/kapat",
    vibration: "Titreşim",
    vibrationDesc: "Titreşim geri bildirimi",
    close: "KAPAT",
    loanRejectedLimit: "Banka reddetti! Çok fazla aktif kredi var.",
    loanRejectedOffice: "Banka reddetti! Ofis çok küçük.",
    loanApproved: "Kredi onaylandı. Faiz oranı %1.5",
    loanRepaid: "Kredi Ödendi! Kredi notu yükseldi.",
    selectTarget: "HEDEF SEÇ",
    noActiveDebt: "Aktif Borç Yok",
    leader: "LİDER",
    old: "ESKİ",
    valuationGoalAmount: "$100k",
    returnToMenu: "ANA MENÜYE DÖN",
    designName: "Tasarım Adı",
    selectEditDesign: "Yeni bir şema oluşturmak için 'Tasarımı Düzenle'yi seç.",
    noActiveLines: "için aktif üretim hattı yok",
    buildNewLine: "Yeni Hat Kur ($50k)",
    outputDaily: "Üretim: {0}/gün",
    productionAmount: "Üretim Miktarı",
    units: "adet",
    siliconNeeded: "Gerekli Silikon",
    totalCost: "Toplam Maliyet",
    available: "Mevcut",
    current: "Şu Anki",
    siliconCap: "Silikon Kapasitesi",
    welcomeBack: "Tekrar Hoşgeldin, CEO",
    offlineMessage: "Sen yokken {0} dakika boyunca A.L.I.C.E. operasyonları yönetti.",
    earnings: "Kazanç",
    collectResources: "KAYNAKLARI TOPLA",

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
    // Logs & Notifications
    // Logs & Notifications
    logRdEstablished: "Ar-Ge Departmanı Kuruldu.",
    logFinanceEstablished: "Finans Departmanı Kuruldu. Halka Arz hazır.",
    logContractFailed: "Kontrat BAŞARISIZ! Müşteri öfkeli.",
    logContractOrder: "SİPARİŞ: {0}x {1}",
    logContractDeadline: "Son Gün: {0} Gün",
    logGlobalTech: "Küresel Teknoloji: Rakipler Tier {0} {1} piyasaya sürdü!",
    logEraChange: "ÇAĞ DEĞİŞİMİ: {0} başladı!",
    logMarketShift: "PAZAR DEĞİŞİMİ: {0}!",
    logRivalAlert: "RAKİP ALARMI: {0} yeni ürün çıkardı!",
    logResignCritical: "KRİTİK: Toksik ortam hızlı istifalara yol açıyor!",
    logResignMass: "TOPLU İSTİFA: 3 araştırmacı protesto ederek ayrıldı!",
    logResignBad: "DÜŞÜK MORAL: {0} araştırmacı işi bıraktı.",
    logResignSingle: "İSTİFA: Bir araştırmacı daha iyi bir teklif için ayrıldı.",
    logBankInterest: "Banka: Haftalık faiz tahsil edildi.",
    logRentPaid: "Ofis Kirası Ödendi.",
    logBankRejectedLimit: "Banka reddetti! Çok fazla aktif kredi var.",
    logBankRejectedOffice: "Banka reddetti! Ofis çok küçük.",
    logLoanApproved: "Kredi onaylandı. Faiz oranı %1.5",
    logLoanRepaid: "Kredi Ödendi! Kredi notu yükseldi.",
    logWelcomeBack: "Tekrar Hoşgeldin, CEO",
    logCampaignLaunched: "{1} için {0} başlatıldı!",

    // Achievements
    ach_millionaire_title: "Çekirdek Para",
    ach_millionaire_desc: "$1,000,000 nakite ulaş.",
    ach_decamillionaire_title: "Seri A",
    ach_decamillionaire_desc: "$10,000,000 nakite ulaş.",
    ach_centimillionaire_title: "Büyük Oyuncu",
    ach_centimillionaire_desc: "$100,000,000 nakite ulaş.",
    ach_billionaire_title: "Unicorn",
    ach_billionaire_desc: "$1,000,000,000 nakite ulaş.",
    ach_trillionaire_title: "Küresel Hegemon",
    ach_trillionaire_desc: "$1 Trilyon nakite ulaş.",
    ach_mass_production_title: "Seri Üretim",
    ach_mass_production_desc: "Toplam 1,000 birim üret.",
    ach_industrial_giant_title: "Sanayi Devi",
    ach_industrial_giant_desc: "Toplam 10,000 birim üret.",
    ach_researcher_title: "Evreka!",
    ach_researcher_desc: "İlk araştırmanı tamamla.",
    ach_tech_pioneer_title: "Teknoloji Öncüsü",
    ach_tech_pioneer_desc: "Maksimum CPU teknolojisine ulaş.",
    ach_graphics_wizard_title: "Grafik Sihirbazı",
    ach_graphics_wizard_desc: "Maksimum GPU teknolojisine ulaş.",
    ach_lab_rat_title: "Laboratuvar Faresi",
    ach_lab_rat_desc: "5 Araştırmacı işe al.",
    ach_research_institute_title: "Araştırma Enstitüsü",
    ach_research_institute_desc: "20 Araştırmacı işe al.",
    ach_headhunter_title: "Kafa Avcısı",
    ach_headhunter_desc: "Bir Kahraman karakter işe al.",
    ach_dream_team_title: "Rüya Takım",
    ach_dream_team_desc: "3 Kahraman karakter işe al.",
    ach_garage_days_title: "Garaj Günleri",
    ach_garage_days_desc: "30 gün hayatta kal.",
    ach_anniversary_title: "Yıl Dönümü",
    ach_anniversary_desc: "365 gün hayatta kal.",
    ach_veteran_title: "Emektar",
    ach_veteran_desc: "1000 gün hayatta kal.",
    ach_corporate_ladder_title: "Kurumsal Merdiven",
    ach_corporate_ladder_desc: "Ofisi Kurumsal seviyeye yükselt.",
    ach_sky_high_title: "Göklerde",
    ach_sky_high_desc: "Ofisi Genel Merkez seviyeye yükselt.",
    ach_famous_title: "Ünlü",
    ach_famous_desc: "%50 Marka Bilinirliğine ulaş.",
    ach_household_name_title: "Herkesin Bildiği İsim",
    ach_household_name_desc: "%100 Marka Bilinirliğine ulaş.",
    ach_spy_games_title: "Casus Oyunları",
    ach_spy_games_desc: "Başarılı bir Casusluk yap.",
    ach_saboteur_title: "Sabotajcı",
    ach_saboteur_desc: "Başarılı bir Sabotaj yap.",
    ach_ipo_title: "Halka Arz",
    ach_ipo_desc: "Borsaya açıl (IPO).",
    ach_monopoly_title: "Pazar Hakimiyeti",
    ach_monopoly_desc: "%90 İtibara ulaş.",

  }
};

export const MARKET_TRENDS: MarketTrend[] = [
  // Universal Trends
  {
    id: 'trend_neutral',
    name: 'Dengeli Pazar',
    description: 'Tüm ürünler için dengeli talep.',
    requiredSpec: 'performance',
    minSpecValue: 0,
    priceBonus: 1.0,
    penalty: 1.0,
    affectedProducts: [ProductType.CPU, ProductType.GPU]
  },
  {
    id: 'trend_green',
    name: 'Enerji Krizi',
    description: 'Enerji maliyetleri fırladı! Verimlilik kral.',
    requiredSpec: 'efficiency',
    minSpecValue: 70,
    priceBonus: 1.6,
    penalty: 0.5,
    affectedProducts: [ProductType.CPU, ProductType.GPU]
  },

  // CPU-Specific Trends
  {
    id: 'trend_servers',
    name: 'Sunucu Patlaması',
    description: 'Veri merkezleri genişliyor! Verimli CPU gerek.',
    requiredSpec: 'efficiency',
    minSpecValue: 65,
    priceBonus: 1.8,
    penalty: 0.7,
    affectedProducts: [ProductType.CPU]
  },
  {
    id: 'trend_cloud',
    name: 'Bulut Bilişim Dalgası',
    description: 'Bulut sağlayıcıları toplu CPU alıyor!',
    requiredSpec: 'efficiency',
    minSpecValue: 60,
    priceBonus: 1.5,
    penalty: 0.8,
    affectedProducts: [ProductType.CPU]
  },
  {
    id: 'trend_office',
    name: 'Kurumsal Yenileme',
    description: 'Şirketler ofis bilgisayarlarını yeniliyor.',
    requiredSpec: 'efficiency',
    minSpecValue: 50,
    priceBonus: 1.3,
    penalty: 0.9,
    affectedProducts: [ProductType.CPU]
  },

  // GPU-Specific Trends
  {
    id: 'trend_ai',
    name: 'Yapay Zeka Devrimi',
    description: 'Makine öğrenmesi patlaması! GPU talebi çok yüksek!',
    requiredSpec: 'performance',
    minSpecValue: 75,
    priceBonus: 2.0,
    penalty: 0.6,
    affectedProducts: [ProductType.GPU]
  },
  {
    id: 'trend_gaming',
    name: 'Oyun Çılgınlığı',
    description: 'Yeni AAA oyunlar çıktı! Oyuncular güç istiyor!',
    requiredSpec: 'performance',
    minSpecValue: 80,
    priceBonus: 1.9,
    penalty: 0.5,
    affectedProducts: [ProductType.GPU]
  },
  {
    id: 'trend_crypto',
    name: 'Kripto Madenciliği',
    description: 'Bitcoin yükseliyor! Madenciler tüm GPU\'ları alıyor!',
    requiredSpec: 'performance',
    minSpecValue: 70,
    priceBonus: 2.2,
    penalty: 0.4,
    affectedProducts: [ProductType.GPU]
  },
  {
    id: 'trend_vr',
    name: 'VR/AR Patlaması',
    description: 'Sanal gerçeklik ana akıma giriyor!',
    requiredSpec: 'performance',
    minSpecValue: 75,
    priceBonus: 1.7,
    penalty: 0.6,
    affectedProducts: [ProductType.GPU]
  },
  {
    id: 'trend_streaming',
    name: 'İçerik Üreticisi Patlaması',
    description: 'Yayıncılar ve içerik üreticileri güçlü GPU istiyor!',
    requiredSpec: 'performance',
    minSpecValue: 65,
    priceBonus: 1.5,
    penalty: 0.7,
    affectedProducts: [ProductType.GPU]
  }
];


// Eras
export const ERAS: GameEra[] = [
  {
    id: 'era_pc',
    name: 'PC DEVRİMİ',
    startDay: 0,
    description: 'Kişisel bilgisayarların şafağı. CPU\'lar kral.',
    cpuDemandMod: 1.2,
    gpuDemandMod: 0.8
  },
  {
    id: 'era_mobile',
    name: 'MOBİL ÇAĞI',
    startDay: 150,
    description: 'Her yerde akıllı telefonlar. Verimlilik önemli.',
    cpuDemandMod: 0.9,
    gpuDemandMod: 1.1
  },
  {
    id: 'era_ai',
    name: 'YAPAY ZEKA TEKİLLİĞİ',
    startDay: 365,
    description: 'Üretken yapay zeka patlaması. İnanılmaz GPU talebi.',
    cpuDemandMod: 1.0,
    gpuDemandMod: 2.0
  }
];

// Heroes
export const HEROES: Hero[] = [
  {
    id: 'hero_steve',
    name: 'Steve W.',
    role: 'Pazarlama Gurusu',
    hiringCost: 50000,
    dailySalary: 500,
    description: 'Satış fiyatlarını %20 artırır. Çok talepkar.',
    effectType: 'sales',
    effectValue: 0.2
  },
  {
    id: 'hero_linus',
    name: 'Linus T.',
    role: 'Çekirdek Mimarı',
    hiringCost: 30000,
    dailySalary: 300,
    description: 'Tüm araştırmacılardan gelen RP üretimini ikiye katlar.',
    effectType: 'research',
    effectValue: 1.0 // +100%
  },
  {
    id: 'hero_elon',
    name: 'Elon M.',
    role: 'Vizyoner',
    hiringCost: 100000,
    dailySalary: 1000,
    description: 'Şirket değerlemesini ve hisse volatilitesini artırır.',
    effectType: 'stock',
    effectValue: 0.5
  }
];

export const OFFICE_CONFIGS = {
  [OfficeLevel.GARAGE]: {
    name: "Annemin Garajı",
    rent: 0,
    maxResearchers: 2,
    siliconCap: 200,
    upgradeCost: 25000,
    description: "Bedava ama minik. Maksimum 2 personel."
  },
  [OfficeLevel.BASEMENT]: {
    name: "Bodrum Laboratuvarı",
    rent: 200,
    maxResearchers: 5,
    siliconCap: 1000,
    upgradeCost: 100000,
    description: "Ucuz yeraltı alanı. Kötü havalandırma."
  },
  [OfficeLevel.STARTUP]: {
    name: "Startup Ofisi",
    rent: 1000,
    maxResearchers: 15,
    siliconCap: 5000,
    upgradeCost: 500000,
    description: "Gerçek iş buradan başlıyor."
  },
  [OfficeLevel.CORPORATE]: {
    name: "Kurumsal Kat",
    rent: 5000,
    maxResearchers: 40,
    siliconCap: 20000,
    upgradeCost: 2500000,
    description: "Olanaklarla profesyonel ortam."
  },
  [OfficeLevel.CAMPUS]: {
    name: "Teknoloji Kampüsü",
    rent: 15000,
    maxResearchers: 100,
    siliconCap: 100000,
    upgradeCost: 10000000,
    description: "Devasa üretim kapasitesi."
  },
  [OfficeLevel.HEADQUARTERS]: {
    name: "Silikon Merkezi",
    rent: 50000,
    maxResearchers: 300,
    siliconCap: 1000000,
    upgradeCost: 0,
    description: "Küresel hakimiyet."
  }
};

// Tech Tree for CPUs (10 TIERS with Branching)
export const CPU_TECH_TREE: TechNode[] = [
  { id: 'cpu_0', name: '8-bit Processor', tier: 0, productionCost: 25, baseMarketPrice: 60, researchCost: 0, branch: 'balanced', yield: 100 },
  { id: 'cpu_1', name: '16-bit Processor', tier: 1, productionCost: 55, baseMarketPrice: 130, researchCost: 100, branch: 'balanced', prerequisites: ['cpu_0'], yield: 95 },
  { id: 'cpu_2', name: '32-bit RISC', tier: 2, productionCost: 140, baseMarketPrice: 320, researchCost: 500, branch: 'balanced', prerequisites: ['cpu_1'], yield: 90 },
  { id: 'cpu_3', name: '32-bit CISC', tier: 3, productionCost: 450, baseMarketPrice: 950, researchCost: 2000, branch: 'balanced', prerequisites: ['cpu_2'], yield: 85 },

  // Tier 4: Branching starts
  { id: 'cpu_4_perf', name: '64-bit High-Freq', tier: 4, productionCost: 1200, baseMarketPrice: 1800, researchCost: 8000, branch: 'performance', prerequisites: ['cpu_3'], specialBonus: { type: 'market', value: 10 }, yield: 75 },
  { id: 'cpu_4_eff', name: '64-bit Low-Power', tier: 4, productionCost: 900, baseMarketPrice: 1200, researchCost: 6000, branch: 'efficiency', prerequisites: ['cpu_3'], specialBonus: { type: 'production', value: 15 }, yield: 80 },

  // Tier 5
  { id: 'cpu_5_perf', name: 'Dual-Core HT', tier: 5, productionCost: 3000, baseMarketPrice: 4500, researchCost: 25000, branch: 'performance', prerequisites: ['cpu_4_perf'], yield: 70 },
  { id: 'cpu_5_eff', name: 'Dual-Core Budget', tier: 5, productionCost: 2200, baseMarketPrice: 3000, researchCost: 18000, branch: 'efficiency', prerequisites: ['cpu_4_eff'], yield: 75 },

  // Tier 6
  { id: 'cpu_6_perf', name: 'Quad-Core 3GHz', tier: 6, productionCost: 7500, baseMarketPrice: 11000, researchCost: 75000, branch: 'performance', prerequisites: ['cpu_5_perf'], specialBonus: { type: 'market', value: 15 }, yield: 65 },
  { id: 'cpu_6_eff', name: 'Quad-Core 2GHz', tier: 6, productionCost: 5500, baseMarketPrice: 8000, researchCost: 55000, branch: 'efficiency', prerequisites: ['cpu_5_eff'], specialBonus: { type: 'production', value: 20 }, yield: 70 },

  // Tier 7
  { id: 'cpu_7_perf', name: 'Hexa-Core Turbo', tier: 7, productionCost: 18000, baseMarketPrice: 28000, researchCost: 200000, branch: 'performance', prerequisites: ['cpu_6_perf'], yield: 60 },
  { id: 'cpu_7_eff', name: 'Hexa-Core ECO', tier: 7, productionCost: 13000, baseMarketPrice: 20000, researchCost: 150000, branch: 'efficiency', prerequisites: ['cpu_6_eff'], yield: 65 },

  // Tier 8
  { id: 'cpu_8_perf', name: 'Octa-Core 5GHz', tier: 8, productionCost: 45000, baseMarketPrice: 70000, researchCost: 500000, branch: 'performance', prerequisites: ['cpu_7_perf'], specialBonus: { type: 'market', value: 25 }, yield: 50 },
  { id: 'cpu_8_eff', name: 'Octa-Core 3GHz', tier: 8, productionCost: 32000, baseMarketPrice: 50000, researchCost: 380000, branch: 'efficiency', prerequisites: ['cpu_7_eff'], specialBonus: { type: 'production', value: 30 }, yield: 60 },

  // Tier 9: Ultimate
  { id: 'cpu_9_perf', name: '16-Core Extreme', tier: 9, productionCost: 120000, baseMarketPrice: 200000, researchCost: 1500000, branch: 'performance', prerequisites: ['cpu_8_perf'], specialBonus: { type: 'market', value: 40 }, yield: 40 },
  { id: 'cpu_9_eff', name: '32-Core Workstation', tier: 9, productionCost: 85000, baseMarketPrice: 140000, researchCost: 1100000, branch: 'efficiency', prerequisites: ['cpu_8_eff'], specialBonus: { type: 'production', value: 50 }, yield: 50 },
];


// Tech Tree for GPUs (10 TIERS with Branching)
export const GPU_TECH_TREE: TechNode[] = [
  { id: 'gpu_0', name: 'VGA Graphics', tier: 0, productionCost: 40, baseMarketPrice: 90, researchCost: 0, branch: 'balanced', yield: 100 },
  { id: 'gpu_1', name: 'SVGA Graphics', tier: 1, productionCost: 90, baseMarketPrice: 200, researchCost: 250, branch: 'balanced', prerequisites: ['gpu_0'], yield: 95 },
  { id: 'gpu_2', name: '3D Accelerator', tier: 2, productionCost: 220, baseMarketPrice: 480, researchCost: 800, branch: 'balanced', prerequisites: ['gpu_1'], yield: 90 },
  { id: 'gpu_3', name: 'T&L GPU', tier: 3, productionCost: 700, baseMarketPrice: 1500, researchCost: 3000, branch: 'balanced', prerequisites: ['gpu_2'], yield: 85 },

  // Tier 4: Branching starts
  { id: 'gpu_4_perf', name: 'Shader Model 1.0', tier: 4, productionCost: 2000, baseMarketPrice: 3200, researchCost: 10000, branch: 'performance', prerequisites: ['gpu_3'], specialBonus: { type: 'market', value: 12 }, yield: 75 },
  { id: 'gpu_4_eff', name: 'Budget Shader', tier: 4, productionCost: 1500, baseMarketPrice: 2200, researchCost: 7500, branch: 'efficiency', prerequisites: ['gpu_3'], specialBonus: { type: 'production', value: 18 }, yield: 80 },

  // Tier 5
  { id: 'gpu_5_perf', name: 'Shader Model 2.0', tier: 5, productionCost: 5000, baseMarketPrice: 8000, researchCost: 35000, branch: 'performance', prerequisites: ['gpu_4_perf'], yield: 70 },
  { id: 'gpu_5_eff', name: 'DirectX 8.1 GPU', tier: 5, productionCost: 3800, baseMarketPrice: 5800, researchCost: 26000, branch: 'efficiency', prerequisites: ['gpu_4_eff'], yield: 75 },

  // Tier 6
  { id: 'gpu_6_perf', name: 'Shader Model 3.0', tier: 6, productionCost: 12000, baseMarketPrice: 19000, researchCost: 90000, branch: 'performance', prerequisites: ['gpu_5_perf'], specialBonus: { type: 'market', value: 18 }, yield: 65 },
  { id: 'gpu_6_eff', name: 'DirectX 9c GPU', tier: 6, productionCost: 9000, baseMarketPrice: 14000, researchCost: 68000, branch: 'efficiency', prerequisites: ['gpu_5_eff'], specialBonus: { type: 'production', value: 25 }, yield: 70 },

  // Tier 7
  { id: 'gpu_7_perf', name: 'Unified Shader', tier: 7, productionCost: 30000, baseMarketPrice: 48000, researchCost: 250000, branch: 'performance', prerequisites: ['gpu_6_perf'], yield: 60 },
  { id: 'gpu_7_eff', name: 'DirectX 10 GPU', tier: 7, productionCost: 22000, baseMarketPrice: 36000, researchCost: 190000, branch: 'efficiency', prerequisites: ['gpu_6_eff'], yield: 65 },

  // Tier 8
  { id: 'gpu_8_perf', name: 'GDDR5 High-End', tier: 8, productionCost: 80000, baseMarketPrice: 130000, researchCost: 750000, branch: 'performance', prerequisites: ['gpu_7_perf'], specialBonus: { type: 'market', value: 30 }, yield: 50 },
  { id: 'gpu_8_eff', name: 'GDDR5 Mid-Range', tier: 8, productionCost: 58000, baseMarketPrice: 95000, researchCost: 560000, branch: 'efficiency', prerequisites: ['gpu_7_eff'], specialBonus: { type: 'production', value: 35 }, yield: 60 },

  // Tier 9: Ultimate
  { id: 'gpu_9_perf', name: 'Real-Time Lighting', tier: 9, productionCost: 200000, baseMarketPrice: 350000, researchCost: 2000000, branch: 'performance', prerequisites: ['gpu_8_perf'], specialBonus: { type: 'market', value: 50 }, yield: 40 },
  { id: 'gpu_9_eff', name: 'HBM2 Compute', tier: 9, productionCost: 145000, baseMarketPrice: 250000, researchCost: 1500000, branch: 'efficiency', prerequisites: ['gpu_8_eff'], specialBonus: { type: 'production', value: 60 }, yield: 50 },
];

// Fictional Companies
export const INITIAL_STOCKS: Stock[] = [
  { id: 'stk_1', symbol: 'NBL', name: 'Nebula Systems', currentPrice: 50, history: [48, 49, 50], owned: 0, avgBuyPrice: 0, volatility: 0.05 },
  { id: 'stk_2', symbol: 'GIG', name: 'GigaWeb Corp', currentPrice: 120, history: [115, 118, 120], owned: 0, avgBuyPrice: 0, volatility: 0.08 },
  { id: 'stk_3', symbol: 'FRT', name: 'Fruit Computers', currentPrice: 450, history: [440, 445, 450], owned: 0, avgBuyPrice: 0, volatility: 0.03 },
  { id: 'stk_4', symbol: 'OMN', name: 'OmniDynamics', currentPrice: 15, history: [14, 16, 15], owned: 0, avgBuyPrice: 0, volatility: 0.15 }
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
      "SON DAKİKA: Tayvan'da deprem! Çip üretimi durdu!",
      "HABER: Kargo gemisi kanalda sıkıştı. Tedarik zinciri dondu.",
      "UYARI: Ticaret savaşı kızışıyor! Ham silikon vergileri arttı.",
      "PAZAR: Teknoloji devi küresel silikon arzının %40'ını satın aldı."
    ],
    siliconDrop: [
      "HABER: Afrika'da devasa yeni silikon rezervi bulundu.",
      "PAZAR: Ticaret kısıtlamaları kaldırıldı. Malzeme akışı rahatladı.",
      "GÜNCELLEME: Geri dönüşüm teknolojisinde devrim maliyetleri düşürdü.",
      "HABER: Rakip firmanın iflası piyasayı ucuz silikona boğdu."
    ],
    marketBoom: [
      "BORSA: Teknoloji hisseleri uçuşta! Yatırımcılar coşkulu.",
      "HABER: Hükümet devasa teknoloji teşvikleri açıkladı.",
      "RAPOR: Elektroniğe olan küresel talep tüm zamanların zirvesinde.",
      "ANALİZ: Uzmanlar 'Silikonun Altın Çağı'nı ilan etti."
    ],
    marketCrash: [
      "PANİK: Küresel resesyon korkusu satış dalgası yarattı!",
      "HABER: Teknoloji balonu patladı mı? Analistler uyarıyor.",
      "SKANDAL: Büyük banka çöküşü teknoloji sektörünü sarstı.",
      "PAZAR: Tüketici harcamaları son 10 yılın en düşüğünde."
    ],
    staffResign: [
      "POSTA: 'Bu strese daha fazla dayanamıyorum. İstifa ediyorum.'",
      "POSTA: 'Sağlığım bu teslim tarihinden daha önemli. Hoşçakalın.'",
      "İK UYARISI: Baş araştırmacı rakip firma tarafından transfer edildi.",
      "POSTA: 'Bu zehirli ortam beni bitiriyor. Gidiyorum.'"
    ]
  }
};

export const INITIAL_GAME_STATE: GameState = {
  stage: 'menu',
  language: 'en',
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
  offlineReport: null,
  unlockedAchievements: [],
  activeCampaigns: [],
  brandAwareness: { [ProductType.CPU]: 0, [ProductType.GPU]: 0 },
  competitors: [],
  loans: [],
  staffMorale: 100,
  workPolicy: 'normal',
  bankruptcyTimer: 0,
  productionLines: []
};