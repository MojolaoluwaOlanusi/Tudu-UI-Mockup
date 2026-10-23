import { useEffect, useState } from 'react';

export default function LiveDot() {
  const [count, setCount] = useState(12);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        const next = c + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(6, Math.min(28, next));
      });
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-ink-muted whitespace-nowrap">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
      </span>
      <span>
        <span className="font-semibold text-ink">{count}</span> people building right now
      </span>
    </div>
  );
}
