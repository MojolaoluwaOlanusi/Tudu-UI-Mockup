import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { groupTasks } from '@/lib/mockTasks';
import ListRow from '@/components/app/list/ListRow';
import GroupHeader from '@/components/app/list/GroupHeader';
import FilterBar from '@/components/app/list/FilterBar';
import Composer from '@/components/app/list/Composer';
import BulkBar from '@/components/app/list/BulkBar';
import UndoToast from '@/components/app/list/UndoToast';
import EmptyState from '@/components/app/list/EmptyState';

export default function AppHome() {
  const { tasks, openDetail, updateTask, deleteTask, createTask } = useApp();
  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState('status');
  const [filters, setFilters] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const composerRef = useRef(null);

  const allTasks = useMemo(() => tasks.filter((t) => !t.deleted), [tasks]);

  const filtered = useMemo(() => {
    let result = allTasks;
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (t) =>
          (t.title || '').toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
      );
    }
    for (const f of filters) {
      if (f.type === 'status') result = result.filter((t) => t.status === f.value);
      else if (f.type === 'priority') result = result.filter((t) => t.priority === f.value);
      else if (f.type === 'category') result = result.filter((t) => t.category === f.value);
      else if (f.type === 'assignee') {
        if (f.value === 'none') result = result.filter((t) => !t.assignee);
        else if (f.value === 'me') result = result.filter((t) => t.assignee && t.assignee.id === 'u-me');
        else result = result.filter((t) => t.assignee && t.assignee.id === f.value);
      }
    }
    return result;
  }, [allTasks, search, filters]);

  const groups = useMemo(() => groupTasks(filtered, groupBy), [filtered, groupBy]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  useEffect(() => {
    if (!selectMode) return;
    const onKey = (e) => {
      if (e.key === 'Escape') exitSelectMode();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedIds(new Set(filtered.map((t) => t.id)));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectMode, filtered, exitSelectMode]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.key === 'n') {
        e.preventDefault();
        composerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cycleStatus = (id) => {
    const task = allTasks.find((t) => t.id === id);
    if (!task) return;
    const next =
      task.status === 'todo' ? 'doing' : task.status === 'doing' ? 'done' : 'todo';
    updateTask(id, { status: next });
  };

  const bulkDelete = () => {
    if (selectedIds.size === 0) return;
    for (const id of selectedIds) deleteTask(id);
    exitSelectMode();
  };

  const bulkMarkDone = () => {
    if (selectedIds.size === 0) return;
    for (const id of selectedIds) updateTask(id, { status: 'done' });
    exitSelectMode();
  };

  const totalTasks = allTasks.length;
  const showingEmpty = totalTasks === 0;
  const showingFilteredEmpty = !showingEmpty && filtered.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line-subtle px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-ink">My tasks</h1>
            <p className="mt-0.5 text-[11px] text-ink-faint">
              {totalTasks} task{totalTasks === 1 ? '' : 's'} in this board
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              aria-label="Group tasks by"
              className="rounded-md border border-line bg-surface px-2 py-1.5 text-[12px] font-medium text-ink-muted focus:outline-none"
            >
              <option value="status">Group: Status</option>
              <option value="priority">Group: Priority</option>
              <option value="assignee">Group: Assignee</option>
              <option value="none">No grouping</option>
            </select>
            <button
              type="button"
              onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
              className={
                'rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ' +
                (selectMode
                  ? 'border-brand bg-brand-subtle text-brand'
                  : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink')
              }
            >
              {selectMode ? 'Cancel' : 'Select'}
            </button>
            <button
              type="button"
              onClick={() => composerRef.current?.focus()}
              className="inline-flex items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-[12px] font-semibold text-ink-inverse transition-colors hover:bg-brand-hover"
            >
              <Plus className="h-3.5 w-3.5" />
              New task
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            className="min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} onClear={() => setFilters([])} />

      <Composer ref={composerRef} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {showingEmpty ? (
          <EmptyState variant="empty" onNew={() => composerRef.current?.focus()} />
        ) : showingFilteredEmpty ? (
          <EmptyState
            variant="filtered"
            onClearFilters={() => {
              setFilters([]);
              setSearch('');
            }}
          />
        ) : (
          <>
            {groups.map((g) => {
              const collapsed = collapsedGroups.has(g.key);
              return (
                <div key={g.key}>
                  <button
                    type="button"
                    onClick={() => {
                      setCollapsedGroups((prev) => {
                        const next = new Set(prev);
                        if (next.has(g.key)) next.delete(g.key);
                        else next.add(g.key);
                        return next;
                      });
                    }}
                    className="flex h-9 w-full items-center gap-1.5 border-b border-line-subtle px-3 text-left transition-colors hover:bg-subtle/30"
                    aria-expanded={!collapsed}
                  >
                    <span
                      className={
                        'inline-flex h-3 w-3 shrink-0 items-center justify-center text-ink-faint transition-transform ' +
                        (collapsed ? '-rotate-90' : '')
                      }
                    >
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 4.5 L6 7.5 L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      {g.label}
                    </span>
                    <span className="text-[11px] font-medium text-ink-faint tabular-nums">
                      {g.tasks.length}
                    </span>
                  </button>
                  {!collapsed &&
                    g.tasks.map((task) => (
                      <ListRow
                        key={task.id}
                        task={task}
                        isSelectMode={selectMode}
                        selected={selectedIds.has(task.id)}
                        onToggleSelect={() => toggleSelect(task.id)}
                        onOpen={() => openDetail({ type: 'task', id: task.id })}
                        onCycleStatus={() => cycleStatus(task.id)}
                      />
                    ))}
                </div>
              );
            })}

            <div className="mt-12 border-t border-line-subtle px-4 py-8">
              <div id="recent-activity" className="scroll-mt-4 rounded-lg border border-line bg-surface p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Recent activity
                </p>
                <ul className="mt-3 space-y-2 text-xs text-ink-muted">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    Created "Design new dashboard" - 2h ago
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-doing" />
                    Moved "Review API spec" to Doing - 3h ago
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    Finished a 25 minute focus session - 4h ago
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      <BulkBar
        count={selectedIds.size}
        onClear={exitSelectMode}
        onMarkDone={bulkMarkDone}
        onDelete={bulkDelete}
      />
      <UndoToast />
    </div>
  );
}