import { X } from 'lucide-react';

export default function BulkBar({ count, onClear, onMarkDone, onDelete }) {
  if (count === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-4">
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-1.5 shadow-lg">
        <span className="px-1 text-[12px] font-semibold text-ink">
          {count} selected
        </span>
        <button
          type="button"
          onClick={onMarkDone}
          className="rounded-md px-2.5 py-1 text-[12px] font-medium text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
        >
          Mark done
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md px-2.5 py-1 text-[12px] font-medium text-red-400 transition-colors hover:bg-red-500/10"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="rounded-md p-1 text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}