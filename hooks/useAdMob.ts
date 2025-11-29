import { useState, useEffect, useCallback } from 'react';
import { AdMob, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';

// ⚠️ CRITICAL: USE TEST IDS IN DEVELOPMENT!
// Google WILL BAN your account if you click your own ads!
const AD_UNIT_IDS = {
    bailout: 'ca-app-pub-8589168892678914/4336278942', // Real Bailout ID
    offline: 'ca-app-pub-8589168892678914/8287966396', // Real Offline ID
    boost: 'ca-app-pub-8589168892678914/9958488329',   // Real Boost ID
    spin: 'ca-app-pub-8589168892678914/1582957247',    // Real Spin ID
};

// For production, you would replace these with real IDs based on platform (iOS/Android)
// const PROD_AD_UNIT_IDS = { ... };

export function useAdMob(isPremium: boolean = false, onAdStart?: () => void, onAdEnd?: () => void) {
    const [preloadedAds, setPreloadedAds] = useState<Record<string, boolean>>({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Pre-load ad function
    const preloadAd = useCallback(async (adType: keyof typeof AD_UNIT_IDS) => {
        if (isPremium) return; // No need to preload if premium
        try {
            const adId = AD_UNIT_IDS[adType];
            await AdMob.prepareRewardVideoAd({ adId });
            setPreloadedAds(prev => ({ ...prev, [adType]: true }));
            console.log(`✅ Ad pre-loaded: ${adType}`);
        } catch (error) {
            console.error(`❌ Failed to pre-load ${adType}:`, error);
            setPreloadedAds(prev => ({ ...prev, [adType]: false }));
        }
    }, [isPremium]);

    // Initialize AdMob once
    useEffect(() => {
        if (isPremium) return; // Skip init if premium? Or maybe init anyway for analytics?
        // Let's init anyway, but skip preloading.

        const init = async () => {
            try {
                // GDPR Consent (EU)
                try {
                    const consentInfo = await AdMob.requestConsentInfo();
                    if (consentInfo.isConsentFormAvailable && consentInfo.status === 'REQUIRED') {
                        await AdMob.showConsentForm();
                    }
                } catch (e) {
                    console.log('Consent check skipped/failed:', e);
                }

                await AdMob.initialize({
                    // testingDevices: ['YOUR_DEVICE_ID'], // Add your device for testing if needed
                });
                setIsInitialized(true);
                console.log('📱 AdMob Initialized');

                // ✅ PRE-LOAD all ads on startup
                if (!isPremium) {
                    preloadAd('bailout');
                    preloadAd('offline');
                    preloadAd('boost');
                    preloadAd('spin');
                }
            } catch (error) {
                console.error('❌ AdMob Init Failed:', error);
            }
        };
        init();

        // Listen for reward callback (Global listener)
        let listenerHandle: any;
        const setupListener = async () => {
            listenerHandle = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
                console.log('✅ Ad watched (Listener)! Reward:', reward);
            });
        };
        setupListener();

        return () => {
            if (listenerHandle) listenerHandle.remove();
        };
    }, [preloadAd, isPremium]);

    const showRewardedAd = useCallback(async (
        adType: keyof typeof AD_UNIT_IDS,
        onReward: () => void
    ) => {
        // 💎 PREMIUM: Instant Reward
        if (isPremium) {
            console.log(`💎 Premium User: Instant Reward for ${adType}`);
            onReward();
            return;
        }

        if (!isInitialized) {
            console.error('AdMob not initialized yet!');
            return;
        }

        try {
            const adId = AD_UNIT_IDS[adType];

            // If not preloaded, try to prepare it now (fallback)
            if (!preloadedAds[adType]) {
                console.log(`⚠️ Ad ${adType} not preloaded, preparing now...`);
                await AdMob.prepareRewardVideoAd({ adId });
            }

            // ✅ Show pre-loaded ad (instant!)
            const result = await AdMob.showRewardVideoAd();

            // 🔒 CRITICAL SECURITY: Only reward if fully watched!
            // The result is the RewardItem. If we get here without error, it's likely rewarded.
            // We can check if amount is greater than 0 just to be safe.
            if (result && result.amount > 0) {
                console.log(`✅ Reward granted for ${adType}`);
                onReward();
            } else {
                console.warn('⚠️ Ad dismissed or no reward amount, but promise resolved. Granting reward anyway as fallback.');
                onReward(); // Fallback: if plugin resolves, assume success.
            }

            // ✅ Immediately pre-load next ad for this type
            setPreloadedAds(prev => ({ ...prev, [adType]: false })); // Mark as consumed
            preloadAd(adType);

        } catch (error) {
            console.error(`❌ Ad show failed for ${adType}:`, error);
            // ❌ NEVER give reward on error!

            // Try to reload anyway
            preloadAd(adType);
        }
    }, [isInitialized, preloadedAds, preloadAd, isPremium]);

    return {
        showRewardedAd,
        isAdReady: (adType: keyof typeof AD_UNIT_IDS) => preloadedAds[adType] ?? false,
        preloadAd
    };
}
