import { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import TaskCard from '@/components/app/list/TaskCard';
import TaskForm from '@/components/app/list/TaskForm';
import FilterPanel from '@/components/app/list/FilterPanel';
import EmptyState from '@/components/app/list/EmptyState';
import UndoToast from '@/components/app/list/UndoToast';

export default function AppHome() {
  const { tasks, openDetail, deleteTask, isComposerOpen, openComposer, closeComposer } = useApp();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({});

  const filtered = useMemo(() => {
    let result = tasks.filter((t) => !t.deleted);
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (t) => (t.title || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
      );
    }
    if (filters.status) result = result.filter((t) => t.status === filters.status);
    if (filters.category) result = result.filter((t) => t.category === filters.category);
    if (filters.priority) result = result.filter((t) => t.priority === filters.priority);
    return result;
  }, [tasks, search, filters]);

  const totalTasks = tasks.filter((t) => !t.deleted).length;
  const showingEmpty = totalTasks === 0;
  const showingFilteredEmpty = !showingEmpty && filtered.length === 0;

  return (
    <div>
      <div className="p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-handwritten text-3xl leading-none text-ink sm:text-4xl">My tasks</h1>
            <p className="mt-2 text-[12px] text-ink-faint">{totalTasks} task{totalTasks === 1 ? '' : 's'} on this board</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setShowFilters((v) => !v)} className={'btn-ghost !py-1.5 !text-[13px] ' + (showFilters ? 'border-brand/40 text-brand' : '')} aria-pressed={showFilters}>
              <Filter className="h-3.5 w-3.5" />
              {showFilters ? 'Hide filters' : 'Filters'}
            </button>
            <button type="button" onClick={() => (isComposerOpen ? closeComposer() : openComposer())} className="btn-accent brush-stroke !py-1.5 !text-[13px]">
              {isComposerOpen ? 'Cancel' : '+ New task'}
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks" className="min-w-0 flex-1 bg-transparent text-[13px] text-ink placeholder:text-ink-faint focus:outline-none" />
        </div>
      </div>

      <div className="px-4 pb-6 md:px-6">
        {showFilters && <div className="mb-4"><FilterPanel filters={filters} onChange={setFilters} onClear={() => setFilters({})} /></div>}
        {isComposerOpen && <div className="mb-4"><TaskForm onClose={closeComposer} /></div>}
        {showingEmpty ? (
          <EmptyState variant="empty" onNew={openComposer} />
        ) : showingFilteredEmpty ? (
          <EmptyState variant="filtered" onClearFilters={() => { setFilters({}); setSearch(''); }} />
        ) : (
          <div className="space-y-3">
            {filtered.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={() => openDetail({ type: 'task', id: task.id })} onDelete={() => deleteTask(task.id)} />
            ))}
          </div>
        )}
        <div className="mt-12 border-t border-line-subtle pt-8">
          <div id="recent-activity" className="card p-5">
            <p className="font-handwritten text-xl text-ink">Recent activity</p>
            <ul className="mt-3 space-y-2 text-[12px] text-ink-muted">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" />Created "Design new dashboard" - 2h ago</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-doing" />Moved "Review API spec" to Doing - 3h ago</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" />Finished a 25 minute focus session - 4h ago</li>
            </ul>
          </div>
        </div>
      </div>
      <UndoToast />
    </div>
  );
}