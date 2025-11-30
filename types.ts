
export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU'
}

export interface DesignSpec {
  performance: number; // 0-100
  efficiency: number;  // 0-100
}

export enum OfficeLevel {
  GARAGE = 0,
  BASEMENT = 1,
  STARTUP = 2,
  CORPORATE = 3,
  CAMPUS = 4,
  HEADQUARTERS = 5
}

export interface Researcher {
  id: string;
  name: string;
  hiredAt: number;
}

export type Language = 'en' | 'tr';
export type TabType = 'factory' | 'rnd' | 'market' | 'finance' | 'automation' | 'management';
export type GameStage = 'menu' | 'game' | 'game_over';

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  dailyPayment: number;
  remainingDays: number;
}

export interface TechNode {
  id: string;
  name: string;
  tier: number;
  baseMarketPrice: number;
  researchCost: number; // Keep for legacy/compatibility if needed, or deprecate
  rpCost?: number; // New RP cost
  productionCost: number;
  prerequisites?: string[]; // Required tech IDs to unlock this
  requiredTechId?: string | null; // Single parent for strict tree (Manufacturing)
  branch?: 'performance' | 'efficiency' | 'balanced';
  specialBonus?: {
    type: 'production' | 'quality' | 'market';
    value: number;
  };
  yield?: number; // 0-100, default 100 if undefined
  description?: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  history: number[];
  owned: number;
  avgBuyPrice: number;
  volatility: number;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  requiredProduct: ProductType;
  requiredAmount: number;
  fulfilledAmount: number;
  reward: number;
  penalty: number;
  deadlineDay: number;
  duration: number;
  upfrontPayment: number;
  completionPayment: number;
  minPerformance?: number;
  minEfficiency?: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  effect?: (state: GameState) => Partial<GameState>;
  type: 'positive' | 'negative' | 'neutral';
  requiredEra?: string[]; // IDs of eras where this event can occur
}

export interface Hero {
  id: string;
  name: string;
  role: string;
  hiringCost: number;
  dailySalary: number;
  description: string;
  effectType: 'sales' | 'research' | 'stock';
  effectValue: number;
}

export interface GameEra {
  id: string;
  name: string;
  startDay: number;
  description: string;
  cpuDemandMod: number;
  gpuDemandMod: number;
}

export interface MarketTrend {
  id: string;
  name: string;
  description: string;
  requiredSpec: 'performance' | 'efficiency';
  minSpecValue: number;
  priceBonus: number;
  penalty: number;
  affectedProducts: ProductType[]; // Which products this trend affects
  requiredEra?: string[]; // IDs of eras where this trend can occur
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  condition: (state: GameState) => boolean;
  reward?: {
    type: 'money' | 'rp' | 'reputation';
    value: number;
  };
}

export interface SaveMetadata {
  slotId: string;
  timestamp: number;
  companyName: string;
  netWorth: number;
  day: number;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number; // Days
  awarenessBoost: number; // Percentage
  type: 'social' | 'influencer' | 'tv' | 'event';
}

export interface ActiveCampaign {
  id: string; // Campaign ID
  daysRemaining: number;
}

export interface Competitor {
  id: string;
  name: string;
  marketShare: Record<ProductType, number>; // 0-100% for each product type
  productQuality: Record<ProductType, number>; // 0-100 quality rating
  aggressiveness: number; // 0-100, affects pricing and R&D investment
  cashReserves: number;
  techLevel: Record<ProductType, number>; // Current tech level
  money: number; // New: Track competitor money
  history: number[]; // New: Track money history for charts
  lastReleaseDay: number; // New: Track last product release
}

export interface FinancialSnapshot {
  day: number;
  money: number;
}

export interface RivalLaunch {
  id: string;
  companyName: string;
  productName: string;
  effect: number;
  daysRemaining: number;
}

export interface TutorialState {
  active: boolean;
  stepIndex: number;
  completed: boolean;
}

export interface HackingState {
  active: boolean;
  type: 'espionage' | 'sabotage';
  difficulty: number;
  targetId?: string;
  cost?: number;
}

export interface ProductionLine {
  id: string;
  name: string;
  productType: ProductType;
  activeDesignId: string | null; // ID of the design being produced
  level: number;
  efficiency: number; // 0-100%, degrades over time
  dailyOutput: number;
  status: 'idle' | 'producing' | 'maintenance' | 'no_silicon';
  maintenanceCost: number; // Cost to restore efficiency to 100%
  specialization?: 'speed' | 'quality' | 'efficiency'; // Line type
  lastMaintenanceDay?: number;
}

export interface BoardMission {
  id: string;
  title: string;
  description: string;
  type: 'profit' | 'quality' | 'prestige';
  targetValue: number;
  deadlineDay: number;
  penalty: number; // Prestige penalty
  reward: number;
}

export interface OfflineReportData {
  elapsedSeconds: number;
  moneyEarned: number;
  rpEarned: number;
}

export interface HackingResult {
  success: boolean;
  targetName: string;
  type: 'espionage' | 'sabotage';
  changes: {
    label: string;
    before: string;
    after: string;
    isPositive: boolean;
  }[];
  rewardText?: string;
}

export interface GameState {
  // System
  stage: GameStage;
  language: Language;
  day: number;
  gameSpeed: 'paused' | 'normal' | 'fast';
  lastSaveTime: number;
  bankruptcyTimer: number;

  // Resources
  money: number;
  companyName: string;
  rp: number;
  silicon: number;
  siliconPrice: number;

  // Infrastructure & Staff

  officeLevel: OfficeLevel;
  productionLines: ProductionLine[];

  // Research
  researchers: number | Researcher[]; // Migration support: number -> Researcher[]
  hiredHeroes: string[]; // IDs of hired heroes


  // Reputation & Brand
  reputation: number;
  productionQuality: 'low' | 'medium' | 'high';

  // Product Design (Old System)
  designSpecs: Record<ProductType, DesignSpec>;

  // Inventory & Tech
  inventory: Record<ProductType, number>;
  techLevels: Record<ProductType, number>;

  // Market Dynamics
  currentEraId: string;
  marketMultiplier: number;
  activeTrendId: string;
  activeRivalLaunch: RivalLaunch | null;
  financialHistory: FinancialSnapshot[];

  // Contracts
  activeContracts: Contract[];
  availableContracts: Contract[];

  // Stock Market
  stocks: Stock[];
  isPubliclyTraded: boolean;
  playerCompanySharesOwned: number;
  playerSharePrice: number;

  // Legacy
  prestigePoints: number;

  // UI & Events
  unlockedTabs: TabType[]; // Controls visual progression
  logs: LogEntry[];
  activeEvent: GameEvent | null;

  // Mini-games
  hacking: HackingState;
  hackingResult: HackingResult | null;
  offlineReport: OfflineReportData | null;
  unlockedAchievements?: string[];

  loans: Loan[];
  staffMorale: number; // 0-100
  workPolicy: 'relaxed' | 'normal' | 'crunch';
  researchPolicy: 'safe' | 'balanced' | 'aggressive';
  boardMissions: BoardMission[];
  globalTechLevels: Record<ProductType, number>; // Dünyanın teknoloji seviyesi

  // Marketing
  activeCampaigns: ActiveCampaign[];
  brandAwareness: Record<ProductType, number>; // 0-100

  // Advanced Economy (Hardcore Mode)
  marketSaturation: Record<ProductType, number>; // 0-1, how flooded market is
  dailyDemand: Record<ProductType, number>; // Daily maximum sellable units before severe penalty

  // Competitors
  competitors: Competitor[];

  // AdMob & Monetization
  bailoutUsedToday: boolean;
  overdriveActive: boolean;
  overdriveEndsAt: number;
  lastOverdriveTime: number;
  offlineAdWatched: boolean;

  // Daily Wheel
  dailySpinCount: number;
  nextSpinTime: number;
  lastDailyReset: number;

  // Premium
  isPremium: boolean;

  dailySales: Record<ProductType, number>;
  lastSalesResetDay: number;

  // Factory Automation
  factory: FactoryState;
  manufacturingTechLevels: Record<string, number>; // ID -> Level (0 or 1 for unlock)
}

export interface FactoryModule {
  level: number;
  rate: number; // Items per tick/second
}

export interface FactoryState {
  landOwned: boolean;
  modules: {
    procurement: FactoryModule;
    assembly: FactoryModule;
    logistics: FactoryModule;
  };
}

export interface LogEntry {
  id: number;
  message: string;
  type: 'success' | 'info' | 'danger' | 'warning';
  timestamp: string;
  tag?: string;
}