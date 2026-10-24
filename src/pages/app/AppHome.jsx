import { useApp } from '@/store/AppContext';

export default function AppHome() {
  const { openDetail, startPomodoro, startTimer, cycleSyncStatus } = useApp();

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
          Part 8
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">App chrome</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          The topbar, sync dot, Pomodoro pill, timer pill, theme toggle,
          settings, tour, profile, and logout are all wired and working. Task
          content lands in later parts.
        </p>
      </div>

      <div className="mt-6 max-w-3xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
          Try it
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openDetail({ type: 'task', title: 'Design dashboard' })}
            className="rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong"
          >
            <p className="text-sm font-medium text-ink">Open task detail</p>
            <p className="mt-1 text-xs text-ink-muted">
              Slides the detail panel in from the right
            </p>
          </button>
          <button
            type="button"
            onClick={() => startPomodoro('Design dashboard')}
            className="rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong"
          >
            <p className="text-sm font-medium text-ink">Start Pomodoro</p>
            <p className="mt-1 text-xs text-ink-muted">
              Timer pill appears in the topbar
            </p>
          </button>
          <button
            type="button"
            onClick={() => startTimer('Design dashboard')}
            className="rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong"
          >
            <p className="text-sm font-medium text-ink">Start time tracking</p>
            <p className="mt-1 text-xs text-ink-muted">
              Second pill joins the Pomodoro pill
            </p>
          </button>
          <button
            type="button"
            onClick={cycleSyncStatus}
            className="rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong"
          >
            <p className="text-sm font-medium text-ink">Cycle sync status</p>
            <p className="mt-1 text-xs text-ink-muted">
              Green, white, red, green
            </p>
          </button>
        </div>
      </div>

      <div className="mt-8 max-w-2xl rounded-lg border border-dashed border-line bg-surface/50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
          Coming up
        </p>
        <ul className="mt-2 space-y-1 text-xs text-ink-muted">
          <li>Part 9 - Collapsible sidebar (board selector, shared lists, recent activity)</li>
          <li>Part 10 - List view (task rows, grouping, filters, bulk bar)</li>
          <li>Part 11 - Board view (columns, cards, drag and drop)</li>
          <li>Part 12 - Stats and Analytics</li>
          <li>Part 13 - Settings pages</li>
        </ul>
      </div>
    </div>
  );
}