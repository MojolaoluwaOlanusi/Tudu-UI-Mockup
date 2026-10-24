import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Timer as TimerIcon,
  Clock,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { getTheme, applyTheme } from '@/lib/theme';
import Wordmark from '@/components/brand/Wordmark';
import SyncDot from './SyncDot';

const NAV = [
  { to: '/app', label: 'List', end: true },
  { to: '/app/board', label: 'Board' },
  { to: '/app/stats', label: 'Stats' },
  { to: '/app/analytics', label: 'Analytics' },
];

function NavTabs() {
  return (
    <div className="flex items-center gap-0.5">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            'whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ' +
            (isActive
              ? 'bg-brand-subtle text-brand'
              : 'text-ink-muted hover:bg-raised hover:text-ink')
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme());
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  const Icon = theme === 'dark' ? Sun : Moon;
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function IconButton({ icon: Icon, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function PomodoroPill() {
  const { pomodoro, pomodoroRemaining, stopPomodoro } = useApp();
  if (!pomodoro) return null;
  const m = Math.floor(pomodoroRemaining / 60);
  const s = pomodoroRemaining % 60;
  const label = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  return (
    <div
      className="flex shrink-0 items-center gap-1.5 rounded-md border border-line bg-raised px-2 py-1"
      title={pomodoro.taskTitle ? 'Pomodoro: ' + pomodoro.taskTitle : 'Pomodoro'}
    >
      <TimerIcon className="h-3 w-3 shrink-0 text-brand" />
      <span className="font-mono text-[11px] font-semibold text-ink tabular-nums">{label}</span>
      <button
        type="button"
        onClick={stopPomodoro}
        className="text-[10px] font-medium text-ink-muted transition-colors hover:text-red-400"
      >
        Stop
      </button>
    </div>
  );
}

function TimerPill() {
  const { timer, timerElapsed, stopTimer } = useApp();
  if (!timer) return null;
  const m = Math.floor(timerElapsed / 60);
  const s = timerElapsed % 60;
  const label = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  return (
    <div
      className="flex shrink-0 items-center gap-1.5 rounded-md border border-line bg-raised px-2 py-1"
      title={timer.taskTitle ? 'Timer: ' + timer.taskTitle : 'Timer'}
    >
      <Clock className="h-3 w-3 shrink-0 text-doing" />
      <span className="font-mono text-[11px] font-semibold text-ink tabular-nums">{label}</span>
      <button
        type="button"
        onClick={stopTimer}
        className="text-[10px] font-medium text-ink-muted transition-colors hover:text-red-400"
      >
        Stop
      </button>
    </div>
  );
}

function ProfilePill() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate('/app/settings')}
      title="Profile and settings"
      aria-label="Profile and settings"
      className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-line bg-raised pl-1 pr-2 transition-colors hover:border-line-strong"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded bg-brand text-[10px] font-semibold text-ink-inverse">
        M
      </span>
      <span className="hidden text-[12px] font-medium text-ink lg:inline">Mojola</span>
    </button>
  );
}

export default function Topbar() {
  const { syncStatus, cycleSyncStatus } = useApp();
  const navigate = useNavigate();
  const goSettings = () => navigate('/app/settings');
  const goTour = () => navigate('/app/settings');
  const goHome = () => navigate('/');

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-line-subtle bg-canvas/80 backdrop-blur">
      <div className="hidden h-14 items-center gap-3 px-4 md:flex">
        <Link to="/app" className="shrink-0">
          <Wordmark size="sm" />
        </Link>
        <nav className="flex min-w-0 flex-1 justify-center">
          <NavTabs />
        </nav>
        <div className="flex shrink-0 items-center gap-0.5">
          <SyncDot status={syncStatus} onClick={cycleSyncStatus} />
          <PomodoroPill />
          <TimerPill />
          <ThemeToggle />
          <IconButton icon={Settings} title="Settings" onClick={goSettings} />
          <IconButton icon={HelpCircle} title="Replay the tour" onClick={goTour} />
          <ProfilePill />
          <IconButton icon={LogOut} title="Log out" onClick={goHome} />
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex h-12 items-center gap-2 px-3">
          <Link to="/app" className="shrink-0">
            <Wordmark size="sm" />
          </Link>
          <div className="ml-auto flex items-center gap-0.5">
            <SyncDot status={syncStatus} onClick={cycleSyncStatus} />
            <ThemeToggle />
            <ProfilePill />
            <IconButton icon={LogOut} title="Log out" onClick={goHome} />
          </div>
        </div>
        <div className="flex h-11 items-center gap-2 overflow-x-auto border-t border-line-subtle px-3 scroll-hidden">
          <div className="shrink-0">
            <NavTabs />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-0.5">
            <PomodoroPill />
            <TimerPill />
            <IconButton icon={Settings} title="Settings" onClick={goSettings} />
            <IconButton icon={HelpCircle} title="Replay the tour" onClick={goTour} />
          </div>
        </div>
      </div>
    </header>
  );
}