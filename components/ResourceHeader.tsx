import React, { useState } from 'react';
import { GameState } from '../types';
import { Pause, Play, Zap, FastForward, Info, Calendar, TrendingUp } from 'lucide-react';
import { ERAS, TRANSLATIONS } from '../constants';

interface ResourceHeaderProps {
   gameState: GameState;
   onSetSpeed: (speed: 'paused' | 'normal' | 'fast') => void;
}

const ResourceHeaderComponent: React.FC<ResourceHeaderProps> = ({ gameState, onSetSpeed }) => {
   const [showEraInfo, setShowEraInfo] = useState(false);
   const currentEraIndex = ERAS.findIndex(e => e.id === gameState.currentEraId);
   const currentEra = ERAS[currentEraIndex] || ERAS[0];
   const nextEra = ERAS[currentEraIndex + 1];
   const t = TRANSLATIONS[gameState.language];

   // Calculate Era Progress
   let progress = 100;
   if (nextEra) {
      const totalDuration = nextEra.startDay - currentEra.startDay;
      const elapsed = gameState.day - currentEra.startDay;
      progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
   }

   return (

      <div className="flex flex-col w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl z-50 relative" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)' }}>

         {/* MAIN HEADER ROW */}
         <div className="px-3 py-2 flex items-center justify-between gap-2">

            {/* LEFT: Money & RP (Compact) */}
            <div className="flex flex-col gap-0.5 shrink-0">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 w-8">{t.cash}</span>
                  <span className="font-mono font-black text-emerald-400 text-sm shadow-black drop-shadow-md">
                     ${gameState.money >= 1000000 ? (gameState.money / 1000000).toFixed(2) + 'M' : gameState.money >= 1000 ? (gameState.money / 1000).toFixed(1) + 'k' : Math.floor(gameState.money)}
                  </span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 w-8">{t.rndAcronym}</span>
                  <span className="font-mono font-black text-purple-400 text-sm shadow-black drop-shadow-md">
                     {gameState.rp >= 1000 ? (gameState.rp / 1000).toFixed(1) + 'k' : Math.floor(gameState.rp)}
                  </span>
               </div>
            </div>

            {/* CENTER: Era Badge (Compact) */}
            <button
               onClick={() => setShowEraInfo(!showEraInfo)}
               className="flex flex-col items-center justify-center bg-slate-900/80 border border-slate-700/50 rounded-lg px-3 py-1 active:scale-95 transition-all"
            >
               <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Calendar size={10} /> {t.day} {gameState.day}
               </div>
               <div className="text-xs font-bold text-blue-100 truncate max-w-[100px]">
                  {currentEra.name}
               </div>
               {nextEra && (
                  <div className="text-[8px] font-bold text-blue-400 mt-0.5">
                     {t.nextEra}: {Math.round(progress)}%
                  </div>
               )}
            </button>

            {/* RIGHT: Speed Controls (Compact) */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 shrink-0">
               <button onClick={() => onSetSpeed('paused')} className={`w-7 h-7 rounded flex items-center justify-center ${gameState.gameSpeed === 'paused' ? 'bg-yellow-500/20 text-yellow-500' : 'text-slate-500'}`}><Pause size={14} fill="currentColor" /></button>
               <button onClick={() => onSetSpeed('normal')} className={`w-7 h-7 rounded flex items-center justify-center ${gameState.gameSpeed === 'normal' ? 'bg-emerald-500/20 text-emerald-500' : 'text-slate-500'}`}><Play size={14} fill="currentColor" /></button>
               <button onClick={() => onSetSpeed('fast')} className={`w-7 h-7 rounded flex items-center justify-center ${gameState.gameSpeed === 'fast' ? 'bg-blue-500/20 text-blue-500' : 'text-slate-500'}`}><FastForward size={14} fill="currentColor" /></button>
            </div>
         </div>

         {/* SECOND ROW: Resources & Rep (Very Compact) */}
         <div className="px-3 pb-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded border border-slate-800/50 shrink-0">
               <Zap size={12} className="text-orange-400" fill="currentColor" />
               <span className="text-xs font-bold text-slate-200">{Math.floor(gameState.silicon)}</span>
            </div>

            <div className="h-4 w-px bg-slate-800"></div>

            <div className="flex items-center gap-2 flex-1 min-w-0">
               <span className="text-[9px] font-bold text-slate-500 uppercase">{t.repAcronym}</span>
               <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-700" style={{ width: `${gameState.reputation}%` }}></div>
               </div>
               <span className="text-[10px] font-bold text-slate-400">{Math.floor(gameState.reputation)}%</span>
            </div>
         </div>

         {/* ERA PROGRESS LINE (Bottom Border) */}
         <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800">
            <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
         </div>

         {/* ERA INFO MODAL (Same as before but positioned better) */}
         {showEraInfo && (
            <>
               <div className="fixed inset-0 z-[60]" onClick={() => setShowEraInfo(false)} />
               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl z-[70] animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                     <h4 className="text-sm font-bold text-white">{currentEra.name}</h4>
                     <span className="text-[10px] font-mono text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-900">{Math.round(progress)}%</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{currentEra.description}</p>
                  {/* ... rest of tooltip content ... */}
                  <div className="space-y-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.marketModifiers}</div>
                     <div className="flex justify-between text-xs items-center">
                        <span className="text-slate-400">{t.cpuDemand}</span>
                        <div className={`font-bold px-2 py-0.5 rounded ${currentEra.cpuDemandMod > 1 ? "bg-emerald-500/10 text-emerald-400" : currentEra.cpuDemandMod < 1 ? "bg-red-500/10 text-red-400" : "text-slate-400"}`}>{Math.round(currentEra.cpuDemandMod * 100)}%</div>
                     </div>
                     <div className="flex justify-between text-xs items-center">
                        <span className="text-slate-400">{t.gpuDemand}</span>
                        <div className={`font-bold px-2 py-0.5 rounded ${currentEra.gpuDemandMod > 1 ? "bg-emerald-500/10 text-emerald-400" : currentEra.gpuDemandMod < 1 ? "bg-red-500/10 text-red-400" : "text-slate-400"}`}>{Math.round(currentEra.gpuDemandMod * 100)}%</div>
                     </div>
                  </div>
               </div>
            </>
         )}
      </div>
   );
};

export const ResourceHeader = React.memo(ResourceHeaderComponent);