import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { MOCK_TASKS, MOCK_COLUMNS } from '@/lib/mockTasks';

const AppContext = createContext(null);
const POMODORO_SECONDS = 25 * 60;
const UNDO_WINDOW_MS = 10000;

function fireConfetti() {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22C55E', '#16A34A', '#4ADE80', '#86EFAC'],
      disableForReducedMotion: true,
    });
  } catch {}
}

export function AppProvider({ children }) {
  const [syncStatus, setSyncStatus] = useState('live');
  const [pomodoro, setPomodoro] = useState(null);
  const [timer, setTimer] = useState(null);
  const [detail, setDetail] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [columns, setColumns] = useState(MOCK_COLUMNS);
  const [undoToast, setUndoToast] = useState(null);
  const [isComposerOpen, setComposerOpen] = useState(false);
  const [composerColumnId, setComposerColumnId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

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

  const openComposer = useCallback((columnId = null) => {
    setComposerColumnId(columnId);
    setComposerOpen(true);
  }, []);
  const closeComposer = useCallback(() => {
    setComposerOpen(false);
    setComposerColumnId(null);
  }, []);

  const pushToast = useCallback((message, variant = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      setConfirmDialog({ ...opts, resolve });
    });
  }, []);

  const confirmResolve = useCallback((answer) => {
    setConfirmDialog((prev) => {
      if (prev && prev.resolve) prev.resolve(answer);
      return null;
    });
  }, []);

  const createTask = useCallback((input) => {
    const id = 't-' + Date.now();
    const maxShort = tasks.reduce((m, t) => Math.max(m, t.short_id || 0), 100);
    const targetColumn = input.column_id
      ? columns.find((c) => c.id === input.column_id)
      : columns.find((c) => c.stage === (input.status || 'todo'));
    const newTask = {
      id,
      short_id: maxShort + 1,
      title: input.title || 'Untitled task',
      description: input.description || null,
      status: targetColumn ? targetColumn.stage : 'todo',
      column_id: targetColumn ? targetColumn.id : null,
      category: input.category || null,
      priority: input.priority || null,
      due_date: input.due_date || null,
      assignee: input.assignee || null,
      subtasks: [],
      timerRunning: false,
      board_id: input.board_id || 'b-1',
      deleted: false,
      created_at: new Date().toISOString(),
      completed_at: null,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, [tasks, columns]);

  const updateTask = useCallback((id, patch) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    let targetColumnId = null;
    let targetStage = null;
    if (patch.column_id !== undefined) {
      const col = columns.find((c) => c.id === patch.column_id);
      if (col) { targetColumnId = col.id; targetStage = col.stage; }
    } else if (patch.status !== undefined) {
      const col = columns.find((c) => c.stage === patch.status);
      if (col) { targetColumnId = col.id; targetStage = col.stage; }
    }

    if (targetColumnId && targetColumnId !== task.column_id) {
      const col = columns.find((c) => c.id === targetColumnId);
      if (col && col.wip_limit != null) {
        const count = tasks.filter((t) => t.column_id === targetColumnId && !t.deleted).length;
        if (count >= col.wip_limit) {
          pushToast('"' + col.name + '" is full (WIP limit ' + col.wip_limit + '). Move or finish a card first.');
          return;
        }
      }
    }

    if (targetStage === 'done' && task.status !== 'done') {
      fireConfetti();
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = { ...t, ...patch };
        if (patch.status !== undefined && patch.column_id === undefined && targetColumnId) {
          next.column_id = targetColumnId;
        }
        if (patch.column_id !== undefined && patch.status === undefined && targetStage) {
          next.status = targetStage;
        }
        if (targetStage !== null) {
          if (targetStage === 'done' && t.status !== 'done') next.completed_at = new Date().toISOString();
          else if (targetStage !== 'done' && t.status === 'done') next.completed_at = null;
        }
        return next;
      })
    );
  }, [tasks, columns, pushToast]);

  const moveTask = useCallback((id, targetColumnId) => {
    updateTask(id, { column_id: targetColumnId });
  }, [updateTask]);

  const reorderColumns = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setColumns((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((c, i) => ({ ...c, position: i }));
    });
  }, []);

  const createColumn = useCallback((input) => {
    const newCol = {
      id: 'col-' + Date.now(),
      board_id: 'b-1',
      name: input.name || 'New column',
      stage: input.stage || 'todo',
      color: input.color || '#94A3B8',
      wip_limit: input.wip_limit != null ? input.wip_limit : null,
      position: columns.length,
    };
    setColumns((prev) => [...prev, newCol]);
    return newCol;
  }, [columns.length]);

  const updateColumn = useCallback((id, patch) => {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    if (patch.stage !== undefined) {
      setTasks((prev) =>
        prev.map((t) => (t.column_id === id ? { ...t, status: patch.stage } : t))
      );
    }
  }, []);

  const deleteColumn = useCallback((id) => {
    if (columns.length <= 1) return false;
    const target = columns.find((c) => c.id === id);
    if (!target) return false;
    const siblings = columns.filter((c) => c.id !== id);
    const sameStage = siblings.find((c) => c.stage === target.stage);
    const fallback = sameStage || siblings[0];
    setColumns(siblings);
    setTasks((prev) =>
      prev.map((t) =>
        t.column_id === id ? { ...t, column_id: fallback.id, status: fallback.stage } : t
      )
    );
    return true;
  }, [columns]);

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
      tasks, createTask, updateTask, moveTask, deleteTask, undoDelete, undoToast, clearUndo,
      columns, createColumn, updateColumn, deleteColumn, reorderColumns,
      isComposerOpen, openComposer, closeComposer, composerColumnId,
      toasts, pushToast, dismissToast,
      confirm, confirmDialog, confirmResolve,
    }),
    [
      syncStatus, cycleSyncStatus,
      pomodoro, pomodoroRemaining, startPomodoro, stopPomodoro,
      timer, timerElapsed, startTimer, stopTimer,
      detail, openDetail, closeDetail,
      tasks, createTask, updateTask, moveTask, deleteTask, undoDelete, undoToast, clearUndo,
      columns, createColumn, updateColumn, deleteColumn, reorderColumns,
      isComposerOpen, openComposer, closeComposer, composerColumnId,
      toasts, pushToast, dismissToast,
      confirm, confirmDialog, confirmResolve,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}