export default function Wordmark({ size = 'md' }) {
  const sizes = {
    sm: { text: 'text-2xl', check: 'h-3 w-3', gap: 'gap-1' },
    md: { text: 'text-3xl', check: 'h-4 w-4', gap: 'gap-1.5' },
    lg: { text: 'text-5xl', check: 'h-6 w-6', gap: 'gap-2' },
  };
  const s = sizes[size] || sizes.md;
  return (
    <span className={`inline-flex items-baseline ${s.gap}`} aria-label="Tudu">
      <span className={`font-brand ${s.text} leading-none text-ink`}>tudu</span>
      <svg
        className={`${s.check} shrink-0 translate-y-[2px]`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="11" fill="var(--accent)" />
        <path
          d="M6.5 12.5l3.5 3.5 7-7"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
