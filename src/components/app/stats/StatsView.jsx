import { useMemo } from 'react';
import { Timer as TimerIcon, Flame, Calendar, Award } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { computeStats } from '@/lib/mockAnalytics';
import { BarChart } from '@/components/app/charts/Charts';

function humanise(minutes) {
  if (minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return m + 'm';
  return m === 0 ? h + 'h' : h + 'h ' + m + 'm';
}

function MetricCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-subtle text-brand">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
      </div>
      <p className="mt-2 font-handwritten text-3xl leading-none text-ink">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-ink-faint">{hint}</p>}
    </div>
  );
}

export default function StatsView() {
  const { tasks } = useApp();
  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const dailyChartData = stats.daily.map((d) => ({ label: d.label, value: d.minutes }));

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="font-handwritten text-3xl leading-none text-ink sm:text-4xl">Focus stats</h1>
        <p className="mt-2 text-[12px] text-ink-faint">
          Your Pomodoro history and per-task time.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Flame}
          label="Today"
          value={humanise(stats.today.minutes)}
          hint={stats.today.sessions + ' session' + (stats.today.sessions === 1 ? '' : 's')}
        />
        <MetricCard
          icon={Calendar}
          label="This week"
          value={humanise(stats.week.minutes)}
          hint={stats.week.sessions + ' session' + (stats.week.sessions === 1 ? '' : 's')}
        />
        <MetricCard
          icon={Award}
          label="All time"
          value={humanise(stats.totals.minutes)}
          hint={stats.totals.sessions + ' completed'}
        />
        <MetricCard
          icon={TimerIcon}
          label="Started"
          value={String(stats.totals.started)}
          hint={stats.totals.abandoned + ' abandoned'}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-handwritten text-xl text-ink">Last 7 days</h2>
          <p className="mb-3 text-[11px] text-ink-faint">Minutes of focus per day</p>
          <BarChart data={dailyChartData} height={160} />
        </div>

        <div className="card p-5">
          <h2 className="font-handwritten text-xl text-ink">Where the time went</h2>
          <p className="mb-3 text-[11px] text-ink-faint">Per task, all-time</p>
          {stats.byTask.length === 0 ? (
            <p className="py-8 text-center text-[12px] text-ink-faint">No sessions yet.</p>
          ) : (
            <ul className="space-y-2">
              {stats.byTask.map((t) => (
                <li key={t.taskId || 'none'} className="flex items-center gap-2 text-[12px]">
                  <span className="min-w-0 flex-1 truncate text-ink">{t.title}</span>
                  <span className="shrink-0 tabular-nums text-ink-muted">
                    {humanise(t.minutes)} - {t.sessions} session{t.sessions === 1 ? '' : 's'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 card p-5">
        <h2 className="font-handwritten text-xl text-ink">Recent sessions</h2>
        <ul className="mt-3 space-y-2">
          {stats.recent.map((s) => (
            <li key={s.id} className="flex items-center gap-3 text-[12px]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-brand">
                <TimerIcon className="h-3 w-3" />
              </span>
              <span className="min-w-0 flex-1 truncate text-ink">{s.taskTitle}</span>
              <span className="shrink-0 text-ink-muted tabular-nums">{s.duration}m</span>
              <span className="shrink-0 text-ink-faint">
                {new Date(s.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}