import React, { useEffect, useState } from 'react';
import { Trophy, Cpu, DollarSign, TrendingUp, FlaskConical, Crown, Briefcase, Building2, Globe, Package, Factory, Monitor, Users, Microscope, UserPlus, Star, Calendar, Cake, Medal, Building, Megaphone, Radio, Eye, Bomb, LineChart } from 'lucide-react';

interface AchievementPopupProps {
    achievement: {
        id: string;
        title: string;
        description: string;
        icon: string;
        reward?: { type: string, value: number };
    } | null;
    onClose: () => void;
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

export const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300); // Wait for exit animation
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [achievement, onClose]);

    if (!achievement && !visible) return null;

    const Icon = (achievement && iconMap[achievement.icon]) || Trophy;

    return (
        <div className={`fixed top-0 left-0 right-0 z-[200] flex justify-center pointer-events-none transition-all duration-300 ${visible ? 'translate-y-4 opacity-100' : '-translate-y-full opacity-0'}`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(234,179,8,0.2)] flex items-center gap-4 max-w-md w-full mx-4 pointer-events-auto">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0 animate-bounce">
                    <Icon className="text-yellow-500" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-yellow-500 font-bold text-xs tracking-widest uppercase mb-0.5">Achievement Unlocked!</h4>
                    <h3 className="text-white font-bold text-lg truncate">{achievement?.title}</h3>
                    {achievement?.reward && (
                        <p className="text-emerald-400 text-xs font-mono mt-1">
                            REWARD: +{achievement.reward.value} {achievement.reward.type.toUpperCase()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
