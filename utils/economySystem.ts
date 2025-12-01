/**
 * BALANCED ECONOMY SYSTEM (Progressive Difficulty)
 * 
 * This module implements economic mechanics that start easy but get harder.
 * Players have guaranteed margins early but must strategize as they scale.
 * 
 * Design Philosophy:
 * - Easy to Start = Good cash flow for first research
 * - Hard to Master = Strategic depth for veterans
 * - New Tech = Rewarded heavily (Hype Bonus)
 */

import { ProductType } from '../types';

// ============================================================
// CONFIGURATION CONSTANTS (Balanced Tuning)
// ============================================================

export const ECONOMY_CONFIG = {
    // Price Decay (Moore's Law Effect) - SOFTENED
    DECAY_RATE: 0.75,             // 25% price drop per tier gap (was 40%)
    MIN_SCRAP_VALUE: 1,           // Even e-waste has $1 value

    // New Tech Hype Bonus
    HYPE_MULTIPLIER: 1.5,         // 50% bonus for current-gen tech

    // Storage Costs - REDUCED for early game
    STORAGE_BASE_COST: 0.25,      // $0.25 per item per day (was $0.50)
    STORAGE_FILL_EXPONENT: 1.5,   // Less aggressive scaling (was 2.0)
    EARLY_STORAGE_RELIEF: 0.5,    // 50% discount for Tier 0-1

    // Market Dynamics - SOFTENED
    CRASH_SEVERITY: 0.3,
    BASE_DAILY_DEMAND: 100,
    TIER_DEMAND_MULTIPLIER: 1.5,

    // Daily Market Limits
    DAILY_MARKET_DEMAND: {
        [ProductType.CPU]: 1000,
        [ProductType.GPU]: 600
    },
    OVERSELL_PENALTY: 0.10,

    // Recovery
    MARKET_RECOVERY_RATE: 0.15,
} as const;

// ============================================================
// 1. PROGRESSIVE PRICE SYSTEM (Easy Start, Hard Scale)
// ============================================================

/**
 * Calculates sell price with progressive difficulty.
 * 
 * BALANCING RULES:
 * 1. Current-gen tech gets 1.5x HYPE BONUS (funding expansion)
 * 2. One tier behind = small penalty (75% of base)
 * 3. Two+ tiers behind = exponential decay
 * 
 * @param basePrice - Original market price for this tech tier
 * @param productTier - Current product's tech level (0-9)
 * @param marketEra - Global market's current era tier (0-9)
 * @returns Final sell price (minimum $1)
 * 
 * @example
 * // Market Era 3, selling Tier 3 (Current Gen)
 * calculateSellPrice(100, 3, 3) 
 * // Returns: 100 * 1.5 = $150 (HYPE BONUS!)
 * 
 * // Market Era 3, selling Tier 2 (One behind)
 * calculateSellPrice(100, 2, 3)
 * // Returns: 100 * 0.75 = $75 (manageable)
 * 
 * // Market Era 5, selling Tier 1 (Old tech)
 * calculateSellPrice(100, 1, 5)
 * // Returns: 100 * 0.75^4 = $31.64 (decay kicks in)
 */
/**
 * Gets the profit margin multiplier based on tech tier.
 * 
 * MARGIN CURVE:
 * - Tier 0: 20% (Survival)
 * - Tier 1: 50% (Breathing room)
 * - Tier 2: 100% (Growth)
 * - Tier 3: 150% (Expansion)
 * - Tier 4+: 200% + (50% per tier) (Dominance)
 */
export function getTechMargin(tier: number): number {
    if (tier === 0) return 0.20;
    if (tier === 1) return 0.50;
    if (tier === 2) return 1.00;
    if (tier === 3) return 1.50;
    return 2.00 + ((tier - 4) * 0.50);
}

/**
 * Calculates sell price with progressive difficulty.
 * 
 * NEW FORMULA:
 * Price = BasePrice * DecayMultiplier
 * 
 * Note: BasePrice in constants.ts is now pre-calculated based on:
 * (SiliconCost * (1 + TechMargin))
 * 
 * @param basePrice - Original market price for this tech tier (from constants)
 * @param productTier - Current product's tech level (0-9)
 * @param marketEra - Global market's current era tier (0-9)
 * @returns Final sell price (minimum $1)
 */
export function calculateSellPrice(
    basePrice: number,
    productTier: number,
    marketEra: number
): number {
    // RULE 2: Current Gen = HYPE BONUS
    if (productTier === marketEra) {
        return basePrice * ECONOMY_CONFIG.HYPE_MULTIPLIER;
    }

    // Future tech (shouldn't happen, but just in case)
    if (productTier > marketEra) {
        return basePrice * 1.5; // Massive bonus for being ahead of time
    }

    const tierGap = marketEra - productTier;

    // RULE 3: Progressive decay (softer than before)
    const decayMultiplier = Math.pow(ECONOMY_CONFIG.DECAY_RATE, tierGap);
    const finalPrice = basePrice * decayMultiplier;

    // Even trash has scrap value
    return Math.max(finalPrice, ECONOMY_CONFIG.MIN_SCRAP_VALUE);
}

/**
 * Gets a visual warning level based on price decay severity
 */
export function getPriceDecayWarning(
    productTier: number,
    marketEra: number
): 'none' | 'hype' | 'caution' | 'danger' | 'trash' {
    const gap = marketEra - productTier;

    if (gap < 0) return 'none';
    if (gap === 0) return 'hype';      // Current gen! 🔥
    if (gap === 1) return 'caution';   // -25% (1 tier old)
    if (gap === 2) return 'danger';    // -44% (2 tiers old)
    return 'trash';                     // -68%+ (ancient tech)
}

// ============================================================
// 2. PROGRESSIVE STORAGE TAX (Gentler for Early Game)
// ============================================================

/**
 * Calculates daily storage cost based on inventory fill ratio.
 * 
 * BALANCING RULES:
 * - Tier 0-1 products get 50% storage discount (early game relief)
 * - Empty warehouse = cheap
 * - Full warehouse = expensive but not crippling
 * 
 * @param totalItems - Current inventory count
 * @param maxCapacity - Maximum warehouse capacity
 * @param avgProductTier - Average tier of stored products (0-9)
 * @returns Daily storage cost in dollars
 * 
 * @example
 * // 500 Tier 0 items in 1000-capacity warehouse
 * calculateStorageCost(500, 1000, 0)
 * // Base: 500 * 0.25 = $125
 * // Fill penalty: (0.5)^1.5 = 0.35
 * // Early relief: * 0.5 = 0.175
 * // Total: $125 * 0.175 = $21.88/day (very affordable!)
 */
export function calculateStorageCost(
    totalItems: number,
    maxCapacity: number,
    avgProductTier: number = 0
): number {
    if (totalItems === 0) return 0;

    const fillRatio = Math.min(1, totalItems / maxCapacity);

    // Base cost scales linearly with items
    const baseCost = totalItems * ECONOMY_CONFIG.STORAGE_BASE_COST;

    // Fill penalty scales with exponent (softer than before)
    const fillPenalty = Math.pow(fillRatio, ECONOMY_CONFIG.STORAGE_FILL_EXPONENT);

    // Early game relief for Tier 0-1
    const earlyGameRelief = avgProductTier <= 1 ? ECONOMY_CONFIG.EARLY_STORAGE_RELIEF : 1.0;

    return baseCost * fillPenalty * earlyGameRelief;
}

/**
 * Gets recommended action based on storage utilization
 */
export function getStorageRecommendation(
    totalItems: number,
    maxCapacity: number
): { level: 'safe' | 'warning' | 'critical'; message: string } {
    const ratio = totalItems / maxCapacity;

    if (ratio < 0.5) {
        return { level: 'safe', message: 'Efficient storage usage' };
    }
    if (ratio < 0.75) {
        return { level: 'warning', message: 'Storage costs rising' };
    }
    return {
        level: 'critical',
        message: 'Near capacity! Consider selling'
    };
}

// ============================================================
// 3. MARKET CRASH (Supply Shock)
// ============================================================

/**
 * Calculates actual revenue from batch sale with market crash penalty.
 * 
 * WHY THIS IS HARD:
 * - Selling 100 items when demand is 100 = normal price
 * - Selling 200 items when demand is 100 = 50% price crash
 * - Selling 1000 items when demand is 100 = massive loss
 * - Forces gradual selling instead of "dump everything"
 * 
 * @param amount - Number of units to sell
 * @param unitPrice - Current market price per unit
 * @param dailyDemand - How much market can absorb without crash
 * @returns Actual total revenue after crash penalty
 * 
 * @example
 * // Normal sale: 50 units @ $100 each, demand = 100
 * executeBatchSell(50, 100, 100)
 * // Oversupply: 50/100 = 0.5
 * // Crash: 1 - (0.5 * 0.5) = 0.75 (25% loss)
 * // Revenue: 50 * 100 * 0.75 = $3,750 (instead of $5,000)
 * 
 * // MASSIVE DUMP: 500 units @ $100 each, demand = 100
 * executeBatchSell(500, 100, 100)
 * // Oversupply: 500/100 = 5.0
 * // Crash: 1 - (5.0 * 0.5) = -1.5 → clamped to 0.5 (50% loss)
 * // Revenue: 500 * 100 * 0.5 = $25,000 (instead of $50,000) 💀
 */
export function executeBatchSell(
    amount: number,
    unitPrice: number,
    dailyDemand: number
): {
    revenue: number;
    effectivePrice: number;
    crashPenalty: number;
    warning: string | null;
} {
    if (amount === 0) {
        return { revenue: 0, effectivePrice: 0, crashPenalty: 0, warning: null };
    }

    // Calculate oversupply ratio
    const oversupplyRatio = amount / dailyDemand;

    // Market crash severity (capped at 50% max crash)
    const crashPenalty = Math.min(
        ECONOMY_CONFIG.CRASH_SEVERITY,
        oversupplyRatio * ECONOMY_CONFIG.CRASH_SEVERITY
    );

    // Price multiplier after crash
    const priceMultiplier = Math.max(0.5, 1 - crashPenalty);

    const effectivePrice = unitPrice * priceMultiplier;
    const revenue = amount * effectivePrice;

    // Generate warning
    let warning: string | null = null;
    if (oversupplyRatio > 2) {
        warning = `⚠️ Crash -${(crashPenalty * 100).toFixed(0)}%`;
    } else if (oversupplyRatio > 1) {
        warning = `Oversupply -${(crashPenalty * 100).toFixed(0)}%`;
    }

    return {
        revenue,
        effectivePrice,
        crashPenalty,
        warning
    };
}

/**
 * Calculates daily demand based on product tier
 * Higher tier products have smaller but more valuable markets
 */
export function getDailyDemand(productTier: number): number {
    return Math.floor(
        ECONOMY_CONFIG.BASE_DAILY_DEMAND *
        Math.pow(ECONOMY_CONFIG.TIER_DEMAND_MULTIPLIER, -productTier)
    );
}

// ============================================================
// COMBINED SYSTEM: Final Sell Price Calculator
// ============================================================

/**
 * Master function combining all economic mechanics
 * This is what should be called when player clicks "SELL"
 */
export function calculateFinalRevenue(params: {
    basePrice: number;
    amount: number;
    productTier: number;
    productType: ProductType;
    marketEra: number;
    marketSaturation: number; // 0-1, how flooded is the market
}): {
    revenue: number;
    breakdown: {
        baseRevenue: number;
        afterDecay: number;
        afterCrash: number;
        afterSaturation: number;
    };
    warnings: string[];
} {
    const { basePrice, amount, productTier, marketEra, marketSaturation } = params;

    const warnings: string[] = [];

    // 1. Apply price decay (or hype bonus!)
    const decayedPrice = calculateSellPrice(basePrice, productTier, marketEra);
    const decayWarning = getPriceDecayWarning(productTier, marketEra);

    if (decayWarning === 'hype') {
        warnings.push('🔥 +50% Hype!');
    } else if (decayWarning === 'trash') {
        warnings.push('🗑️ Old tech');
    } else if (decayWarning === 'danger') {
        warnings.push('⚠️ Outdated');
    }

    // 2. Apply market crash
    const dailyDemand = getDailyDemand(productTier);
    const { revenue: crashedRevenue, warning: crashWarning } = executeBatchSell(
        amount,
        decayedPrice,
        dailyDemand
    );
    if (crashWarning) warnings.push(crashWarning);

    // 3. Apply market saturation (from previous sales)
    const saturationPenalty = 1 - (marketSaturation * 0.3); // max 30% reduction (softer)
    const finalRevenue = crashedRevenue * saturationPenalty;

    if (marketSaturation > 0.5) {
        warnings.push(`📉 Market ${(marketSaturation * 100).toFixed(0)}% flooded`);
    }

    return {
        revenue: finalRevenue,
        breakdown: {
            baseRevenue: basePrice * amount,
            afterDecay: decayedPrice * amount,
            afterCrash: crashedRevenue,
            afterSaturation: finalRevenue
        },
        warnings
    };
}

// ============================================================
// UTILITY: Era Tier Mapping
// ============================================================

/**
 * Maps era IDs to tech tiers for price decay calculation
 */
export function getEraTier(eraId: string): number {
    const eraTiers: Record<string, number> = {
        'transistor': 0,
        '8bit': 1,
        '16bit': 2,
        '32bit': 3,
        'pentium': 4,
        'multicore': 5,
        'mobile': 6,
        'ai': 7,
        'quantum': 8,
        'neural': 9
    };

    return eraTiers[eraId] ?? 0;
}

// ============================================================
// ANALYTICS: Game Balance Helpers
// ============================================================

/**
 * Simulates economy impact for playtesting
 * Run this in console to tune constants
 */
export function simulateEconomy(scenario: {
    inventory: number;
    capacity: number;
    productTier: number;
    marketEra: number;
    daysToSimulate: number;
}) {
    const { inventory, capacity, productTier, marketEra, daysToSimulate } = scenario;

    let money = 0;
    let currentInventory = inventory;

    console.group('🎮 Economy Simulation');
    console.log('Initial Inventory:', currentInventory);
    console.log('Product Tier:', productTier);
    console.log('Market Era:', marketEra);
    console.log('---');

    for (let day = 1; day <= daysToSimulate; day++) {
        // Daily storage cost
        const storageCost = calculateStorageCost(currentInventory, capacity);
        money -= storageCost;

        // Sell 10% of inventory
        const sellAmount = Math.floor(currentInventory * 0.1);
        const { revenue } = calculateFinalRevenue({
            basePrice: 100,
            amount: sellAmount,
            productTier,
            productType: ProductType.CPU,
            marketEra,
            marketSaturation: 0
        });

        money += revenue;
        currentInventory -= sellAmount;

        console.log(`Day ${day}: Sold ${sellAmount}, Cost $${storageCost.toFixed(0)}, Net $${(revenue - storageCost).toFixed(0)}`);
    }

    console.log('---');
    console.log('Final Money:', money.toFixed(0));
    console.log('Remaining Inventory:', currentInventory);
    console.groupEnd();

    return { finalMoney: money, remainingInventory: currentInventory };
}
