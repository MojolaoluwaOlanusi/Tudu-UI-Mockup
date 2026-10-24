import { useMemo, useState } from 'react';
import { useApp } from '@/store/AppContext';
import {
  computePersonalAnalytics,
  computeCompletionBuckets,
  computeTimeByCategory,
  computePrioritySplit,
} from '@/lib/mockAnalytics';
import { BarChart, PieChart, LineChart } from '@/components/app/charts/Charts';

const RANGES = [
  { key: 'week', label: 'Last 7 days' },
  { key: 'month', label: 'Last 30 days' },
  { key: 'quarter', label: 'Last 12 weeks' },
];

function Metric({ label, value, hint, tone }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
      <p className={'mt-1 font-handwritten text-3xl leading-none ' + (tone === 'alert' ? 'text-red-400' : 'text-ink')}>
        {value}
      </p>
      {hint && <p className="mt-1 text-[11px] text-ink-faint">{hint}</p>}
    </div>
  );
}

export default function PersonalAnalytics() {
  const { tasks } = useApp();
  const [range, setRange] = useState('week');

  const { overview } = useMemo(() => computePersonalAnalytics(tasks), [tasks]);
  const buckets = useMemo(() => computeCompletionBuckets(tasks, range), [tasks, range]);
  const categoryData = useMemo(() => computeTimeByCategory(tasks), [tasks]);
  const priorityData = useMemo(() => computePrioritySplit(tasks), [tasks]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-lg border border-line bg-surface p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={
                'rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ' +
                (range === r.key ? 'bg-raised text-ink' : 'text-ink-muted hover:text-ink')
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric
          label="Total tasks"
          value={String(overview.tasks.total)}
          hint={overview.completionRate + '% complete'}
        />
        <Metric
          label="Completed"
          value={String(overview.tasks.done)}
          hint={
            buckets.reduce((s, b) => s + b.value, 0) + ' in this period'
          }
        />
        <Metric
          label="In progress"
          value={String(overview.tasks.doing)}
          hint={overview.tasks.todo + ' to do'}
        />
        <Metric
          label="Overdue"
          value={String(overview.tasks.overdue)}
          hint={overview.tasks.overdue > 0 ? 'Needs attention' : 'All on track'}
          tone={overview.tasks.overdue > 0 ? 'alert' : undefined}
        />
        <Metric
          label="Focus time"
          value={categoryData.reduce((s, c) => s + c.value, 0) + 'm'}
          hint="Total Pomodoro"
        />
      </div>

      <div className="card p-5">
        <h2 className="font-handwritten text-xl text-ink">Tasks completed</h2>
        <p className="mb-3 text-[11px] text-ink-faint">Bucketed by {range === 'quarter' ? 'week' : 'day'}</p>
        <BarChart data={buckets} height={140} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-handwritten text-xl text-ink">Time by category</h2>
          <p className="mb-3 text-[11px] text-ink-faint">Where your Pomodoro minutes went</p>
          {categoryData.length === 0 ? (
            <p className="py-10 text-center text-[12px] text-ink-faint">No sessions yet.</p>
          ) : (
            <PieChart data={categoryData} size={170} />
          )}
        </div>
        <div className="card p-5">
          <h2 className="font-handwritten text-xl text-ink">Tasks by priority</h2>
          <p className="mb-3 text-[11px] text-ink-faint">All time, not just this range</p>
          {priorityData.length === 0 ? (
            <p className="py-10 text-center text-[12px] text-ink-faint">No tasks yet.</p>
          ) : (
            <PieChart data={priorityData} size={170} />
          )}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-handwritten text-xl text-ink">Productivity trend</h2>
        <p className="mb-3 text-[11px] text-ink-faint">Completions across the range</p>
        <LineChart data={buckets} height={120} />
      </div>
    </div>
  );
}