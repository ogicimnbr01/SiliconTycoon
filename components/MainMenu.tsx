import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Button } from './ui/Button';
import { PlayCircle, RotateCcw, Settings, Trophy, AlertTriangle } from 'lucide-react';

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
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background Animation: Scrolling Grid */}
      <div className="absolute inset-0 z-0 opacity-30 perspective-[500px]">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#0ea5e9_100%)] opacity-20"></div>
        <div
          className="absolute inset-[-100%] w-[300%] h-[300%] origin-center animate-[grid-scroll_20s_linear_infinite]"
          style={{
            backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'rotateX(60deg)'
          }}
        ></div>
      </div>
      <style>{`
        @keyframes grid-scroll {
          0% { transform: rotateX(60deg) translateY(0); }
          100% { transform: rotateX(60deg) translateY(40px); }
        }
      `}</style>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-10 px-6">

        {/* Logo / Title */}
        <div className="text-center animate-in fade-in slide-in-from-top-10 duration-1000 flex flex-col items-center">
          <div className="flex flex-col leading-none select-none">
            <h1 className="text-6xl font-display font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              SILICON
            </h1>
            <h2 className="text-4xl font-display font-thin text-white tracking-[0.2em] -mt-2 opacity-90">
              TYCOON
            </h2>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-6 opacity-80"></div>
        </div>

        {/* Menu Buttons */}
        <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          {hasSave && (
            <button
              onClick={onContinue}
              className="group relative w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg rounded-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              <PlayCircle size={24} strokeWidth={2.5} />
              {t.continue || "RESUME"}
            </button>
          )}

          <button
            onClick={() => {
              if (hasSave) setShowConfirm(true);
              else onNewGame();
            }}
            className={`w-full h-14 border-2 ${hasSave ? 'border-slate-600 text-slate-400 hover:border-cyan-500 hover:text-cyan-400' : 'bg-cyan-600 text-black border-cyan-600 hover:bg-cyan-500'} font-bold text-base rounded-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest bg-black/40 backdrop-blur-sm`}
          >
            <RotateCcw size={20} />
            {t.startNew}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onOpenSettings}
              className="h-12 border border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 rounded-sm transition-all flex items-center justify-center gap-2 uppercase text-xs font-bold tracking-wider"
            >
              <Settings size={16} /> {t.settings}
            </button>
            <button
              onClick={onOpenAchievements}
              className="h-12 border border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 rounded-sm transition-all flex items-center justify-center gap-2 uppercase text-xs font-bold tracking-wider"
            >
              <Trophy size={16} /> {t.achievements}
            </button>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-6 mt-4 opacity-60 hover:opacity-100 transition-opacity">
          <button
            onClick={() => onSetLanguage('en')}
            className={`text-xs font-bold tracking-widest transition-colors ${language === 'en' ? 'text-cyan-400 underline underline-offset-4' : 'text-slate-500 hover:text-slate-300'}`}
          >
            ENGLISH
          </button>
          <div className="w-px h-3 bg-slate-700"></div>
          <button
            onClick={() => onSetLanguage('tr')}
            className={`text-xs font-bold tracking-widest transition-colors ${language === 'tr' ? 'text-cyan-400 underline underline-offset-4' : 'text-slate-500 hover:text-slate-300'}`}
          >
            TÜRKÇE
          </button>
        </div>

      </div>

      {/* Version Info - Bottom Right */}
      <div className="absolute bottom-4 right-6 text-[10px] text-slate-700 font-mono tracking-widest uppercase">
        v1.0.0 • Early Access
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg max-w-xs w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Are you sure?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Starting a new game will <span className="text-red-400 font-bold">permanently delete</span> your current company progress.
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-sm transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    onNewGame();
                    setShowConfirm(false);
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-sm transition-colors"
                >
                  CONFIRM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
