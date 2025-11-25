import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

interface NewsTickerProps {
    logs: { id: number; message: string; type: 'info' | 'success' | 'warning' | 'danger'; timestamp: string }[];
}

const NewsTickerComponent: React.FC<NewsTickerProps> = ({ logs }) => {
    const [newsIndex, setNewsIndex] = useState(0);

    const recentLogs = logs.length > 0
        ? [...logs].reverse().slice(0, 3)
        : [{ id: 0, message: "...", type: 'info' as const, timestamp: '' }];

    useEffect(() => {
        const timer = setInterval(() => {
            setNewsIndex((prev) => (prev + 1) % recentLogs.length);
        }, 4000); // 4 saniyede bir değişsin (Okumak için süre tanıdık)
        return () => clearInterval(timer);
    }, [recentLogs.length]);

    const currentLog = recentLogs[newsIndex % recentLogs.length];

    const getTextColor = (type: string) => {
        switch (type) {
            case 'danger': return 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]';
            case 'warning': return 'text-orange-400';
            case 'success': return 'text-emerald-400';
            default: return 'text-slate-300';
        }
    };

    return (
        <div className="h-12 bg-slate-950/90 border-t border-slate-800 flex items-center px-4 relative overflow-hidden w-full z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom)]">
            <div className="mr-3 text-slate-500 shrink-0 flex items-center justify-center w-8 h-8 bg-slate-900 rounded-lg border border-slate-800">
                <Bell size={14} className={currentLog.type === 'danger' ? 'animate-pulse text-red-500' : ''} />
            </div>
            <div className="flex-1 relative h-full flex items-center overflow-hidden">
                <div key={currentLog.id + newsIndex} className="transition-all duration-500 ease-out flex items-center animate-fade-in-up">
                    <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${getTextColor(currentLog.type)}`}>
                        {currentLog.timestamp && <span className="opacity-50 mr-2">[{currentLog.timestamp}]</span>}
                        {currentLog.message}
                    </span>
                </div>
            </div>
            <div className="flex gap-1 ml-2">
                {recentLogs.map((_, idx) => (
                    <div key={idx} className={`w-1 h-1 rounded-full transition-colors ${idx === (newsIndex % recentLogs.length) ? 'bg-white' : 'bg-slate-800'}`}></div>
                ))}
            </div>
        </div>
    );
};

export const NewsTicker = React.memo(NewsTickerComponent);