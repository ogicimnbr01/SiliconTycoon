import React, { useEffect, useState } from 'react';

export interface FloatingTextItem {
    id: string;
    text: string;
    type: 'income' | 'expense' | 'rp' | 'reputation' | 'neutral';
    x: number;
    y: number;
}

interface FloatingTextProps {
    item: FloatingTextItem;
    onComplete: (id: string) => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ item, onComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onComplete(item.id), 500); // Wait for fade out
        }, 3000);
        return () => clearTimeout(timer);
    }, [item.id, onComplete]);

    const getColorClass = () => {
        switch (item.type) {
            case 'income': return 'text-emerald-400';
            case 'expense': return 'text-red-400';
            case 'rp': return 'text-violet-400';
            case 'reputation': return 'text-blue-400';
            default: return 'text-white';
        }
    };

    const getAnimationClass = () => {
        return item.type === 'expense' ? 'animate-float-down' : 'animate-float-up';
    };

    return (
        <div
            className={`fixed pointer-events-none z-[100] font-bold text-xl drop-shadow-md transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} ${getColorClass()} ${getAnimationClass()}`}
            style={{
                left: item.x + (Math.random() * 20 - 10),
                top: item.y + (Math.random() * 20 - 10)
            }}
        >
            {item.text}
        </div>
    );
};
