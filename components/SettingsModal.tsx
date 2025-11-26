import React from 'react';
import { X, Volume2, VolumeX, Smartphone, SmartphoneNfc } from 'lucide-react';
import { Button } from './ui/Button';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    onToggleSound: () => void;
    onToggleVibration: () => void;
    onOpenSaveGame: () => void;
    onOpenLoadGame: () => void;
    language: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    soundEnabled,
    vibrationEnabled,
    onToggleSound,
    onToggleVibration,
    onOpenSaveGame,
    onOpenLoadGame,
    language
}) => {
    if (!isOpen) return null;
    const t = TRANSLATIONS[language];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 border border-indigo-500/50 rounded-2xl shadow-[0_0_50px_rgba(79,70,229,0.3)] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-indigo-500/30 bg-indigo-900/20">
                    <h2 className="text-xl font-bold text-white tracking-widest uppercase">{t.settings}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Sound Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${soundEnabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-500'}`}>
                                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{t.soundEffects}</h3>
                                <p className="text-xs text-slate-400">{t.soundDesc}</p>
                            </div>
                        </div>
                        <div
                            onClick={onToggleSound}
                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${soundEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    {/* Vibration Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${vibrationEnabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-500'}`}>
                                {vibrationEnabled ? <SmartphoneNfc size={24} /> : <Smartphone size={24} />}
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{t.vibration}</h3>
                                <p className="text-xs text-slate-400">{t.vibrationDesc}</p>
                            </div>
                        </div>
                        <div
                            onClick={onToggleVibration}
                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${vibrationEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${vibrationEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-end">
                    <Button variant="primary" onClick={onClose} className="w-full sm:w-auto">
                        {t.close}
                    </Button>
                </div>

            </div>
        </div>
    );
};
