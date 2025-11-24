import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled,
  ...props 
}) => {
  
  // Mobile UX: Min-height 48px for touch targets, active state for feedback
  const baseStyles = "relative font-mono font-bold transition-all duration-150 flex items-center justify-center gap-2 border uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-95 touch-manipulation rounded-md";
  
  const variants = {
    primary: "bg-corp-accent/10 border-corp-accent text-corp-accent hover:bg-corp-accent hover:text-white shadow-[0_0_15px_rgba(14,165,233,0.15)]",
    secondary: "bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white",
    danger: "bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    success: "bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    warning: "bg-orange-500/10 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white shadow-[0_0_10px_rgba(249,115,22,0.2)]",
  };

  const sizes = {
    sm: "text-xs px-3 min-h-[36px]", // Slightly smaller for tight spots
    md: "text-sm px-4 py-2 min-h-[48px]", // Standard touch target
    lg: "text-base px-6 py-3 min-h-[56px]", // Prominent actions
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};