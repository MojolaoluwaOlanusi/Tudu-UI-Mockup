import { Plus } from 'lucide-react';

export default function EmptyState({ variant = 'empty', onNew, onClearFilters }) {
  const isFiltered = variant === 'filtered';
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <svg width="56" height="56" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="21" stroke="var(--accent)" strokeWidth="2" opacity="0.35" />
        <path d="M15 24.5 L21 30 L33 18" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="mt-4 font-handwritten text-3xl text-ink">
        {isFiltered ? 'Nothing matches' : 'No tasks yet'}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-ink-muted">
        {isFiltered ? 'Try clearing a filter or two.' : 'Create your first task to get started.'}
      </p>
      <div className="mt-5">
        {isFiltered ? (
          <button type="button" onClick={onClearFilters} className="btn-ghost">
            Clear filters
          </button>
        ) : (
          <button type="button" onClick={onNew} className="btn-accent">
            <Plus className="h-4 w-4" />
            New task
          </button>
        )}
      </div>
    </div>
  );
}