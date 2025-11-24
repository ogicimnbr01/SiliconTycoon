import React, { useState } from 'react';
import { GameState } from '../types';
import { Pause, Play, Zap, FastForward, Info } from 'lucide-react';
import { ERAS, TRANSLATIONS } from '../constants';

interface ResourceHeaderProps {
   gameState: GameState;
   onSetSpeed: (speed: 'paused' | 'normal' | 'fast') => void;
}

const ResourceHeaderComponent: React.FC<ResourceHeaderProps> = ({ gameState, onSetSpeed }) => {
   const [showEraInfo, setShowEraInfo] = useState(false);
   const currentEra = ERAS.find(e => e.id === gameState.currentEraId) || ERAS[0];
   const t = TRANSLATIONS[gameState.language];

   return (
      <div className="flex flex-col w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl z-50 relative pt-[env(safe-area-inset-top)]">

         {/* ALT BİLGİLER (PARA, RP, GÜN) */}
         <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex gap-5">
               <div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t.netWorth}</div>
                  <div className="text-xl font-mono font-black text-white leading-none tracking-tight shadow-black drop-shadow-md">
                     ${gameState.money >= 1000000 ? (gameState.money / 1000000).toFixed(2) + 'M' : gameState.money >= 1000 ? (gameState.money / 1000).toFixed(1) + 'k' : Math.floor(gameState.money)}
                  </div>
               </div>
               <div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t.research}</div>
                  <div className="text-xl font-mono font-black text-purple-400 leading-none tracking-tight shadow-black drop-shadow-md">
                     {gameState.rp >= 1000 ? (gameState.rp / 1000).toFixed(1) + 'k' : Math.floor(gameState.rp)}
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="text-right relative">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t.day} {gameState.day}</div>
                  <button
                     onClick={() => setShowEraInfo(!showEraInfo)}
                     className="text-[10px] font-bold text-blue-400 uppercase bg-blue-900/20 px-2 py-0.5 rounded border border-blue-500/20 hover:bg-blue-900/40 transition-colors flex items-center gap-1"
                  >
                     {currentEra.name}
                     <Info size={10} className="text-blue-400/70" />
                  </button>

                  {showEraInfo && (
                     <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setShowEraInfo(false)} />
                        <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl z-[70] animate-in fade-in zoom-in-95 text-left">
                           <h4 className="text-xs font-bold text-white mb-2 border-b border-slate-800 pb-2">{currentEra.name}</h4>
                           <p className="text-[10px] text-slate-400 leading-relaxed mb-3">{currentEra.description}</p>
                           <div className="space-y-1.5 bg-slate-950/50 p-2 rounded-lg">
                              <div className="flex justify-between text-[10px]">
                                 <span className="text-slate-500">CPU Demand:</span>
                                 <span className={`font-bold ${currentEra.cpuDemandMod > 1 ? "text-emerald-400" : currentEra.cpuDemandMod < 1 ? "text-red-400" : "text-slate-400"}`}>
                                    {Math.round(currentEra.cpuDemandMod * 100)}%
                                 </span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                 <span className="text-slate-500">GPU Demand:</span>
                                 <span className={`font-bold ${currentEra.gpuDemandMod > 1 ? "text-emerald-400" : currentEra.gpuDemandMod < 1 ? "text-red-400" : "text-slate-400"}`}>
                                    {Math.round(currentEra.gpuDemandMod * 100)}%
                                 </span>
                              </div>
                           </div>
                        </div>
                     </>
                  )}
               </div>

               <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
                  <button
                     onClick={() => onSetSpeed('paused')}
                     className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 ${gameState.gameSpeed === 'paused' ? 'bg-yellow-500/20 text-yellow-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                     <Pause size={16} fill="currentColor" />
                  </button>
                  <button
                     onClick={() => onSetSpeed('normal')}
                     className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 ${gameState.gameSpeed === 'normal' ? 'bg-emerald-500/20 text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                     <Play size={16} fill="currentColor" />
                  </button>
                  <button
                     onClick={() => onSetSpeed('fast')}
                     className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 ${gameState.gameSpeed === 'fast' ? 'bg-blue-500/20 text-blue-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                     <FastForward size={16} fill="currentColor" />
                  </button>
               </div>
            </div>
         </div>

         { }
         <div className="px-4 pb-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 shrink-0 shadow-sm">
               <Zap size={14} className="text-orange-400" fill="currentColor" />
               <span className="text-[10px] font-bold text-slate-300">{Math.floor(gameState.silicon)} {t.silicon}</span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
               <div className="text-[10px] font-bold text-slate-500">{t.rep}:</div>
               <div className="flex-1 h-3 bg-slate-900 rounded-full border border-slate-700 relative overflow-hidden max-w-[120px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500" style={{ width: `${gameState.reputation}%` }}></div>
               </div>
               <div className="text-[9px] font-bold text-white uppercase truncate">
                  {gameState.reputation < 20 ? t.repUnknown : gameState.reputation < 40 ? t.repLocal : gameState.reputation < 60 ? t.repNational : gameState.reputation < 80 ? t.repGlobal : t.repTitan}
               </div>
            </div>
         </div>
      </div>
   );
};

export const ResourceHeader = React.memo(ResourceHeaderComponent);