import { cn } from '@/lib/utils';

export default function BrushButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'relative inline-flex items-center justify-center font-semibold transition-colors duration-200';
  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2 rounded-md',
  };
  const variants = {
    primary: 'bg-brand text-ink-inverse hover:bg-brand-hover shadow-sm',
    ghost: 'text-ink-muted hover:text-ink hover:bg-subtle',
  };
  return (
    <button
      className={cn(
        base,
        sizes[size],
        variants[variant],
        variant === 'primary' && 'brush-stroke',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
