import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Lock, Unlock } from 'lucide-react';
import { Button } from './ui/Button';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface HackingMinigameProps {
   type: 'espionage' | 'sabotage';
   difficulty: number;
   onComplete: (success: boolean) => void;
   onCancel: () => void;
   language: Language;
}

export const HackingMinigame: React.FC<HackingMinigameProps> = ({ type, difficulty, onComplete, onCancel, language }) => {
   const [cursorPos, setCursorPos] = useState(0);
   const [direction, setDirection] = useState(1);
   const [status, setStatus] = useState<'active' | 'success' | 'failed'>('active');
   const requestRef = useRef<number>(0);
   const t = TRANSLATIONS[language];

   // Target zone size and position (randomized per attempt would be better, but static for now)
   const targetStart = 65;
   const targetWidth = 20 - (difficulty * 2); // Harder = smaller target
   const targetEnd = targetStart + targetWidth;

   useEffect(() => {
      const animate = () => {
         setCursorPos(prev => {
            let next = prev + (direction * (0.8 + difficulty * 0.2));
            if (next >= 100) {
               setDirection(-1);
               return 100;
            }
            if (next <= 0) {
               setDirection(1);
               return 0;
            }
            return next;
         });
         requestRef.current = requestAnimationFrame(animate);
      };

      if (status === 'active') {
         requestRef.current = requestAnimationFrame(animate);
      }

      return () => cancelAnimationFrame(requestRef.current!);
   }, [direction, difficulty, status]);

   const handleHack = () => {
      if (status !== 'active') return;

      cancelAnimationFrame(requestRef.current!);

      const success = cursorPos >= targetStart && cursorPos <= targetEnd;
      setStatus(success ? 'success' : 'failed');

      setTimeout(() => {
         onComplete(success);
      }, 1000);
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
         <div className="w-full max-w-sm bg-black border-2 border-green-500/50 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.2)] relative">

            {/* Header */}
            <div className="bg-green-900/20 p-3 border-b border-green-500/30 flex justify-between items-center">
               <div className="flex items-center gap-2 text-green-500 animate-pulse">
                  <Zap size={16} />
                  <span className="font-mono font-bold text-xs uppercase tracking-widest">{t.hackProtocol}: {type}</span>
               </div>
               <button onClick={onCancel} className="text-green-700 hover:text-green-500">
                  <X size={18} />
               </button>
            </div>

            {/* Game Area */}
            <div className="p-8 flex flex-col items-center gap-6 relative bg-[linear-gradient(rgba(0,20,0,1)_2px,transparent_2px),linear-gradient(90deg,rgba(0,20,0,1)_2px,transparent_2px)] bg-[size:20px_20px]">

               {/* Status Display */}
               <div className={`text-4xl font-mono font-black tracking-wider transition-all ${status === 'active' ? 'text-green-500 opacity-80' :
                     status === 'success' ? 'text-emerald-400 scale-110' : 'text-red-500 scale-110'
                  }`}>
                  {status === 'active' ? (
                     <span className="animate-pulse">{t.hackLocked}</span>
                  ) : status === 'success' ? (
                     t.hackGranted
                  ) : (
                     t.hackDetected
                  )}
               </div>

               {/* The Bar */}
               <div className="w-full h-12 bg-black border-2 border-green-900 rounded relative overflow-hidden">
                  {/* Target Zone */}
                  <div
                     className="absolute top-0 bottom-0 bg-green-500/30 border-x border-green-400"
                     style={{ left: `${targetStart}%`, width: `${targetWidth}%` }}
                  ></div>

                  {/* Cursor */}
                  <div
                     className={`absolute top-0 bottom-0 w-2 transition-colors shadow-[0_0_15px_currentColor] ${status === 'failed' ? 'bg-red-500 text-red-500' : 'bg-white text-white'}`}
                     style={{ left: `${cursorPos}%` }}
                  ></div>
               </div>

               <p className="text-[10px] font-mono text-green-700 uppercase text-center">
                  {t.hackInstruction}
               </p>

               <button
                  onClick={handleHack}
                  disabled={status !== 'active'}
                  className="w-full py-6 bg-green-900/20 border border-green-500 text-green-400 font-mono font-bold text-xl rounded hover:bg-green-500 hover:text-black transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase tracking-[0.2em]"
               >
                  {status === 'active' ? t.hackExecute : status === 'success' ? t.hackUploading : t.hackLost}
               </button>

            </div>
         </div>
      </div>
   );
};
