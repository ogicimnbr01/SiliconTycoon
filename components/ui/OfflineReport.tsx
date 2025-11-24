
import React from 'react';
import { OfflineReportData, Language } from '../../types';
import { Button } from './Button';
import { Moon, DollarSign, FlaskConical } from 'lucide-react';
import { TRANSLATIONS } from '../../constants';

interface OfflineReportProps {
   data: OfflineReportData;
   onDismiss: () => void;
   language: Language;
}

export const OfflineReport: React.FC<OfflineReportProps> = ({ data, onDismiss, language }) => {
   const t = TRANSLATIONS[language];

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-300">
         <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-indigo-950/50 p-6 text-center border-b border-slate-800">
               <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                  <Moon size={32} />
               </div>
               <h2 className="text-2xl font-bold text-white mb-1">{t.welcomeBack}</h2>
               <p className="text-sm text-slate-400">
                  {t.offlineMessage.replace('{0}', (data.elapsedSeconds / 60).toFixed(0))}
               </p>
            </div>

            <div className="p-6 space-y-4">
               <div className="flex items-center justify-between p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center gap-3 text-emerald-400">
                     <DollarSign size={20} />
                     <span className="text-sm font-bold uppercase">{t.earnings}</span>
                  </div>
                  <div className="font-mono text-xl font-bold text-white">
                     +${data.moneyEarned.toLocaleString()}
                  </div>
               </div>

               <div className="flex items-center justify-between p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center gap-3 text-purple-400">
                     <FlaskConical size={20} />
                     <span className="text-sm font-bold uppercase">{t.research}</span>
                  </div>
                  <div className="font-mono text-xl font-bold text-white">
                     +{data.rpEarned.toLocaleString()} RP
                  </div>
               </div>

               <Button variant="primary" size="lg" className="w-full mt-2" onClick={onDismiss}>
                  {t.collectResources}
               </Button>
            </div>
         </div>
      </div>
   );
};
