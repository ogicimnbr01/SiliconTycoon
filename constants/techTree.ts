import { TechNode } from '../types';

// Tech Tree for CPUs (10 TIERS with Branching) - TECH VALUE REBALANCE
export const CPU_TECH_TREE: TechNode[] = [
    // Tier 0: 8-bit (Survival Mode - Low Margin)
    { id: 'cpu_0', name: '8-bit Processor', tier: 0, productionCost: 30, baseMarketPrice: 70, researchCost: 0, branch: 'balanced', yield: 100 },

    // Tier 1: 16-bit (Better Margin)
    { id: 'cpu_1', name: '16-bit Processor', tier: 1, productionCost: 70, baseMarketPrice: 180, researchCost: 250, branch: 'balanced', prerequisites: ['cpu_0'], yield: 95 },

    // Tier 2: 32-bit RISC (Good Profit)
    { id: 'cpu_2', name: '32-bit RISC', tier: 2, productionCost: 150, baseMarketPrice: 350, researchCost: 1200, branch: 'balanced', prerequisites: ['cpu_1'], yield: 90 },

    // Tier 3: 32-bit CISC (High Profit)
    { id: 'cpu_3', name: '32-bit CISC', tier: 3, productionCost: 300, baseMarketPrice: 900, researchCost: 5000, branch: 'balanced', prerequisites: ['cpu_2'], yield: 85 },

    // Tier 4: Branching starts (Exponential Research Costs)
    { id: 'cpu_4_perf', name: '64-bit High-Freq', tier: 4, productionCost: 600, baseMarketPrice: 2000, researchCost: 25000, branch: 'performance', prerequisites: ['cpu_3'], specialBonus: { type: 'market', value: 10 }, yield: 75 },
    { id: 'cpu_4_eff', name: '64-bit Low-Power', tier: 4, productionCost: 500, baseMarketPrice: 1600, researchCost: 25000, branch: 'efficiency', prerequisites: ['cpu_3'], specialBonus: { type: 'production', value: 15 }, yield: 80 },

    // Tier 5
    { id: 'cpu_5_perf', name: 'Dual-Core HT', tier: 5, productionCost: 1200, baseMarketPrice: 4500, researchCost: 100000, branch: 'performance', prerequisites: ['cpu_4_perf'], yield: 70 },
    { id: 'cpu_5_eff', name: 'Dual-Core Budget', tier: 5, productionCost: 900, baseMarketPrice: 3500, researchCost: 100000, branch: 'efficiency', prerequisites: ['cpu_4_eff'], yield: 75 },

    // Tier 6
    { id: 'cpu_6_perf', name: 'Quad-Core OC', tier: 6, productionCost: 2500, baseMarketPrice: 8000, researchCost: 250000, branch: 'performance', prerequisites: ['cpu_5_perf'], yield: 60 },
    { id: 'cpu_6_eff', name: 'Quad-Core Mobile', tier: 6, productionCost: 1800, baseMarketPrice: 6000, researchCost: 250000, branch: 'efficiency', prerequisites: ['cpu_5_eff'], yield: 65 },

    // Tier 7
    { id: 'cpu_7_perf', name: 'Octa-Core Extreme', tier: 7, productionCost: 5000, baseMarketPrice: 18000, researchCost: 1000000, branch: 'performance', prerequisites: ['cpu_6_perf'], yield: 55 },
    { id: 'cpu_7_eff', name: 'Octa-Core Efficient', tier: 7, productionCost: 4000, baseMarketPrice: 14000, researchCost: 1000000, branch: 'efficiency', prerequisites: ['cpu_6_eff'], yield: 60 },

    // Tier 8
    { id: 'cpu_8', name: '16-Core Workstation', tier: 8, productionCost: 10000, baseMarketPrice: 38000, researchCost: 5000000, branch: 'balanced', prerequisites: ['cpu_7_perf', 'cpu_7_eff'], yield: 50 },

    // Tier 9
    { id: 'cpu_9', name: '64-Core EPYC', tier: 9, productionCost: 20000, baseMarketPrice: 85000, researchCost: 20000000, branch: 'balanced', prerequisites: ['cpu_8'], yield: 45 },
];


// Tech Tree for GPUs (10 TIERS with Branching) - TECH VALUE REBALANCE
export const GPU_TECH_TREE: TechNode[] = [
    // Tier 0: VGA (Survival Mode)
    { id: 'gpu_0', name: 'VGA Graphics', tier: 0, productionCost: 45, baseMarketPrice: 100, researchCost: 0, branch: 'balanced', yield: 95 },

    // Tier 1: SVGA (Better Margin)
    { id: 'gpu_1', name: 'SVGA Graphics', tier: 1, productionCost: 120, baseMarketPrice: 280, researchCost: 200, branch: 'balanced', prerequisites: ['gpu_0'], yield: 90 },

    // Tier 2: 3D Accelerator (Good Profit)
    { id: 'gpu_2', name: '3D Accelerator', tier: 2, productionCost: 250, baseMarketPrice: 600, researchCost: 800, branch: 'balanced', prerequisites: ['gpu_1'], yield: 85 },

    // Tier 3: T&L GPU (High Profit)
    { id: 'gpu_3', name: 'T&L GPU', tier: 3, productionCost: 550, baseMarketPrice: 1600, researchCost: 3500, branch: 'balanced', prerequisites: ['gpu_2'], yield: 80 },

    // Tier 4: Branching starts
    { id: 'gpu_4_perf', name: 'Shader Model 1.0', tier: 4, productionCost: 1200, baseMarketPrice: 3800, researchCost: 15000, branch: 'performance', prerequisites: ['gpu_3'], specialBonus: { type: 'market', value: 12 }, yield: 70 },
    { id: 'gpu_4_eff', name: 'Budget Shader', tier: 4, productionCost: 1000, baseMarketPrice: 3200, researchCost: 15000, branch: 'efficiency', prerequisites: ['gpu_3'], specialBonus: { type: 'production', value: 18 }, yield: 75 },

    // Tier 5
    { id: 'gpu_5_perf', name: 'Shader Model 2.0', tier: 5, productionCost: 2500, baseMarketPrice: 9000, researchCost: 75000, branch: 'performance', prerequisites: ['gpu_4_perf'], yield: 65 },
    { id: 'gpu_5_eff', name: 'DirectX 8.1 GPU', tier: 5, productionCost: 2000, baseMarketPrice: 6000, researchCost: 75000, branch: 'efficiency', prerequisites: ['gpu_4_eff'], yield: 70 },

    // Tier 6
    { id: 'gpu_6_perf', name: 'Shader Model 3.0', tier: 6, productionCost: 5500, baseMarketPrice: 18000, researchCost: 250000, branch: 'performance', prerequisites: ['gpu_5_perf'], specialBonus: { type: 'market', value: 18 }, yield: 60 },
    { id: 'gpu_6_eff', name: 'DirectX 9c GPU', tier: 6, productionCost: 4500, baseMarketPrice: 14000, researchCost: 250000, branch: 'efficiency', prerequisites: ['gpu_5_eff'], specialBonus: { type: 'production', value: 25 }, yield: 65 },

    // Tier 7
    { id: 'gpu_7_perf', name: 'Unified Shader', tier: 7, productionCost: 12000, baseMarketPrice: 42000, researchCost: 1000000, branch: 'performance', prerequisites: ['gpu_6_perf'], yield: 55 },
    { id: 'gpu_7_eff', name: 'DirectX 10 GPU', tier: 7, productionCost: 9000, baseMarketPrice: 32000, researchCost: 1000000, branch: 'efficiency', prerequisites: ['gpu_6_eff'], yield: 60 },

    // Tier 8
    { id: 'gpu_8', name: 'Ray Tracing Core', tier: 8, productionCost: 25000, baseMarketPrice: 90000, researchCost: 5000000, branch: 'balanced', prerequisites: ['gpu_7_perf', 'gpu_7_eff'], yield: 50 },

    // Tier 9
    { id: 'gpu_9', name: 'AI Tensor Core', tier: 9, productionCost: 50000, baseMarketPrice: 200000, researchCost: 20000000, branch: 'balanced', prerequisites: ['gpu_8'], yield: 45 },
];

export const MANUFACTURING_TECH_TREE: TechNode[] = [
    {
        id: 'basic_tools',
        name: 'Basic Tools',
        tier: 0,
        baseMarketPrice: 0,
        researchCost: 0,
        rpCost: 100,
        productionCost: 0,
        requiredTechId: null,
        description: "Essential tools for manual chip production."
    },
    {
        id: 'assembly_basics',
        name: 'Assembly Basics',
        tier: 1,
        baseMarketPrice: 0,
        researchCost: 0,
        rpCost: 500,
        productionCost: 0,
        requiredTechId: 'basic_tools',
        description: "Optimized workspace layout. Improves manual crafting speed."
    },
    {
        id: 'mass_production',
        name: 'Mass Production',
        tier: 2,
        baseMarketPrice: 0,
        researchCost: 0,
        rpCost: 3000,
        productionCost: 0,
        requiredTechId: 'assembly_basics',
        description: "Unlocks Factory Automation Tab."
    },
    {
        id: 'advanced_logistics',
        name: 'Advanced Logistics',
        tier: 3,
        baseMarketPrice: 0,
        researchCost: 0,
        rpCost: 50000,
        productionCost: 0,
        requiredTechId: 'mass_production',
        description: "Boosts Logistics Module efficiency by 50%."
    },
    {
        id: 'ai_procurement',
        name: 'AI Procurement',
        tier: 4,
        baseMarketPrice: 0,
        researchCost: 0,
        rpCost: 200000,
        productionCost: 0,
        requiredTechId: 'advanced_logistics',
        description: "Boosts Procurement Module efficiency by 50%."
    },
    {
        id: 'quantum_manufacturing',
        name: 'Quantum Manufacturing',
        tier: 5,
        baseMarketPrice: 0,
        researchCost: 0,
        rpCost: 5000000,
        productionCost: 0,
        requiredTechId: 'ai_procurement',
        description: "Doubles efficiency of all modules."
    }
];
