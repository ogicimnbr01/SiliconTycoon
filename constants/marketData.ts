import { MarketTrend, ProductType, GameEra, Stock } from '../types';

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
    },
    {
        id: 'trend_metaverse',
        name: 'Metaverse Hype',
        description: 'Everyone wants to live online. Graphics power needed!',
        requiredSpec: 'performance',
        minSpecValue: 85,
        priceBonus: 2.5,
        penalty: 0.3,
        affectedProducts: [ProductType.GPU],
        requiredEra: ['era_ai', 'era_quantum']
    },
    {
        id: 'trend_robotics',
        name: 'Robotics Age',
        description: 'Robots need efficient processing units.',
        requiredSpec: 'efficiency',
        minSpecValue: 80,
        priceBonus: 2.0,
        penalty: 0.5,
        affectedProducts: [ProductType.CPU, ProductType.GPU],
        requiredEra: ['era_ai', 'era_neural']
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
        cpuDemandMod: 0.8,
        gpuDemandMod: 1.3
    },
    {
        id: 'era_ai',
        name: 'AI SINGULARITY',
        startDay: 365,
        description: 'Generative AI explosion. Insane GPU demand.',
        cpuDemandMod: 0.7,
        gpuDemandMod: 2.5
    },
    {
        id: 'era_quantum',
        name: 'QUANTUM LEAP',
        startDay: 700,
        description: 'Quantum computing becomes reality. Physics is broken.',
        cpuDemandMod: 4.0,
        gpuDemandMod: 0.2
    },
    {
        id: 'era_neural',
        name: 'NEURAL LINK',
        startDay: 1200,
        description: 'Direct brain-computer interfaces. Latency must be zero.',
        cpuDemandMod: 2.5,
        gpuDemandMod: 2.5
    }
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
