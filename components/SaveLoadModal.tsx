import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Trash2, Plus, HardDrive } from 'lucide-react';
import { SaveMetadata, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SaveLoadModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'save' | 'load'; // Context: are we saving or loading?
    getSlots: () => SaveMetadata[];
    onSave: (slotId: string) => void;
    onLoad: (slotId: string) => void;
    onDelete: (slotId: string) => void;
    language: Language;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
    isOpen,
    onClose,
    mode,
    getSlots,
    onSave,
    onLoad,
    onDelete,
    language
}) => {
    const [slots, setSlots] = useState<SaveMetadata[]>([]);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSlots(getSlots());
        }
    }, [isOpen, getSlots]);

    if (!isOpen) return null;

    const t = TRANSLATIONS[language];

    const handleSave = (slotId: string) => {
        onSave(slotId);
        setSlots(getSlots()); // Refresh
    };

    const handleDelete = (slotId: string) => {
        onDelete(slotId);
        setSlots(getSlots()); // Refresh
        setConfirmDelete(null);
    };

    const handleCreateNew = () => {
        const newId = Date.now().toString();
        handleSave(newId);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <HardDrive className="text-indigo-400" size={20} />
                        <h2 className="text-lg font-bold text-white tracking-wide">
                            {mode === 'save' ? 'SAVE GAME' : 'LOAD GAME'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[60vh]">
                    {mode === 'save' && (
                        <button
                            onClick={handleCreateNew}
                            className="w-full p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all group flex items-center justify-center gap-3 text-slate-400 hover:text-indigo-400"
                        >
                            <Plus size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold">CREATE NEW SAVE</span>
                        </button>
                    )}

                    {slots.length === 0 && mode === 'load' && (
                        <div className="text-center py-8 text-slate-500">
                            No save files found.
                        </div>
                    )}

                    {slots.map((slot) => (
                        <div
                            key={slot.slotId}
                            className="relative p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-white text-lg">Day {slot.day}</div>
                                    <div className="text-xs text-slate-400 font-mono">
                                        {new Date(slot.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-emerald-400 font-mono font-bold">
                                    ${(slot.netWorth / 1000000).toFixed(1)}M
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                {mode === 'save' && (
                                    <button
                                        onClick={() => handleSave(slot.slotId)}
                                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Save size={14} /> OVERWRITE
                                    </button>
                                )}
                                {mode === 'load' && (
                                    <button
                                        onClick={() => { onLoad(slot.slotId); onClose(); }}
                                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Upload size={14} /> LOAD
                                    </button>
                                )}

                                {confirmDelete === slot.slotId ? (
                                    <button
                                        onClick={() => handleDelete(slot.slotId)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs transition-colors animate-in fade-in"
                                    >
                                        CONFIRM?
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(slot.slotId)}
                                        className="px-3 py-2 bg-slate-700 hover:bg-red-900/50 hover:text-red-400 text-slate-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
