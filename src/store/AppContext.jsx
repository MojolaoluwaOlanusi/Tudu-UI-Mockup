import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_TASKS } from '@/lib/mockTasks';

const AppContext = createContext(null);
const POMODORO_SECONDS = 25 * 60;
const UNDO_WINDOW_MS = 10000;

export function AppProvider({ children }) {
  const [syncStatus, setSyncStatus] = useState('live');
  const [pomodoro, setPomodoro] = useState(null);
  const [timer, setTimer] = useState(null);
  const [detail, setDetail] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [undoToast, setUndoToast] = useState(null);
  const [isComposerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    if (!pomodoro && !timer) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [pomodoro, timer]);

  useEffect(() => {
    if (!undoToast) return;
    const remaining = undoToast.expiresAt - Date.now();
    if (remaining <= 0) { setUndoToast(null); return; }
    const id = setTimeout(() => setUndoToast(null), remaining);
    return () => clearTimeout(id);
  }, [undoToast]);

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
    setSyncStatus((s) => (s === 'live' ? 'connecting' : s === 'connecting' ? 'offline' : 'live'));
  }, []);

  const openComposer = useCallback(() => setComposerOpen(true), []);
  const closeComposer = useCallback(() => setComposerOpen(false), []);

  const createTask = useCallback((input) => {
    const id = 't-' + Date.now();
    const maxShort = MOCK_TASKS.reduce((m, t) => Math.max(m, t.short_id || 0), 100);
    const newTask = {
      id,
      short_id: maxShort + 1,
      title: input.title || 'Untitled task',
      description: input.description || null,
      status: input.status || 'todo',
      category: input.category || null,
      priority: input.priority || null,
      due_date: input.due_date || null,
      assignee: input.assignee || null,
      subtasks: [],
      timerRunning: false,
      board_id: input.board_id || 'b-1',
      deleted: false,
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (!task) return prev;
      setUndoToast({ taskId: task.id, title: task.title, expiresAt: Date.now() + UNDO_WINDOW_MS });
      return prev.map((t) => (t.id === id ? { ...t, deleted: true } : t));
    });
  }, []);

  const undoDelete = useCallback(() => {
    setUndoToast((toast) => {
      if (!toast) return toast;
      setTasks((prev) => prev.map((t) => (t.id === toast.taskId ? { ...t, deleted: false } : t)));
      return null;
    });
  }, []);

  const clearUndo = useCallback(() => setUndoToast(null), []);

  const value = useMemo(
    () => ({
      syncStatus, setSyncStatus, cycleSyncStatus,
      pomodoro, pomodoroRemaining, startPomodoro, stopPomodoro,
      timer, timerElapsed, startTimer, stopTimer,
      detail, openDetail, closeDetail,
      tasks, createTask, updateTask, deleteTask, undoDelete, undoToast, clearUndo,
      isComposerOpen, openComposer, closeComposer,
    }),
    [
      syncStatus, cycleSyncStatus,
      pomodoro, pomodoroRemaining, startPomodoro, stopPomodoro,
      timer, timerElapsed, startTimer, stopTimer,
      detail, openDetail, closeDetail,
      tasks, createTask, updateTask, deleteTask, undoDelete, undoToast, clearUndo,
      isComposerOpen, openComposer, closeComposer,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}