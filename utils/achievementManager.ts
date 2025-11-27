export const ACHIEVEMENT_STORAGE_KEY = 'siliconTycoon_achievements';

export const saveGlobalAchievements = (unlockedIds: string[]) => {
    try {
        localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(unlockedIds));
    } catch (e) {
        console.error('Failed to save global achievements:', e);
    }
};

export const loadGlobalAchievements = (): string[] => {
    try {
        const saved = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Failed to load global achievements:', e);
        return [];
    }
};
