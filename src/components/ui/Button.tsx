import React, { type ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children: ReactNode;
  className?: string;
}

export const Button = ({ variant = "primary", children, className = "", ...props }: ButtonProps) => {
  const baseClasses = "flex cursor-pointer items-center justify-center overflow-hidden rounded-lg font-bold transition-all";

  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700",
    secondary: "bg-[#e7ecf3] dark:bg-slate-800 text-[#0d131b] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700",
    outline: "bg-white dark:bg-slate-800 border border-[#cfd9e7] dark:border-slate-700 text-[#0d131b] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700",
    ghost: "text-primary hover:underline gap-2"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};