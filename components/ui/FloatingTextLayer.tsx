import React from 'react';
import { FloatingText, FloatingTextItem } from './FloatingText';

interface FloatingTextLayerProps {
    items: FloatingTextItem[];
    onComplete: (id: string) => void;
}

export const FloatingTextLayer: React.FC<FloatingTextLayerProps> = ({ items, onComplete }) => {
    if (items.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {items.map(item => (
                <FloatingText key={item.id} item={item} onComplete={onComplete} />
            ))}
        </div>
    );
};
