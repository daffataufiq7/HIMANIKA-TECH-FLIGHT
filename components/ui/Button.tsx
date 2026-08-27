import React from "react";
import { audio } from "@/lib/audio";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  onClick,
  className = "",
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audio.playButtonClick();
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-semibold rounded-lg",
    md: "px-5 py-2.5 text-sm font-bold rounded-xl",
    lg: "px-7 py-3.5 text-base font-extrabold rounded-2xl",
    xl: "px-9 py-4 text-lg font-black tracking-wider rounded-2xl",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-500/25 border border-cyan-300/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150",
    secondary:
      "bg-surface-light hover:bg-slate-700 text-slate-100 border border-slate-600/60 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150",
    accent:
      "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black shadow-lg shadow-amber-500/30 border border-amber-300/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150",
    outline:
      "bg-transparent hover:bg-cyan-500/10 text-cyan-400 border-2 border-cyan-500/60 hover:border-cyan-400 shadow-sm transition-all duration-150",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 transition-all duration-150",
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider select-none outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
