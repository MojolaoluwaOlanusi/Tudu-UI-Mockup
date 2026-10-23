import { Link } from 'react-router-dom';

export default function Stub({ title, part, note }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
          Route stub
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {note || `This page lands in Part ${part}.`}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subtle"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
