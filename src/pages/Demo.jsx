import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Wordmark from '@/components/brand/Wordmark';
import LiveBoardHero from '@/components/landing/LiveBoardHero';

export default function Demo() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line-subtle bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
          <Link to="/" className="flex items-center gap-2 text-ink-muted transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-[13px] font-medium">Back</span>
          </Link>
          <span className="text-ink-faint">|</span>
          <Link to="/"><Wordmark size="sm" /></Link>
          <span className="hidden text-[11px] font-medium uppercase tracking-wider text-ink-faint sm:inline">
            Interactive demo
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-md bg-brand px-3 py-1.5 text-[13px] font-semibold text-ink-inverse transition-colors hover:bg-brand-hover"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Demo
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">
            Try Tudu — no account needed
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Drag a card between columns. Click a card to cycle its status. Type
            a task in the composer to add your own. This is a real board, not a
            video — everything works.
          </p>
        </div>

        <LiveBoardHero autoPlay={false} />

        <div className="mx-auto mt-10 max-w-md rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm font-medium text-ink">Like what you see?</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Your demo work isn&apos;t saved. Start a free account to keep it —
            takes 30 seconds, no card required.
          </p>
          <Link
            to="/signup"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink-inverse transition-colors hover:bg-brand-hover"
          >
            Start free
            <span className="text-ink-inverse/80">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
