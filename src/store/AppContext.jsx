import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AppContext = createContext(null);
const POMODORO_SECONDS = 25 * 60;

export function AppProvider({ children }) {
  const [syncStatus, setSyncStatus] = useState('live');
  const [pomodoro, setPomodoro] = useState(null);
  const [timer, setTimer] = useState(null);
  const [detail, setDetail] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!pomodoro && !timer) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [pomodoro, timer]);

  const pomodoroRemaining = pomodoro
    ? Math.max(0, Math.round(POMODORO_SECONDS - (now - pomodoro.startedAt) / 1000))
    : 0;

  const timerElapsed = timer
    ? Math.max(0, Math.round((now - timer.startedAt) / 1000))
    : 0;

  const startPomodoro = useCallback((taskTitle = null) => {
    setPomodoro({ taskTitle, startedAt: Date.now() });
    setNow(Date.now());
  }, []);

  const stopPomodoro = useCallback(() => setPomodoro(null), []);

  const startTimer = useCallback((taskTitle = null) => {
    setTimer({ taskTitle, startedAt: Date.now() });
    setNow(Date.now());
  }, []);

  const stopTimer = useCallback(() => setTimer(null), []);

  const openDetail = useCallback((payload) => setDetail(payload), []);
  const closeDetail = useCallback(() => setDetail(null), []);

  const cycleSyncStatus = useCallback(() => {
    setSyncStatus((s) =>
      s === 'live' ? 'connecting' : s === 'connecting' ? 'offline' : 'live'
    );
  }, []);

  const value = useMemo(
    () => ({
      syncStatus,
      setSyncStatus,
      cycleSyncStatus,
      pomodoro,
      pomodoroRemaining,
      startPomodoro,
      stopPomodoro,
      timer,
      timerElapsed,
      startTimer,
      stopTimer,
      detail,
      openDetail,
      closeDetail,
    }),
    [
      syncStatus,
      cycleSyncStatus,
      pomodoro,
      pomodoroRemaining,
      startPomodoro,
      stopPomodoro,
      timer,
      timerElapsed,
      startTimer,
      stopTimer,
      detail,
      openDetail,
      closeDetail,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}