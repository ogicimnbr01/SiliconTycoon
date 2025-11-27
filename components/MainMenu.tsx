
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Button } from './ui/Button';
import { Globe, Cpu, PlayCircle, RotateCcw, Settings, Trophy } from 'lucide-react';

interface MainMenuProps {
  language: Language;
  hasSave: boolean;
  onNewGame: () => void;
  onContinue: () => void;
  onSetLanguage: (lang: Language) => void;
  onOpenSettings: () => void;
  onOpenAchievements: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  language,
  hasSave,
  onNewGame,
  onContinue,
  onSetLanguage,
  onOpenSettings,
  onOpenAchievements
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 px-6">
      {/* Background Cyberpunk Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black z-0"></div>
      <div className="absolute inset-0 opacity-20 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-8">

        {/* Logo / Title */}
        <div className="text-center animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <Cpu size={48} className="text-indigo-400 animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase">{t.welcome}</h1>
          <p className="text-sm text-indigo-400 font-mono tracking-widest uppercase">{t.subtitle}</p>
        </div>

        {/* Menu Buttons */}
        <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          {hasSave && (
            <Button
              variant="success"
              size="lg"
              onClick={onContinue}
              className="w-full h-16 text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <PlayCircle size={24} /> {t.continue || "LOAD GAME"}
            </Button>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={onNewGame}
            className="w-full h-16 text-lg border-dashed"
          >
            <RotateCcw size={24} /> {t.startNew}
          </Button>

          {hasSave && (
            <p className="text-[10px] text-red-400/70 text-center uppercase font-mono">
              {t.resetWarning}
            </p>
          )}

          <Button
            variant="secondary"
            size="lg"
            onClick={onOpenSettings}
            className="w-full h-16 text-lg border-slate-700"
          >
            <Settings size={24} /> {t.settings}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onOpenAchievements}
            className="w-full h-16 text-lg border-slate-700"
          >
            <Trophy size={24} /> {t.achievements}
          </Button>
        </div>

        <div className="mt-12 text-slate-600 font-mono text-sm">{t.version}</div>

        {/* Language Toggle */}
        <div className="flex items-center gap-4 mt-8 bg-slate-900/50 p-2 rounded-full border border-slate-800">
          <button
            onClick={() => onSetLanguage('en')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            ENGLISH
          </button>
          <button
            onClick={() => onSetLanguage('tr')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${language === 'tr' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            TÜRKÇE
          </button>
        </div>

      </div>
    </div>
  );
};
