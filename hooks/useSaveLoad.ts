import { useEffect, useCallback, useState } from 'react';
import { GameState, ProductType, TabType, SaveMetadata } from '../types';
import {
    INITIAL_MONEY,
    INITIAL_RP,
    INITIAL_SILICON,
    INITIAL_GAME_STATE
} from '../constants';

const SAVE_PREFIX = 'siliconTycoon_save_';

export const useSaveLoad = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    setActiveTab: (tab: TabType) => void,
    playSfx: (sfx: any) => void,
    vibrate: (type: any) => void
) => {
    const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

    const getSlots = useCallback((): SaveMetadata[] => {
        const slots: SaveMetadata[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(SAVE_PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key)!);
                    const slotId = key.replace(SAVE_PREFIX, '');
                    slots.push({
                        slotId,
                        timestamp: data.lastSaveTime || Date.now(),
                        companyName: "Silicon Corp", // TODO: Add company name to state
                        netWorth: data.money, // Simplified net worth
                        day: data.day
                    });
                } catch (e) {
                    console.error("Failed to parse save slot", key);
                }
            }
        }
        return slots.sort((a, b) => b.timestamp - a.timestamp);
    }, []);

    const saveGame = useCallback((slotId: string) => {
        const stateToSave = { ...gameState, lastSaveTime: Date.now() };
        localStorage.setItem(`${SAVE_PREFIX}${slotId}`, JSON.stringify(stateToSave));
        setActiveSlotId(slotId);
        playSfx('success');
        vibrate('success');
    }, [gameState, playSfx, vibrate]);

    const loadGame = useCallback((slotId: string) => {
        const saved = localStorage.getItem(`${SAVE_PREFIX}${slotId}`);
        if (saved) {
            try {
                const loaded = JSON.parse(saved);
                // Migration logic (same as before)
                if (!loaded.unlockedTabs) loaded.unlockedTabs = ['factory', 'market'];
                loaded.gameSpeed = 'paused';
                delete loaded.isPaused;
                if (!loaded.loans) loaded.loans = [];
                if (!loaded.staffMorale) loaded.staffMorale = 100;
                if (!loaded.workPolicy) loaded.workPolicy = 'normal';
                if (loaded.bankruptcyTimer === undefined) loaded.bankruptcyTimer = 0;
                if (!loaded.globalTechLevels) {
                    loaded.globalTechLevels = { [ProductType.CPU]: 0, [ProductType.GPU]: 0 };
                }
                if (!loaded.productionLines) loaded.productionLines = [];
                if (!loaded.designSpecs) {
                    loaded.designSpecs = {
                        [ProductType.CPU]: { performance: 50, efficiency: 50 },
                        [ProductType.GPU]: { performance: 50, efficiency: 50 }
                    };
                }
                if (!loaded.inventory) loaded.inventory = {};
                if (loaded.inventory[ProductType.CPU] === undefined) loaded.inventory[ProductType.CPU] = 0;
                if (loaded.inventory[ProductType.GPU] === undefined) loaded.inventory[ProductType.GPU] = 0;
                if (!loaded.techLevels) loaded.techLevels = {};
                if (loaded.techLevels[ProductType.CPU] === undefined) loaded.techLevels[ProductType.CPU] = 0;
                if (loaded.techLevels[ProductType.GPU] === undefined) loaded.techLevels[ProductType.GPU] = 0;
                if (!loaded.unlockedAchievements) loaded.unlockedAchievements = [];
                if (!loaded.activeCampaigns) loaded.activeCampaigns = [];
                if (!loaded.brandAwareness) {
                    loaded.brandAwareness = { [ProductType.CPU]: 0, [ProductType.GPU]: 0 };
                }
                if (!loaded.competitors) loaded.competitors = [];

                setGameState(prev => ({
                    ...loaded,
                    language: prev.language, // Preserve language from main menu
                    stage: 'game',
                    lastSaveTime: Date.now()
                }));
                setActiveSlotId(slotId);
                playSfx('click');
            } catch (e) { console.error("Failed load", e); }
        }
    }, [setGameState, playSfx]);

    const deleteSave = useCallback((slotId: string) => {
        localStorage.removeItem(`${SAVE_PREFIX}${slotId}`);
        if (activeSlotId === slotId) setActiveSlotId(null);
        playSfx('click'); // Or delete sound
    }, [activeSlotId, playSfx]);

    const handleNewGame = useCallback(() => {
        playSfx('success');
        vibrate('success');
        setActiveSlotId('autosave'); // Auto-save slot for new games
        setGameState(prev => ({
            ...INITIAL_GAME_STATE,
            language: prev.language, // Preserve language
            stage: 'game',
            gameSpeed: 'normal', // Changed from 'paused' - tutorial will handle pause if needed
            money: INITIAL_GAME_STATE.money + (prev.prestigePoints * 1000),
            prestigePoints: prev.prestigePoints, // Keep accumulated prestige
        }));
        setActiveTab('factory');
    }, [setGameState, setActiveTab, playSfx, vibrate]);

    // Auto-save on day change or interval
    useEffect(() => {
        if (!activeSlotId || gameState.stage !== 'game') return;

        const saveCurrentState = () => {
            const stateToSave = { ...gameState, lastSaveTime: Date.now() };
            localStorage.setItem(`${SAVE_PREFIX}${activeSlotId}`, JSON.stringify(stateToSave));
        };

        saveCurrentState();
    }, [gameState.day, activeSlotId]); // Save whenever day changes

    return {
        handleNewGame,
        loadGame,
        saveGame,
        deleteSave,
        getSlots,
        activeSlotId,
        hasAnySave: getSlots().length > 0
    };
};
