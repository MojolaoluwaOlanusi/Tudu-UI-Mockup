import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { FILTER_TYPES } from '@/lib/mockTasks';

function Popover({ open, onClose, anchorClassName, children }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={
          'absolute z-50 mt-1 min-w-[180px] overflow-hidden rounded-md border border-line bg-surface shadow-lg ' +
          (anchorClassName || 'left-0')
        }
      >
        {children}
      </div>
    </>
  );
}

export default function FilterBar({ filters, onChange, onClear }) {
  const [addingFilter, setAddingFilter] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);

  const addFilter = (typeKey) => {
    const type = FILTER_TYPES.find((t) => t.key === typeKey);
    if (!type) return;
    onChange([...filters, { type: typeKey, value: type.options[0].value }]);
    setAddingFilter(false);
  };

  const setValue = (idx, value) => {
    const next = filters.map((f, i) => (i === idx ? { ...f, value } : f));
    onChange(next);
    setEditingIdx(null);
  };

  const removeFilter = (idx) => {
    onChange(filters.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-line-subtle px-3 py-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setAddingFilter((v) => !v)}
          className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-[12px] font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          <Plus className="h-3 w-3" />
          Filter
        </button>
        <Popover open={addingFilter} onClose={() => setAddingFilter(false)} anchorClassName="left-0">
          <div className="py-1">
            {FILTER_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => addFilter(t.key)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
              >
                {t.label}
              </button>
            ))}
          </div>
        </Popover>
      </div>

      {filters.map((f, idx) => {
        const type = FILTER_TYPES.find((t) => t.key === f.type);
        if (!type) return null;
        const option = type.options.find((o) => o.value === f.value);
        const label = option ? option.label : f.value;
        return (
          <div key={idx} className="relative">
            <div className="inline-flex items-center gap-0.5 rounded-md border border-brand/30 bg-brand-subtle pl-2 text-[12px] font-medium text-brand">
              <button
                type="button"
                onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                className="whitespace-nowrap py-1 text-left"
              >
                {type.label}: {label}
              </button>
              <button
                type="button"
                onClick={() => removeFilter(idx)}
                aria-label={'Remove ' + type.label + ' filter'}
                className="ml-0.5 rounded-sm p-1 transition-colors hover:bg-brand/20"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <Popover open={editingIdx === idx} onClose={() => setEditingIdx(null)} anchorClassName="left-0">
              <div className="py-1">
                {type.options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setValue(idx, o.value)}
                    className={
                      'flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] transition-colors hover:bg-subtle ' +
                      (o.value === f.value ? 'text-brand' : 'text-ink-muted')
                    }
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </Popover>
          </div>
        );
      })}

      {filters.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="text-[12px] font-medium text-ink-muted transition-colors hover:text-ink"
        >
          Clear all
        </button>
      )}
    </div>
  );
}