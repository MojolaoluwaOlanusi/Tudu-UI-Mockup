import Navbar from '@/components/landing/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="pt-14">
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
            Part 2 · Landing shell + navbar
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-ink">
            Navbar is live. Landing sections land in Parts 3–7.
          </h1>
          <p className="mt-3 max-w-md mx-auto text-sm text-ink-muted">
            Hover each link above to see the mega menus. Resize below 1024px to see the mobile menu.
          </p>
          <ul className="mt-10 grid gap-3 max-w-xl mx-auto text-left">
            {[
              'Part 3 — Hero + LiveBoardHero',
              'Part 4 — Logo strip + Problem',
              'Part 5 — Bento grid',
              'Part 6 — How it works + Under the hood',
              'Part 7 — Tier gating, Pricing, Changelog, Social proof, Final CTA, Footer',
            ].map((s) => (
              <li
                key={s}
                className="rounded-md border border-line bg-surface px-4 py-3 text-xs text-ink-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
        <section className="min-h-[120vh] border-t border-line-subtle flex items-center justify-center">
          <p className="text-xs text-ink-faint">
            Scroll up to test the sticky-glass navbar.
          </p>
        </section>
      </main>
    </div>
  );
}
