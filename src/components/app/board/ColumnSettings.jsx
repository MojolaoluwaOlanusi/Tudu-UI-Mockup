import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { COLUMN_COLORS } from '@/lib/mockTasks';

const STAGES = [
  { value: 'todo', label: 'To-do' },
  { value: 'doing', label: 'Doing' },
  { value: 'done', label: 'Done' },
];

export default function ColumnSettings({ column, onClose }) {
  const { updateColumn, deleteColumn, columns, tasks } = useApp();
  const [name, setName] = useState(column.name);
  const [stage, setStage] = useState(column.stage);
  const [color, setColor] = useState(column.color);
  const [wip, setWip] = useState(column.wip_limit != null ? String(column.wip_limit) : '');

  const cardCount = tasks.filter((t) => t.column_id === column.id && !t.deleted).length;

  const saveName = () => {
    if (name.trim()) updateColumn(column.id, { name: name.trim() });
    else setName(column.name);
  };
  const saveStage = (v) => {
    setStage(v);
    updateColumn(column.id, { stage: v });
  };
  const saveColor = (c) => {
    setColor(c);
    updateColumn(column.id, { color: c });
  };
  const saveWip = () => {
    if (wip === '') {
      updateColumn(column.id, { wip_limit: null });
      return;
    }
    const n = Number(wip);
    if (!Number.isInteger(n) || n < 1) {
      setWip(column.wip_limit != null ? String(column.wip_limit) : '');
      return;
    }
    updateColumn(column.id, { wip_limit: n });
  };

  const handleDelete = () => {
    if (!window.confirm('Delete "' + column.name + '"? Cards will move to another column.')) return;
    const ok = deleteColumn(column.id);
    if (ok) onClose();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-line-subtle px-4">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          Column settings
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h2 className="min-w-0 truncate text-base font-semibold text-ink">{column.name}</h2>
          <span className="shrink-0 text-[11px] text-ink-faint tabular-nums">
            {cardCount} card{cardCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="col-name">Name</label>
            <input
              id="col-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => { if (e.key === 'Enter') { saveName(); e.currentTarget.blur(); } }}
              maxLength={100}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="col-stage">Stage</label>
            <select
              id="col-stage"
              value={stage}
              onChange={(e) => saveStage(e.target.value)}
              className="input"
            >
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-ink-faint">
              Cards inherit their status from the column&apos;s stage.
            </p>
          </div>

          <div>
            <label className="label">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLUMN_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => saveColor(c.hex)}
                  aria-label={c.name}
                  title={c.name}
                  className={
                    'h-7 w-7 rounded-full border-2 transition-all ' +
                    (color === c.hex
                      ? 'border-ink scale-110'
                      : 'border-transparent hover:scale-105')
                  }
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="col-wip">WIP limit</label>
            <input
              id="col-wip"
              type="number"
              min={1}
              value={wip}
              onChange={(e) => setWip(e.target.value)}
              onBlur={saveWip}
              onKeyDown={(e) => { if (e.key === 'Enter') { saveWip(); e.currentTarget.blur(); } }}
              placeholder="No limit"
              className="input"
            />
            <p className="mt-1 text-[11px] text-ink-faint">Leave blank for no limit.</p>
          </div>

          <div className="border-t border-line-subtle pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={columns.length <= 1}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete column
            </button>
            {columns.length <= 1 && (
              <p className="mt-1 text-[11px] text-ink-faint">
                A board needs at least one column.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}