import { useEffect } from 'react';
import { GameState } from '../types';
import { ACHIEVEMENTS, TRANSLATIONS } from '../constants';
import { saveGlobalAchievements } from '../utils/achievementManager';

export const useAchievements = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    playSfx: (sfx: any) => void,
    vibrate: (type: any) => void,
    onUnlock?: (achievement: any) => void
) => {
    useEffect(() => {
        if (gameState.stage !== 'game') return;

        const unlockedIds = new Set(gameState.unlockedAchievements || []);
        const newUnlocks: string[] = [];
        let shouldUpdate = false;
        let newMoney = gameState.money;
        let newRp = gameState.rp;
        let newReputation = gameState.reputation;

        ACHIEVEMENTS.forEach(ach => {
            if (!unlockedIds.has(ach.id)) {
                if (ach.condition(gameState)) {
                    newUnlocks.push(ach.id);
                    shouldUpdate = true;

                    // Apply Reward
                    if (ach.reward) {
                        if (ach.reward.type === 'money') newMoney += ach.reward.value;
                        if (ach.reward.type === 'rp') newRp += ach.reward.value;
                        if (ach.reward.type === 'reputation') newReputation = Math.min(100, newReputation + ach.reward.value);
                    }
                }
            }
        });

        if (shouldUpdate) {
            playSfx('success');
            vibrate('success');

            const t = TRANSLATIONS[gameState.language];
            const newLogs = [...gameState.logs];

            newUnlocks.forEach(id => {
                const ach = ACHIEVEMENTS.find(a => a.id === id);
                if (ach) {
                    if (onUnlock) onUnlock(ach);
                    newLogs.push({
                        id: Date.now() + Math.random(),
                        message: `${t.achievementUnlocked}: ${t[`${ach.id}_title` as keyof typeof t] || ach.title}`,
                        type: 'success',
                        timestamp: `${t.day} ${gameState.day}`
                    });
                }
            });

            // Save to global storage
            const allUnlocked = [...unlockedIds, ...newUnlocks];
            saveGlobalAchievements(allUnlocked);

            setGameState(prev => ({
                ...prev,
                money: newMoney,
                rp: newRp,
                reputation: newReputation,
                unlockedAchievements: allUnlocked,
                logs: newLogs
            }));
        }
    }, [gameState, setGameState, playSfx, vibrate, onUnlock]);
};
