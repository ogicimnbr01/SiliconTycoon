import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { StatusBar } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { GameState, TabType, OfficeLevel, ProductType } from './types';
import {
    INITIAL_MONEY,
    INITIAL_RP,
    INITIAL_SILICON,
    INITIAL_REPUTATION,
    BASE_SILICON_PRICE,
    ERAS,
    MARKET_TRENDS,
    INITIAL_STOCKS,
    TRANSLATIONS,
    OFFICE_CONFIGS,
    INITIAL_GAME_STATE
} from './constants';
import { FactoryTab } from './components/FactoryTab';
import { ResearchTab } from './components/ResearchTab';
import { ResourceHeader } from './components/ResourceHeader';
import { NewsTicker } from './components/NewsTicker';
import { HackingMinigame } from './components/HackingMinigame';
import { OfflineReport } from './components/ui/OfflineReport';
import { MainMenu } from './components/MainMenu';
import { LayoutGrid, FlaskConical, LineChart, AlertTriangle, Loader2, Pause, Play, LogOut, Landmark, Skull, MailWarning, Lock, Megaphone, BarChart } from 'lucide-react';
import { playSfx, setSoundEnabled } from './utils/SoundManager';
import { SettingsModal } from './components/SettingsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { AchievementPopup } from './components/AchievementPopup';
import { SaveLoadModal } from './components/SaveLoadModal';

import { MarketingTab } from './components/MarketingTab';
import { StatisticsTab } from './components/StatisticsTab';
import { useSaveLoad } from './hooks/useSaveLoad';
import { useGameLoop } from './hooks/useGameLoop';
import { useGameActions } from './hooks/useGameActions';
import { useAchievements } from './hooks/useAchievements';

import { FloatingTextLayer } from './components/ui/FloatingTextLayer';
import { FloatingTextItem } from './components/ui/FloatingText';

const MarketTab = React.lazy(() => import('./components/MarketTab'));

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('factory');
    const [showSettings, setShowSettings] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);
    const [showSaveLoad, setShowSaveLoad] = useState(false);
    const [saveLoadMode, setSaveLoadMode] = useState<'save' | 'load'>('save');
    const [soundEnabled, setSoundEnabledState] = useState(() => {
        const saved = localStorage.getItem('siliconTycoonSettings');
        return saved ? JSON.parse(saved).sound : true;
    });
    const [vibrationEnabled, setVibrationEnabled] = useState(() => {
        const saved = localStorage.getItem('siliconTycoonSettings');
        return saved ? JSON.parse(saved).vibration : true;
    });
    const [activeAchievement, setActiveAchievement] = useState<any>(null);
    const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

    useEffect(() => {
        setSoundEnabled(soundEnabled);
        localStorage.setItem('siliconTycoonSettings', JSON.stringify({ sound: soundEnabled, vibration: vibrationEnabled }));
    }, [soundEnabled, vibrationEnabled]);

    useEffect(() => {
        const hideSystemBars = async () => {
            if (Capacitor.isNativePlatform()) {
                try {
                    await StatusBar.hide();
                    await (NavigationBar as any).hide();
                } catch (e) { console.log("Tam ekran hatası:", e); }
            }
        };
        hideSystemBars();
    }, []);

    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

    const t = TRANSLATIONS[gameState.language];

    const vibrate = useCallback(async (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
        if (!vibrationEnabled) return;
        try {
            if (type === 'light') await Haptics.impact({ style: ImpactStyle.Light });
            else if (type === 'medium') await Haptics.impact({ style: ImpactStyle.Medium });
            else if (type === 'heavy') await Haptics.impact({ style: ImpactStyle.Heavy });
            else if (type === 'success') await Haptics.notification({ type: NotificationType.Success });
            else if (type === 'error') await Haptics.notification({ type: NotificationType.Error });
        } catch (e) { console.warn("Haptics not supported"); }
    }, [vibrationEnabled]);

    const handleShowFloatingText = useCallback((text: string, type: 'income' | 'expense' | 'rp' | 'reputation' | 'neutral', x?: number, y?: number) => {
        const id = Date.now().toString() + Math.random().toString();
        // Default position: Center of screen + random offset
        const defaultX = window.innerWidth / 2 + (Math.random() * 40 - 20);
        const defaultY = window.innerHeight / 2 - 100 + (Math.random() * 40 - 20);

        setFloatingTexts(prev => [...prev, {
            id,
            text,
            type,
            x: x || defaultX,
            y: y || defaultY
        }]);
    }, []);

    const handleFloatingTextComplete = useCallback((id: string) => {
        setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, []);

    // Hooks
    const { handleNewGame, loadGame, saveGame, deleteSave, getSlots, hasAnySave } = useSaveLoad(gameState, setGameState, setActiveTab, playSfx, vibrate);
    useGameLoop(gameState, setGameState, playSfx, vibrate, handleShowFloatingText);
    useAchievements(gameState, setGameState, playSfx, vibrate, (ach) => {
        setActiveAchievement(ach);
    });
    const actions = useGameActions(gameState, setGameState, setActiveTab, playSfx, vibrate, handleShowFloatingText);

    const TabButton = useCallback(({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => {
        const isLocked = !gameState.unlockedTabs.includes(id);
        let lockReason = "";
        if (id === 'rnd') lockReason = "$10k";
        if (id === 'finance') lockReason = "$50k";
        if (id === 'marketing') lockReason = "$100k";
        if (id === 'statistics') lockReason = "$1k";

        return (
            <button
                onClick={() => { if (!isLocked) actions.handleTabSwitch(id); }}
                className={`flex flex-col items-center justify-center py-1 flex-1 transition-all active:scale-95 touch-manipulation relative ${activeTab === id ? 'text-corp-accent bg-slate-800/80 rounded-xl mx-2 shadow-[0_0_15px_rgba(14,165,233,0.2)]' : isLocked ? 'opacity-50' : 'text-slate-500'}`}
            >
                {isLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 rounded-xl backdrop-blur-[1px]">
                        <Lock size={12} className="text-slate-400 mb-0.5" />
                        {lockReason && <span className="text-[8px] font-bold text-slate-300 bg-slate-800 px-1 rounded">{lockReason}</span>}
                    </div>
                )}
                <Icon size={26} className={`mb-1 ${activeTab === id ? 'stroke-2' : 'stroke-1'}`} />
                <span className="text-[9px] font-mono font-bold tracking-widest">{t[id as keyof typeof t] || label}</span>
            </button>
        );
    }, [activeTab, gameState.unlockedTabs, actions.handleTabSwitch, t]);

    const getBackgroundClass = useCallback(() => {
        switch (gameState.officeLevel) {
            case OfficeLevel.GARAGE: return "bg-slate-950";
            case OfficeLevel.BASEMENT: return "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-slate-950 to-black";
            case OfficeLevel.STARTUP: return "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-900 to-black";
            case OfficeLevel.CORPORATE: return "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-black";
            case OfficeLevel.CAMPUS: return "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950 via-slate-900 to-black";
            case OfficeLevel.HEADQUARTERS: return "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-slate-900 to-black";
            default: return "bg-slate-950";
        }
    }, [gameState.officeLevel]);

    if (gameState.stage === 'menu') {
        return (
            <>
                <MainMenu
                    language={gameState.language}
                    hasSave={hasAnySave}
                    onNewGame={handleNewGame}
                    onContinue={() => {
                        setSaveLoadMode('load');
                        setShowSaveLoad(true);
                    }}
                    onSetLanguage={(lang) => setGameState(prev => ({ ...prev, language: lang }))}
                    onOpenSettings={() => setShowSettings(true)}
                    onOpenAchievements={() => setShowAchievements(true)}
                />
                <SettingsModal
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                    soundEnabled={soundEnabled}
                    vibrationEnabled={vibrationEnabled}
                    onToggleSound={() => setSoundEnabledState(prev => !prev)}
                    onToggleVibration={() => setVibrationEnabled(prev => !prev)}
                    onOpenSaveGame={() => {
                        setSaveLoadMode('save');
                        setShowSaveLoad(true);
                    }}
                    onOpenLoadGame={() => {
                        setSaveLoadMode('load');
                        setShowSaveLoad(true);
                    }}
                    language={gameState.language}
                />
                <AchievementsModal
                    isOpen={showAchievements}
                    onClose={() => setShowAchievements(false)}
                    unlockedAchievements={gameState.unlockedAchievements || []}
                    language={gameState.language}
                />
                <SaveLoadModal
                    isOpen={showSaveLoad}
                    onClose={() => setShowSaveLoad(false)}
                    mode={saveLoadMode}
                    getSlots={getSlots}
                    onSave={saveGame}
                    onLoad={loadGame}
                    onDelete={deleteSave}
                    language={gameState.language}
                />
            </>
        );
    }
    if ((gameState.stage as any) === 'game_over') {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
                <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mb-6 border-4 border-red-600 animate-pulse"><Skull size={48} className="text-red-500" /></div>
                <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">{t.gameOver}</h1>
                <p className="text-red-400 font-mono text-lg mb-10 uppercase tracking-widest">{t.fired}</p>
                <button onClick={handleNewGame} className="w-64 py-5 bg-white text-black font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 transition-all uppercase tracking-widest">{t.tryAgain}</button>
            </div>
        );
    }

    return (
        <div className={`w-full h-full absolute inset-0 ${getBackgroundClass()} text-slate-300 font-sans overflow-hidden flex flex-col select-none`}>
            {gameState.activeEvent && (
                <div className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-slate-900 border-2 border-slate-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center">
                        <div className={`w-20 h-20 rounded-full mb-6 mx-auto flex items-center justify-center animate-bounce ${gameState.activeEvent.type === 'negative' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                            {gameState.activeEvent.id.includes('resign') ? <MailWarning size={40} /> : <AlertTriangle size={40} />}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{gameState.activeEvent.title}</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">{gameState.activeEvent.description}</p>
                        <button onClick={actions.handleEventDismiss} className="w-full py-4 bg-white text-black font-bold rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-transform">ACKNOWLEDGE</button>
                    </div>
                </div>
            )}

            {gameState.hacking.active && (<HackingMinigame type={gameState.hacking.type} difficulty={gameState.hacking.difficulty} onComplete={actions.handleHackingComplete} onCancel={() => setGameState(prev => ({ ...prev, hacking: { ...prev.hacking, active: false } }))} language={gameState.language} />)}
            {gameState.offlineReport && (<OfflineReport data={gameState.offlineReport} language={gameState.language} onDismiss={() => setGameState(prev => ({ ...prev, money: prev.money + prev.offlineReport!.moneyEarned, rp: prev.rp + prev.offlineReport!.rpEarned, offlineReport: null }))} />)}

            {gameState.gameSpeed === 'paused' && gameState.stage === 'game' && (
                <div className="absolute inset-0 z-[50] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border-4 border-slate-800 shadow-2xl"><Pause size={40} className="text-slate-400" fill="currentColor" /></div>
                    <h2 className="text-4xl font-black text-white tracking-widest mb-2">{t.paused}</h2>
                    <p className="text-slate-400 font-mono text-sm mb-10 uppercase tracking-wider">{t.productionHalted}</p>
                    <button onClick={() => setGameState(prev => ({ ...prev, gameSpeed: 'normal' }))} className="w-72 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest mb-4"><Play size={24} fill="currentColor" />{t.resume}</button>
                    <button onClick={() => setGameState(prev => ({ ...prev, stage: 'menu', gameSpeed: 'paused' }))} className="w-72 py-4 bg-slate-800/50 border-2 border-slate-700 text-slate-400 font-bold text-lg rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest hover:bg-indigo-900/20 hover:text-indigo-400 hover:border-indigo-500/50 mb-4"><LogOut size={20} />{t.returnToMenu}</button>
                    <button onClick={() => { const stateToSave = { ...gameState, lastSaveTime: Date.now() }; localStorage.setItem('siliconTycoonState', JSON.stringify(stateToSave)); CapacitorApp.exitApp(); }} className="w-72 py-4 bg-slate-800/50 border-2 border-slate-700 text-slate-400 font-bold text-lg rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/50"><LogOut size={20} />{t.saveAndExit}</button>
                </div>
            )}

            <div className="flex-shrink-0 z-20">
                <ResourceHeader gameState={gameState} onSetSpeed={(speed) => { playSfx('click'); setGameState(prev => ({ ...prev, gameSpeed: speed })); }} />
            </div>

            <div className="flex-1 overflow-y-auto overscroll-none px-4 pb-32 pt-4 scroll-smooth no-scrollbar w-full">
                {activeTab === 'factory' && (<FactoryTab gameState={gameState} language={gameState.language} onProduce={actions.handleProduce} onBuySilicon={actions.handleBuySilicon} onUpgradeOffice={actions.handleUpgradeOffice} onSetStrategy={(s) => setGameState(prev => ({ ...prev, productionQuality: s }))} onUpdateDesignSpec={actions.handleUpdateDesignSpec} />)}

                {activeTab === 'rnd' && (
                    <ResearchTab
                        gameState={gameState}
                        language={gameState.language}
                        onResearch={actions.handleResearch}
                        onHireResearcher={actions.handleHireResearcher}
                        onHireHero={actions.handleHireHero}
                        onSetWorkPolicy={actions.handleSetWorkPolicy}
                        onFireResearcher={actions.handleFireResearcher}
                    />
                )}

                {activeTab === 'market' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-corp-accent" size={40} /></div>}>
                        <MarketTab
                            mode="commercial"
                            gameState={gameState}
                            language={gameState.language}
                            onSell={actions.handleSell}
                            onBuyStock={actions.handleBuyStock}
                            onSellStock={actions.handleSellStock}
                            onIPO={actions.handleIPO}
                            onAcceptContract={actions.handleAcceptContract}
                            onCovertOp={actions.handleCovertOpTrigger}
                            onRetire={actions.handleRetire}
                            onTakeLoan={actions.handleTakeLoan}
                            onPayLoan={actions.handlePayLoan}
                            onTradeOwnShares={actions.handleTradeOwnShares}
                            unlockedTabs={gameState.unlockedTabs}
                        />
                    </Suspense>
                )}

                {activeTab === 'finance' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-corp-accent" size={40} /></div>}>
                        <MarketTab
                            mode="financial"
                            gameState={gameState}
                            language={gameState.language}
                            onSell={actions.handleSell}
                            onBuyStock={actions.handleBuyStock}
                            onSellStock={actions.handleSellStock}
                            onIPO={actions.handleIPO}
                            onAcceptContract={actions.handleAcceptContract}
                            onCovertOp={actions.handleCovertOpTrigger}
                            onRetire={actions.handleRetire}
                            onTakeLoan={actions.handleTakeLoan}
                            onPayLoan={actions.handlePayLoan}
                            onTradeOwnShares={actions.handleTradeOwnShares}
                            unlockedTabs={gameState.unlockedTabs}
                        />
                    </Suspense>
                )}

                {activeTab === 'marketing' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-corp-accent" size={40} /></div>}>
                        <MarketingTab
                            money={gameState.money}
                            brandAwareness={gameState.brandAwareness}
                            activeCampaigns={gameState.activeCampaigns}
                            onLaunchCampaign={actions.handleLaunchCampaign}
                            language={gameState.language}
                        />
                    </Suspense>
                )}

                {activeTab === 'statistics' && (
                    <StatisticsTab
                        gameState={gameState}
                        language={gameState.language}
                    />
                )}
            </div>

            <div className="absolute bottom-0 w-full z-40 flex flex-col safe-area-pb">
                <div className="w-full bg-slate-950 border-t border-slate-800 relative z-50">
                    <NewsTicker logs={gameState.logs} />
                </div>
                <div className="w-full h-[70px] bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 flex items-center px-4 shadow-[0_-5px_30px_rgba(0,0,0,0.8)] relative z-50">
                    <TabButton id="factory" label="FACTORY" icon={LayoutGrid} />
                    <TabButton id="rnd" label="R&D" icon={FlaskConical} />
                    <TabButton id="market" label="MARKET" icon={LineChart} />
                    <TabButton id="finance" label="FINANCE" icon={Landmark} />
                    <TabButton id="marketing" label="MARKETING" icon={Megaphone} />
                    <TabButton id="statistics" label="STATISTICS" icon={BarChart} />
                </div>
            </div>

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                soundEnabled={soundEnabled}
                vibrationEnabled={vibrationEnabled}
                onToggleSound={() => setSoundEnabledState(prev => !prev)}
                onToggleVibration={() => setVibrationEnabled(prev => !prev)}
                onOpenSaveGame={() => {
                    setSaveLoadMode('save');
                    setShowSaveLoad(true);
                }}
                onOpenLoadGame={() => {
                    setSaveLoadMode('load');
                    setShowSaveLoad(true);
                }}
                language={gameState.language}
            />
            <AchievementsModal
                isOpen={showAchievements}
                onClose={() => setShowAchievements(false)}
                unlockedAchievements={gameState.unlockedAchievements || []}
                language={gameState.language}
            />
            <AchievementPopup
                achievement={activeAchievement}
                onClose={() => setActiveAchievement(null)}
                language={gameState.language}
            />
            <SaveLoadModal
                isOpen={showSaveLoad}
                onClose={() => setShowSaveLoad(false)}
                mode={saveLoadMode}
                getSlots={getSlots}
                onSave={saveGame}
                onLoad={loadGame}
                onDelete={deleteSave}
                language={gameState.language}
            />
            <FloatingTextLayer items={floatingTexts} onComplete={handleFloatingTextComplete} />
        </div>
    );
};

export default App;