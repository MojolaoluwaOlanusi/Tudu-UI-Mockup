export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="font-brand text-6xl text-brand leading-none">tudu</div>
      <h1 className="text-3xl font-semibold text-ink">
        Mockup — Part 1 (Foundation)
      </h1>
      <p className="text-sm text-ink-muted max-w-md">
        Vite + React + Tailwind + Radix + Framer Motion installed.
        Next: Part 2 — Landing shell + sticky-glass navbar.
      </p>
      <div className="mt-4 text-xs text-ink-faint font-mono">
        stale data · no backend · mockup
      </div>
    </div>
  );
}
