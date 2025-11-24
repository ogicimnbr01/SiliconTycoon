import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '', headerAction }) => {
  return (
    <div className={`bg-corp-panel border border-corp-border p-0 overflow-hidden flex flex-col ${className}`}>
      {title && (
        <div className="bg-slate-900/50 px-4 py-3 border-b border-corp-border flex justify-between items-center">
          <h3 className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  );
};