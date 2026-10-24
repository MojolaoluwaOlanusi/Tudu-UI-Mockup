import { useMemo } from 'react';
import { Timer as TimerIcon, Flame, Calendar, Award, Lock } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { computeStats, computeTimeTracking, MOCK_TIME_ENTRIES } from '@/lib/mockAnalytics';
import { BarChart } from '@/components/app/charts/Charts';

function humanise(minutes) {
  if (minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return m + 'm';
  return m === 0 ? h + 'h' : h + 'h ' + m + 'm';
}

function humaniseSeconds(seconds) {
  if (seconds <= 0) return '0h';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
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

function useMockTier() {
  try { return localStorage.getItem('tudu-mock-tier') || 'free'; } catch { return 'free'; }
}

function TimeTrackingCard({ tasks }) {
  const data = useMemo(() => computeTimeTracking(MOCK_TIME_ENTRIES, tasks), [tasks]);
  const dailyChart = data.daily.map((d) => ({ label: d.label, value: Math.round((d.seconds / 3600) * 10) / 10 }));
  const billablePct = data.total === 0 ? 0 : Math.round((data.billable / data.total) * 100);
  const avgSeconds = data.daily.length === 0 ? 0 : Math.round(data.total / data.daily.length);

  return (
    <div className="mt-4 space-y-4">
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-handwritten text-xl text-ink">Time tracking</h2>
            <p className="text-[11px] text-ink-faint">From manual entries and running timers</p>
          </div>
          <span className="rounded-sm bg-brand-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
            Pro
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line-subtle bg-canvas p-3">
            <p className="text-[10px] uppercase tracking-wider text-ink-faint">Total (7d)</p>
            <p className="mt-1 font-handwritten text-2xl leading-none text-ink">{humaniseSeconds(data.total)}</p>
            <p className="mt-1 text-[10px] text-ink-faint">{MOCK_TIME_ENTRIES.length} entries</p>
          </div>
          <div className="rounded-lg border border-line-subtle bg-canvas p-3">
            <p className="text-[10px] uppercase tracking-wider text-ink-faint">Billable</p>
            <p className="mt-1 font-handwritten text-2xl leading-none text-brand">{humaniseSeconds(data.billable)}</p>
            <p className="mt-1 text-[10px] text-ink-faint">{billablePct}% of total</p>
          </div>
          <div className="rounded-lg border border-line-subtle bg-canvas p-3">
            <p className="text-[10px] uppercase tracking-wider text-ink-faint">Daily average</p>
            <p className="mt-1 font-handwritten text-2xl leading-none text-ink">{humaniseSeconds(avgSeconds)}</p>
            <p className="mt-1 text-[10px] text-ink-faint">Across 7 days</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Hours per day</p>
          <BarChart data={dailyChart} height={100} />
        </div>

        {data.byTask.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Top tasks</p>
            <ul className="space-y-1.5">
              {data.byTask.map((t) => (
                <li key={t.taskId || 'none'} className="flex items-center gap-2 text-[12px]">
                  <span className="min-w-0 flex-1 truncate text-ink">{t.title}</span>
                  <span className="shrink-0 tabular-nums text-ink-muted">{humaniseSeconds(t.seconds)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function UpgradeTimeTracking() {
  return (
    <div className="mt-4 card border-accent/30 bg-brand-subtle/10 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand">
          <Lock className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Time tracking is a Pro feature</p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
            Log billable hours, see a weekly report, and export to CSV. Upgrade to unlock.
          </p>
          <a
            href="#/pricing"
            className="mt-3 inline-flex items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-[12px] font-semibold text-ink-inverse transition-colors hover:bg-brand-hover"
          >
            See plans
          </a>
        </div>
      </div>
    </div>
  );
}

export default function StatsView() {
  const { tasks } = useApp();
  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const tier = useMockTier();
  const dailyChartData = stats.daily.map((d) => ({ label: d.label, value: d.minutes }));

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="font-handwritten text-3xl leading-none text-ink sm:text-4xl">Focus stats</h1>
        <p className="mt-2 text-[12px] text-ink-faint">Pomodoro history and per-task time.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Flame} label="Today" value={humanise(stats.today.minutes)} hint={stats.today.sessions + ' session' + (stats.today.sessions === 1 ? '' : 's')} />
        <MetricCard icon={Calendar} label="This week" value={humanise(stats.week.minutes)} hint={stats.week.sessions + ' session' + (stats.week.sessions === 1 ? '' : 's')} />
        <MetricCard icon={Award} label="All time" value={humanise(stats.totals.minutes)} hint={stats.totals.sessions + ' completed'} />
        <MetricCard icon={TimerIcon} label="Started" value={String(stats.totals.started)} hint={stats.totals.abandoned + ' abandoned'} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-handwritten text-xl text-ink">Last 7 days</h2>
          <p className="mb-3 text-[11px] text-ink-faint">Minutes of focus per day</p>
          <BarChart data={dailyChartData} height={140} />
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
                  <span className="shrink-0 tabular-nums text-ink-muted">{humanise(t.minutes)} - {t.sessions} session{t.sessions === 1 ? '' : 's'}</span>
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
              <span className="shrink-0 tabular-nums text-ink-muted">{s.duration}m</span>
              <span className="shrink-0 text-ink-faint">
                {new Date(s.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {tier === 'pro' ? <TimeTrackingCard tasks={tasks} /> : <UpgradeTimeTracking />}
    </div>
  );
}