import React from 'react';
import { X, Trophy, Lock, CheckCircle2, Cpu, DollarSign, TrendingUp, FlaskConical, Crown, Briefcase, Building2, Globe, Package, Factory, Monitor, Users, Microscope, UserPlus, Star, Calendar, Cake, Medal, Building, Megaphone, Radio, Eye, Bomb, LineChart } from 'lucide-react';
import { ACHIEVEMENTS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface AchievementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    unlockedAchievements: string[];
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

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, unlockedAchievements, language }) => {
    if (!isOpen) return null;

    const t = TRANSLATIONS[language];
    const unlockedSet = new Set(unlockedAchievements);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Trophy className="text-yellow-500" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">{t.achievements}</h2>
                            <p className="text-sm text-slate-400 font-mono">
                                {unlockedSet.size} / {ACHIEVEMENTS.length} {t.unlocked}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = unlockedSet.has(ach.id);
                        const Icon = iconMap[ach.icon] || Trophy;
                        const title = t[`${ach.id}_title` as keyof typeof t] || ach.title;
                        const description = t[`${ach.id}_desc` as keyof typeof t] || ach.description;

                        return (
                            <div
                                key={ach.id}
                                className={`relative p-4 rounded-xl border transition-all duration-300 ${isUnlocked
                                    ? 'bg-slate-800/50 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                    : 'bg-slate-900/50 border-slate-800 opacity-70 grayscale'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isUnlocked ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-500' : 'bg-slate-800 text-slate-600'
                                        }`}>
                                        {isUnlocked ? <Icon size={24} /> : <Lock size={24} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`font-bold truncate ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                                {title}
                                            </h3>
                                            {isUnlocked && <CheckCircle2 size={16} className="text-emerald-500" />}
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            {description}
                                        </p>
                                        {ach.reward && (
                                            <div className="mt-2 text-xs font-mono text-emerald-400/80 flex items-center gap-1">
                                                {t.reward}: +{ach.reward.value} {ach.reward.type.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors text-sm tracking-widest"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};
