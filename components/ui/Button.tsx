import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: "bg-kinetic-gradient text-on-primary-container hover:shadow-[0_0_20px_rgba(90,250,169,0.3)]",
    secondary: "bg-surface-container-high hover:bg-surface-bright text-white border border-outline-variant/20",
    outline: "border border-primary text-primary hover:bg-primary/10",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={cn(
        "rounded-md font-bold tracking-tight active:scale-95 duration-200 transition-all flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
