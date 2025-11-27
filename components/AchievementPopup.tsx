import React, { useEffect, useState } from 'react';
import { Trophy, Cpu, DollarSign, TrendingUp, FlaskConical, Crown, Briefcase, Building2, Globe, Package, Factory, Monitor, Users, Microscope, UserPlus, Star, Calendar, Cake, Medal, Building, Megaphone, Radio, Eye, Bomb, LineChart } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface AchievementPopupProps {
    achievement: {
        id: string;
        title: string;
        description: string;
        icon: string;
        reward?: { type: string, value: number };
    } | null;
    onClose: () => void;
    language: Language;
}

const iconMap: Record<string, any> = {
    Cpu,
    DollarSign,
    TrendingUp,
    FlaskConical,
    Crown,
    Briefcase,
    Building2,
    Globe,
    Package,
    Factory,
    Monitor,
    Users,
    Microscope,
    UserPlus,
    Star,
    Calendar,
    Cake,
    Medal,
    Building,
    Megaphone,
    Radio,
    Eye,
    Bomb,
    LineChart
};

export const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onClose, language }) => {
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const t = TRANSLATIONS[language];

    useEffect(() => {
        if (achievement) {
            setVisible(true);
            setShowDetails(false);

            // Staged animation: Text first, then details
            const detailsTimer = setTimeout(() => {
                setShowDetails(true);
            }, 600);

            const closeTimer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300);
            }, 3000); // Increased duration slightly

            return () => {
                clearTimeout(detailsTimer);
                clearTimeout(closeTimer);
            };
        }
    }, [achievement, onClose]);

    if (!achievement && !visible) return null;

    const Icon = (achievement && iconMap[achievement.icon]) || Trophy;
    const titleKey = `${achievement?.id}_title` as keyof typeof t;
    const title = achievement ? (t[titleKey] || achievement.title) : '';

    const handleDismiss = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            onClick={handleDismiss}
            className={`fixed top-8 left-0 right-0 z-[200] flex justify-center pointer-events-none transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}
        >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/50 rounded-full pl-2 pr-8 py-2 shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center gap-4 min-w-[320px] pointer-events-auto relative overflow-hidden group cursor-pointer active:scale-95 transition-transform">

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-amber-300 transition-all duration-500 transform ${showDetails ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <Icon className="text-white drop-shadow-md" size={24} />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-0.5 animate-pulse">
                        {t.achievementUnlocked}
                    </div>
                    <div className={`text-white font-bold text-lg leading-none truncate drop-shadow-sm transition-all duration-500 ${showDetails ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                        {title}
                    </div>
                    {achievement?.reward && showDetails && (
                        <div className="text-emerald-400 text-[10px] font-mono font-bold mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1 duration-500">
                            <span>REWARD:</span>
                            <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
                                +{achievement.reward.value} {achievement.reward.type === 'rp' ? t.rndAcronym : t.repAcronym}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
