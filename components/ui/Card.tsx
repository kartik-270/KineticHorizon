import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card = ({ children, className, glow = false }: CardProps) => {
  return (
    <div className={cn(
      "bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 transition-all duration-300",
      glow && "ambient-glow",
      className
    )}>
      {children}
    </div>
  );
};
