import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: "solid" | "outline" | "glow";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = "#00f0ff",
  variant = "glow",
  size = "md",
  className = "",
}) => {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border transition-all ${sizeClasses} ${className}`}
      style={{
        borderColor: `${color}80`,
        backgroundColor: variant === "solid" ? color : `${color}15`,
        color: variant === "solid" ? "#000000" : color,
        boxShadow: variant === "glow" ? `0 0 10px ${color}40` : "none",
      }}
    >
      {children}
    </span>
  );
};
