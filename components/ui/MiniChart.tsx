import React from 'react';
import { FinancialSnapshot } from '../../types';

interface MiniChartProps {
  data: FinancialSnapshot[];
  height?: number;
  color?: string;
}

export const MiniChart: React.FC<MiniChartProps> = ({ 
  data, 
  height = 120, 
  color = "#10b981" // Emerald 500
}) => {
  if (data.length < 2) return (
    <div className="flex items-center justify-center text-xs text-slate-600 bg-slate-900/30 rounded border border-slate-800 border-dashed" style={{ height }}>
      Awaiting Data...
    </div>
  );

  // Normalize data
  const values = data.map(d => d.money);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // Avoid divide by zero

  // Create SVG points
  // X axis: 0 to 100%
  // Y axis: 0 (bottom) to height (top) -> Note SVG Y is inverted (0 is top)
  const points = values.map((val, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = height - ((val - min) / range) * height * 0.8 - (height * 0.1); // Add padding
    return `${x},${y}`;
  }).join(' ');

  const uniqueId = `grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full rounded bg-slate-900/50 border border-slate-800 relative overflow-hidden" style={{ height }}>
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-10">
         <div className="border-t border-slate-500 w-full"></div>
         <div className="border-t border-slate-500 w-full"></div>
         <div className="border-t border-slate-500 w-full"></div>
      </div>

      <svg width="100%" height="100%" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="relative z-10">
        <defs>
          <linearGradient id={uniqueId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* Area Fill */}
        <path
           d={`M0,${height} ${values.map((val, i) => {
             const x = (i / (values.length - 1)) * 100;
             const y = height - ((val - min) / range) * height * 0.8 - (height * 0.1);
             return `L${x},${y}`;
           }).join(' ')} L100,${height} Z`}
           fill={`url(#${uniqueId})`}
           stroke="none"
        />

        {/* Line Stroke */}
        <polyline 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          points={points} 
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Labels */}
      <div className="absolute top-1 right-2 text-[10px] font-mono text-emerald-400 font-bold bg-slate-900/80 px-1.5 rounded shadow-sm border border-slate-800">
         MAX: ${max >= 1000 ? (max/1000).toFixed(1) + 'k' : max.toFixed(0)}
      </div>
      <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-500 bg-slate-900/80 px-1.5 rounded border border-slate-800">
         MIN: ${min >= 1000 ? (min/1000).toFixed(1) + 'k' : min.toFixed(0)}
      </div>
    </div>
  );
};