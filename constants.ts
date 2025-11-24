import { ProductType, TechNode, Stock, OfficeLevel, GameEvent, Hero, GameEra, MarketTrend, Achievement, MarketingCampaign, Competitor } from './types';

export const INITIAL_MONEY = 100000000;
export const INITIAL_RP = 0;
export const INITIAL_RESEARCHERS = 0;
export const INITIAL_SILICON = 200;
export const INITIAL_REPUTATION = 0;

// Simulation Constants
export const TICK_RATE_MS = 1500;
export const RESEARCHER_BASE_COST = 1000;
export const RESEARCHER_COST_GROWTH = 1.5;
export const RESEARCHER_DAILY_SALARY = 100;
export const RP_PER_RESEARCHER_PER_DAY = 5;
export const IPO_THRESHOLD_VALUATION = 100000;

// Silicon Market
export const BASE_SILICON_PRICE = 10;


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
    id: 'ach_billionaire',
    title: 'Unicorn',
    description: 'Reach $1,000,000,000 in cash.',
    icon: 'TrendingUp',
    condition: (state) => state.money >= 1000000000,
    reward: { type: 'reputation', value: 50 }
  },
  {
    id: 'ach_researcher',
    title: 'Eureka!',
    description: 'Complete your first research.',
    icon: 'FlaskConical',
    condition: (state) => state.techLevels.CPU > 0 || state.techLevels.GPU > 0,
    reward: { type: 'money', value: 50000 }
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
export const MAX_ACTIVE_LOANS = 3;

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
    locked: "Locked",
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
  },
  tr: {
    marketing: "PAZARLAMA",
    campaigns: "Kampanyalar",
    brandAwareness: "Marka Bilinirliği",
    activeCampaigns: "Aktif Kampanyalar",
    launch: "BAŞLAT",
    cost: "Maliyet",
    duration: "Süre",
    boost: "Artış",
    type: "Tür",
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
    locked: "Kilitli",
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
  }
};

export const MARKET_TRENDS: MarketTrend[] = [
  // Universal Trends
  {
    id: 'trend_neutral',
    name: 'Stable Market',
    description: 'Balanced demand for all products.',
    requiredSpec: 'performance',
    minSpecValue: 0,
    priceBonus: 1.0,
    penalty: 1.0,
    affectedProducts: [ProductType.CPU, ProductType.GPU]
  },
  {
    id: 'trend_green',
    name: 'Energy Crisis',
    description: 'Power costs skyrocketing! Efficiency is king.',
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
    description: 'Data centers expanding! Need efficient CPUs.',
    requiredSpec: 'efficiency',
    minSpecValue: 65,
    priceBonus: 1.8,
    penalty: 0.7,
    affectedProducts: [ProductType.CPU]
  },
  {
    id: 'trend_cloud',
    name: 'Cloud Computing Surge',
    description: 'Cloud providers buying CPUs in bulk!',
    requiredSpec: 'efficiency',
    minSpecValue: 60,
    priceBonus: 1.5,
    penalty: 0.8,
    affectedProducts: [ProductType.CPU]
  },
  {
    id: 'trend_office',
    name: 'Corporate Refresh',
    description: 'Companies upgrading office computers.',
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
    description: 'Machine learning boom! GPUs in high demand!',
    requiredSpec: 'performance',
    minSpecValue: 75,
    priceBonus: 2.0,
    penalty: 0.6,
    affectedProducts: [ProductType.GPU]
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
    name: 'Crypto Mining Boom',
    description: 'Bitcoin surging! Miners buying all GPUs!',
    requiredSpec: 'performance',
    minSpecValue: 70,
    priceBonus: 2.2,
    penalty: 0.4,
    affectedProducts: [ProductType.GPU]
  },
  {
    id: 'trend_vr',
    name: 'VR/AR Explosion',
    description: 'Virtual reality going mainstream!',
    requiredSpec: 'performance',
    minSpecValue: 75,
    priceBonus: 1.7,
    penalty: 0.6,
    affectedProducts: [ProductType.GPU]
  },
  {
    id: 'trend_streaming',
    name: 'Content Creator Boom',
    description: 'Streamers and creators need powerful GPUs!',
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
    name: 'PC REVOLUTION',
    startDay: 0,
    description: 'The dawn of personal computing. CPUs are king.',
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
    description: 'Generative AI boom. Insane GPU demand.',
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
    description: 'Boosts sales prices by 20%. Very demanding.',
    effectType: 'sales',
    effectValue: 0.2
  },
  {
    id: 'hero_linus',
    name: 'Linus T.',
    role: 'Kernel Architect',
    hiringCost: 30000,
    dailySalary: 300,
    description: 'Doubles RP generation from all researchers.',
    effectType: 'research',
    effectValue: 1.0 // +100%
  },
  {
    id: 'hero_elon',
    name: 'Elon M.',
    role: 'Visionary',
    hiringCost: 100000,
    dailySalary: 1000,
    description: 'Increases company valuation & stock volatility.',
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
    description: "Free but tiny. Maximum 2 staff."
  },
  [OfficeLevel.BASEMENT]: {
    name: "Basement Lab",
    rent: 200,
    maxResearchers: 5,
    siliconCap: 1000,
    upgradeCost: 100000, // İkinci adım pahalı
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
    upgradeCost: 2500000, // 2.5 Milyon
    description: "Professional environment with amenities."
  },
  [OfficeLevel.CAMPUS]: {
    name: "Tech Campus",
    rent: 20000,
    maxResearchers: 100,
    siliconCap: 100000,
    upgradeCost: 10000000, // 10 Milyon
    description: "Massive production capability."
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

// Tech Tree for CPUs (10 TIERS with Branching)
export const CPU_TECH_TREE: TechNode[] = [
  { id: 'cpu_0', name: '8-bit Processor', tier: 0, productionCost: 25, baseMarketPrice: 32, researchCost: 0, branch: 'balanced' },
  { id: 'cpu_1', name: '16-bit Processor', tier: 1, productionCost: 55, baseMarketPrice: 70, researchCost: 100, branch: 'balanced', prerequisites: ['cpu_0'] },
  { id: 'cpu_2', name: '32-bit RISC', tier: 2, productionCost: 140, baseMarketPrice: 180, researchCost: 500, branch: 'balanced', prerequisites: ['cpu_1'] },
  { id: 'cpu_3', name: '32-bit CISC', tier: 3, productionCost: 450, baseMarketPrice: 550, researchCost: 2000, branch: 'balanced', prerequisites: ['cpu_2'] },

  // Tier 4: Branching starts
  { id: 'cpu_4_perf', name: '64-bit High-Freq', tier: 4, productionCost: 1200, baseMarketPrice: 1800, researchCost: 8000, branch: 'performance', prerequisites: ['cpu_3'], specialBonus: { type: 'market', value: 10 } },
  { id: 'cpu_4_eff', name: '64-bit Low-Power', tier: 4, productionCost: 900, baseMarketPrice: 1200, researchCost: 6000, branch: 'efficiency', prerequisites: ['cpu_3'], specialBonus: { type: 'production', value: 15 } },

  // Tier 5
  { id: 'cpu_5_perf', name: 'Dual-Core HT', tier: 5, productionCost: 3000, baseMarketPrice: 4500, researchCost: 25000, branch: 'performance', prerequisites: ['cpu_4_perf'] },
  { id: 'cpu_5_eff', name: 'Dual-Core Budget', tier: 5, productionCost: 2200, baseMarketPrice: 3000, researchCost: 18000, branch: 'efficiency', prerequisites: ['cpu_4_eff'] },

  // Tier 6
  { id: 'cpu_6_perf', name: 'Quad-Core 3GHz', tier: 6, productionCost: 7500, baseMarketPrice: 11000, researchCost: 75000, branch: 'performance', prerequisites: ['cpu_5_perf'], specialBonus: { type: 'market', value: 15 } },
  { id: 'cpu_6_eff', name: 'Quad-Core 2GHz', tier: 6, productionCost: 5500, baseMarketPrice: 8000, researchCost: 55000, branch: 'efficiency', prerequisites: ['cpu_5_eff'], specialBonus: { type: 'production', value: 20 } },

  // Tier 7
  { id: 'cpu_7_perf', name: 'Hexa-Core Turbo', tier: 7, productionCost: 18000, baseMarketPrice: 28000, researchCost: 200000, branch: 'performance', prerequisites: ['cpu_6_perf'] },
  { id: 'cpu_7_eff', name: 'Hexa-Core ECO', tier: 7, productionCost: 13000, baseMarketPrice: 20000, researchCost: 150000, branch: 'efficiency', prerequisites: ['cpu_6_eff'] },

  // Tier 8
  { id: 'cpu_8_perf', name: 'Octa-Core 5GHz', tier: 8, productionCost: 45000, baseMarketPrice: 70000, researchCost: 500000, branch: 'performance', prerequisites: ['cpu_7_perf'], specialBonus: { type: 'market', value: 25 } },
  { id: 'cpu_8_eff', name: 'Octa-Core 3GHz', tier: 8, productionCost: 32000, baseMarketPrice: 50000, researchCost: 380000, branch: 'efficiency', prerequisites: ['cpu_7_eff'], specialBonus: { type: 'production', value: 30 } },

  // Tier 9: Ultimate
  { id: 'cpu_9_perf', name: '16-Core Extreme', tier: 9, productionCost: 120000, baseMarketPrice: 200000, researchCost: 1500000, branch: 'performance', prerequisites: ['cpu_8_perf'], specialBonus: { type: 'market', value: 40 } },
  { id: 'cpu_9_eff', name: '32-Core Workstation', tier: 9, productionCost: 85000, baseMarketPrice: 140000, researchCost: 1100000, branch: 'efficiency', prerequisites: ['cpu_8_eff'], specialBonus: { type: 'production', value: 50 } },
];


// Tech Tree for GPUs (10 TIERS with Branching)
export const GPU_TECH_TREE: TechNode[] = [
  { id: 'gpu_0', name: 'VGA Graphics', tier: 0, productionCost: 40, baseMarketPrice: 50, researchCost: 0, branch: 'balanced' },
  { id: 'gpu_1', name: 'SVGA Graphics', tier: 1, productionCost: 90, baseMarketPrice: 120, researchCost: 250, branch: 'balanced', prerequisites: ['gpu_0'] },
  { id: 'gpu_2', name: '3D Accelerator', tier: 2, productionCost: 220, baseMarketPrice: 290, researchCost: 800, branch: 'balanced', prerequisites: ['gpu_1'] },
  { id: 'gpu_3', name: 'T&L GPU', tier: 3, productionCost: 700, baseMarketPrice: 900, researchCost: 3000, branch: 'balanced', prerequisites: ['gpu_2'] },

  // Tier 4: Branching starts
  { id: 'gpu_4_perf', name: 'Shader Model 1.0', tier: 4, productionCost: 2000, baseMarketPrice: 3200, researchCost: 10000, branch: 'performance', prerequisites: ['gpu_3'], specialBonus: { type: 'market', value: 12 } },
  { id: 'gpu_4_eff', name: 'Budget Shader', tier: 4, productionCost: 1500, baseMarketPrice: 2200, researchCost: 7500, branch: 'efficiency', prerequisites: ['gpu_3'], specialBonus: { type: 'production', value: 18 } },

  // Tier 5
  { id: 'gpu_5_perf', name: 'Shader Model 2.0', tier: 5, productionCost: 5000, baseMarketPrice: 8000, researchCost: 35000, branch: 'performance', prerequisites: ['gpu_4_perf'] },
  { id: 'gpu_5_eff', name: 'DirectX 8.1 GPU', tier: 5, productionCost: 3800, baseMarketPrice: 5800, researchCost: 26000, branch: 'efficiency', prerequisites: ['gpu_4_eff'] },

  // Tier 6
  { id: 'gpu_6_perf', name: 'Shader Model 3.0', tier: 6, productionCost: 12000, baseMarketPrice: 19000, researchCost: 90000, branch: 'performance', prerequisites: ['gpu_5_perf'], specialBonus: { type: 'market', value: 18 } },
  { id: 'gpu_6_eff', name: 'DirectX 9c GPU', tier: 6, productionCost: 9000, baseMarketPrice: 14000, researchCost: 68000, branch: 'efficiency', prerequisites: ['gpu_5_eff'], specialBonus: { type: 'production', value: 25 } },

  // Tier 7
  { id: 'gpu_7_perf', name: 'Unified Shader', tier: 7, productionCost: 30000, baseMarketPrice: 48000, researchCost: 250000, branch: 'performance', prerequisites: ['gpu_6_perf'] },
  { id: 'gpu_7_eff', name: 'DirectX 10 GPU', tier: 7, productionCost: 22000, baseMarketPrice: 36000, researchCost: 190000, branch: 'efficiency', prerequisites: ['gpu_6_eff'] },

  // Tier 8
  { id: 'gpu_8_perf', name: 'GDDR5 High-End', tier: 8, productionCost: 80000, baseMarketPrice: 130000, researchCost: 750000, branch: 'performance', prerequisites: ['gpu_7_perf'], specialBonus: { type: 'market', value: 30 } },
  { id: 'gpu_8_eff', name: 'GDDR5 Mid-Range', tier: 8, productionCost: 58000, baseMarketPrice: 95000, researchCost: 560000, branch: 'efficiency', prerequisites: ['gpu_7_eff'], specialBonus: { type: 'production', value: 35 } },

  // Tier 9: Ultimate
  { id: 'gpu_9_perf', name: 'Real-Time Lighting', tier: 9, productionCost: 200000, baseMarketPrice: 350000, researchCost: 2000000, branch: 'performance', prerequisites: ['gpu_8_perf'], specialBonus: { type: 'market', value: 50 } },
  { id: 'gpu_9_eff', name: 'HBM2 Compute', tier: 9, productionCost: 145000, baseMarketPrice: 250000, researchCost: 1500000, branch: 'efficiency', prerequisites: ['gpu_8_eff'], specialBonus: { type: 'production', value: 60 } },
];

// Fictional Companies
export const INITIAL_STOCKS: Stock[] = [
  { id: 'stk_1', symbol: 'NBL', name: 'Nebula Systems', currentPrice: 50, history: [48, 49, 50], owned: 0, volatility: 0.05 },
  { id: 'stk_2', symbol: 'GIG', name: 'GigaWeb Corp', currentPrice: 120, history: [115, 118, 120], owned: 0, volatility: 0.08 },
  { id: 'stk_3', symbol: 'FRT', name: 'Fruit Computers', currentPrice: 450, history: [440, 445, 450], owned: 0, volatility: 0.03 },
  { id: 'stk_4', symbol: 'OMN', name: 'OmniDynamics', currentPrice: 15, history: [14, 16, 15], owned: 0, volatility: 0.15 }
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
    "WALL ST: Tech stocks hit all-time high! Investors frenzy.",
    "TREND: VR Headsets are the new hype! Everyone needs chips.",
    "NEWS: Government announces digital infrastructure stimulus.",
    "ANALYSIS: Crypto miners buying every GPU in sight!"
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
};