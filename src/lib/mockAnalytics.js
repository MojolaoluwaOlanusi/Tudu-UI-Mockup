import { MOCK_POMODORO } from './mockTasks';

function dayKey(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

export function computeStats(tasks, pomodoro) {
  const sessions = (pomodoro || MOCK_POMODORO).filter((s) => s.completed_at);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = sessions.length;

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const todaySessions = sessions.filter((s) => dayKey(s.completed_at) === todayKey);
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const weekSessions = sessions.filter((s) => new Date(s.completed_at) >= weekStart);
  const weekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);

  const daily = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const daySess = sessions.filter((s) => dayKey(s.completed_at) === key);
    daily.push({
      key,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      minutes: daySess.reduce((sum, s) => sum + s.duration, 0),
      sessions: daySess.length,
    });
  }

  const taskMap = new Map((tasks || []).map((t) => [t.id, t]));
  const byTaskMap = new Map();
  for (const s of sessions) {
    const key = s.task_id || 'none';
    if (!byTaskMap.has(key)) {
      const task = s.task_id ? taskMap.get(s.task_id) : null;
      byTaskMap.set(key, {
        taskId: s.task_id,
        title: task ? task.title : 'No task',
        minutes: 0,
        sessions: 0,
      });
    }
    const e = byTaskMap.get(key);
    e.minutes += s.duration;
    e.sessions += 1;
  }
  const byTask = Array.from(byTaskMap.values())
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5);

  const recent = sessions
    .slice()
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    .slice(0, 6)
    .map((s) => ({
      id: s.id,
      taskTitle: s.task_id ? (taskMap.get(s.task_id)?.title || 'Task') : 'Focus session',
      duration: s.duration,
      completed_at: s.completed_at,
    }));

  return {
    totals: {
      minutes: totalMinutes,
      sessions: totalSessions,
      started: (pomodoro || MOCK_POMODORO).length,
      abandoned: (pomodoro || MOCK_POMODORO).length - totalSessions,
    },
    today: { minutes: todayMinutes, sessions: todaySessions.length },
    week: { minutes: weekMinutes, sessions: weekSessions.length },
    daily,
    byTask,
    recent,
  };
}

export function computePersonalAnalytics(tasks) {
  const live = (tasks || []).filter((t) => !t.deleted);
  const total = live.length;
  const todo = live.filter((t) => t.status === 'todo').length;
  const doing = live.filter((t) => t.status === 'doing').length;
  const done = live.filter((t) => t.status === 'done').length;
  const overdue = live.filter(
    (t) => t.due_date && t.status !== 'done' && new Date(t.due_date) < new Date()
  ).length;

  const byPriority = { high: 0, medium: 0, low: 0, none: 0 };
  const byCategory = { work: 0, personal: 0, study: 0, none: 0 };
  for (const t of live) {
    byPriority[t.priority || 'none'] += 1;
    byCategory[t.category || 'none'] += 1;
  }

  return {
    overview: {
      tasks: { total, todo, doing, done, overdue },
      completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
      byPriority,
      byCategory,
    },
  };
}

export function computeCompletionBuckets(tasks, range) {
  const days = range === 'week' ? 7 : range === 'month' ? 30 : 84;
  const bucketSize = range === 'quarter' ? 7 : 1;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const buckets = [];
  for (let i = days - 1; i >= 0; i -= bucketSize) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    buckets.push({
      start: d,
      key: d.toISOString().slice(0, 10),
      label: bucketSize === 7
        ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : d.toLocaleDateString(undefined, { weekday: 'short' }),
      value: 0,
    });
  }

  const completed = (tasks || []).filter((t) => !t.deleted && t.completed_at);
  for (const t of completed) {
    const d = new Date(t.completed_at);
    d.setHours(0, 0, 0, 0);
    for (const b of buckets) {
      const end = new Date(b.start);
      end.setDate(end.getDate() + bucketSize);
      if (d >= b.start && d < end) {
        b.value += 1;
        break;
      }
    }
  }

  return buckets;
}

export function computeTimeByCategory(tasks, pomodoro) {
  const sessions = (pomodoro || MOCK_POMODORO).filter((s) => s.completed_at);
  const taskMap = new Map((tasks || []).map((t) => [t.id, t]));
  const acc = { work: 0, personal: 0, study: 0, none: 0 };
  for (const s of sessions) {
    const task = s.task_id ? taskMap.get(s.task_id) : null;
    const cat = task && task.category ? task.category : 'none';
    acc[cat] += s.duration;
  }
  return [
    { key: 'work', label: 'Work', value: acc.work, color: '#3B82F6' },
    { key: 'personal', label: 'Personal', value: acc.personal, color: '#8B5CF6' },
    { key: 'study', label: 'Study', value: acc.study, color: '#10B981' },
    { key: 'none', label: 'Uncategorised', value: acc.none, color: '#6B6B78' },
  ].filter((c) => c.value > 0);
}

export function computePrioritySplit(tasks) {
  const live = (tasks || []).filter((t) => !t.deleted);
  const acc = { high: 0, medium: 0, low: 0, none: 0 };
  for (const t of live) acc[t.priority || 'none'] += 1;
  return [
    { key: 'high', label: 'High', value: acc.high, color: '#EF4444' },
    { key: 'medium', label: 'Medium', value: acc.medium, color: '#F59E0B' },
    { key: 'low', label: 'Low', value: acc.low, color: '#94A3B8' },
    { key: 'none', label: 'Unset', value: acc.none, color: '#3A3A3A' },
  ].filter((c) => c.value > 0);
}

export const TEAM_MOCK = {
  workspace: { id: 'ws-1', name: 'Team A', role: 'admin' },
  overview: {
    tasks: { total: 24, todo: 4, doing: 2, done: 18, overdue: 1 },
    completionRate: 75,
  },
  byMember: [
    { name: 'Mojola', email: 'mojola@tudu.app', role: 'admin', completed: 8, inProgress: 1, assigned: 3 },
    { name: 'Doyin', email: 'doyin@tudu.app', role: 'member', completed: 6, inProgress: 1, assigned: 2 },
    { name: 'Bisi', email: 'bisi@tudu.app', role: 'member', completed: 4, inProgress: 0, assigned: 1 },
  ],
  boards: [
    { name: 'Sprint 12', done: 12, total: 16 },
    { name: 'Backlog', done: 6, total: 8 },
  ],
  burndown: [24, 22, 20, 18, 14, 10, 8, 6],
};