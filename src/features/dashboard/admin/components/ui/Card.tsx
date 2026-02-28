import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`bg-white dark:bg-surface-dark shadow rounded-xl overflow-hidden border border-transparent ${className}`}
    >
      {children}
    </div>
  );
};
