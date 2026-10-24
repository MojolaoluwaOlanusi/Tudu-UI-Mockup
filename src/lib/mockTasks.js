function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

export const MOCK_TASKS = [
  {
    id: 't-1',
    short_id: 42,
    title: 'Design new dashboard',
    description: 'Ship the new analytics view with per-widget filters and a comparison mode against last period.',
    status: 'doing',
    category: 'work',
    priority: 'high',
    due_date: daysFromNow(1).toISOString(),
    assignee: { id: 'u-2', name: 'Doyin Olanusi', initials: 'DO' },
    subtasks: [
      { id: 'st-1a', title: 'Draft the layout in Figma', completed: true },
      { id: 'st-1b', title: 'Wire up the charts', completed: true },
      { id: 'st-1c', title: 'Add comparison mode', completed: false },
      { id: 'st-1d', title: 'Test on mobile', completed: false },
    ],
    timerRunning: true,
    board_id: 'b-1',
    deleted: false,
  },
  {
    id: 't-2',
    short_id: 41,
    title: 'Review API spec',
    description: null,
    status: 'todo',
    category: 'work',
    priority: 'medium',
    due_date: daysFromNow(3).toISOString(),
    assignee: null,
    subtasks: [],
    timerRunning: false,
    board_id: 'b-1',
    deleted: false,
  },
  {
    id: 't-3',
    short_id: 40,
    title: 'Buy milk',
    description: 'Get the 2% from the corner shop.',
    status: 'todo',
    category: 'personal',
    priority: 'low',
    due_date: daysFromNow(-1).toISOString(),
    assignee: null,
    subtasks: [],
    timerRunning: false,
    board_id: 'b-1',
    deleted: false,
  },
  {
    id: 't-4',
    short_id: 39,
    title: 'Write launch notes',
    description: null,
    status: 'done',
    category: 'work',
    priority: 'high',
    due_date: null,
    assignee: { id: 'u-2', name: 'Doyin Olanusi', initials: 'DO' },
    subtasks: [
      { id: 'st-4a', title: 'Collect quotes', completed: true },
      { id: 'st-4b', title: 'Draft announcement', completed: true },
    ],
    timerRunning: false,
    board_id: 'b-1',
    deleted: false,
  },
  {
    id: 't-5',
    short_id: 38,
    title: 'Ship pricing page',
    description: null,
    status: 'doing',
    category: 'work',
    priority: 'high',
    due_date: daysFromNow(1).toISOString(),
    assignee: { id: 'u-3', name: 'Bisi Adebayo', initials: 'BA' },
    subtasks: [],
    timerRunning: false,
    board_id: 'b-1',
    deleted: false,
  },
  {
    id: 't-6',
    short_id: 37,
    title: 'Read Shape Up',
    description: null,
    status: 'done',
    category: 'personal',
    priority: null,
    due_date: null,
    assignee: null,
    subtasks: [],
    timerRunning: false,
    board_id: 'b-1',
    deleted: false,
  },
  {
    id: 't-7',
    short_id: 36,
    title: 'Fix login button on mobile',
    description: 'Button is 1px too low on iPhone SE.',
    status: 'todo',
    category: 'work',
    priority: 'medium',
    due_date: null,
    assignee: null,
    subtasks: [],
    timerRunning: false,
    board_id: 'b-1',
    deleted: false,
  },
];

export function parseTaskText(text) {
  const original = text;
  let remaining = text;

  let category = null;
  const catMatch = remaining.match(/#(work|personal|study)\b/i);
  if (catMatch) {
    category = catMatch[1].toLowerCase();
    remaining = remaining.replace(catMatch[0], ' ');
  }

  let priority = null;
  if (/\b(urgent|asap|high priority|critical)\b/i.test(remaining)) {
    priority = 'high';
    remaining = remaining.replace(/\b(urgent|asap|high priority|critical)\b/i, ' ');
  } else if (/\b(medium priority|normal priority)\b/i.test(remaining)) {
    priority = 'medium';
    remaining = remaining.replace(/\b(medium priority|normal priority)\b/i, ' ');
  } else if (/\b(low priority|no rush)\b/i.test(remaining)) {
    priority = 'low';
    remaining = remaining.replace(/\b(low priority|no rush)\b/i, ' ');
  }

  const now = new Date();
  let date = null;
  let hasDate = false;
  if (/\btomorrow\b/i.test(remaining)) {
    date = daysFromNow(1);
    hasDate = true;
    remaining = remaining.replace(/\btomorrow\b/i, ' ');
  } else if (/\btoday\b/i.test(remaining)) {
    date = daysFromNow(0);
    hasDate = true;
    remaining = remaining.replace(/\btoday\b/i, ' ');
  } else if (/\bnext week\b/i.test(remaining)) {
    date = daysFromNow(7);
    hasDate = true;
    remaining = remaining.replace(/\bnext week\b/i, ' ');
  } else {
    const dayMatch = remaining.match(/\b(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
    if (dayMatch) {
      const dayMap = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
      const target = dayMap[dayMatch[2].toLowerCase()];
      const d = new Date(now);
      let delta = (target - d.getDay() + 7) % 7;
      if (delta === 0) delta = 7;
      d.setDate(d.getDate() + delta);
      date = d;
      hasDate = true;
      remaining = remaining.replace(dayMatch[0], ' ');
    }
  }

  let hasTime = false;
  if (date) {
    const timeMatch = remaining.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
      if (ampm === 'pm' && hours < 12) hours += 12;
      if (ampm === 'am' && hours === 12) hours = 0;
      date.setHours(hours, minutes, 0, 0);
      hasTime = true;
      remaining = remaining.replace(timeMatch[0], ' ');
    }
  }

  const title = remaining.replace(/\s+/g, ' ').trim() || original.trim();

  const matched = [];
  if (category) matched.push('#' + category);
  if (priority) matched.push(priority + ' priority');
  if (hasDate && date) {
    const opts = hasTime
      ? { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
      : { month: 'short', day: 'numeric' };
    matched.push('Due ' + date.toLocaleDateString(undefined, opts));
  }

  return {
    title,
    due_date: date ? date.toISOString() : null,
    category,
    priority,
    matched,
  };
}

export function groupTasks(tasks, groupBy) {
  if (groupBy === 'none') {
    return [{ key: 'all', label: 'All tasks', tasks }];
  }

  if (groupBy === 'status') {
    const labels = { todo: 'To-do', doing: 'Doing', done: 'Done' };
    return ['todo', 'doing', 'done']
      .map((s) => ({
        key: s,
        label: labels[s],
        tasks: tasks.filter((t) => t.status === s),
      }))
      .filter((g) => g.tasks.length > 0);
  }

  if (groupBy === 'priority') {
    const labels = { high: 'High priority', medium: 'Medium priority', low: 'Low priority', none: 'No priority' };
    return ['high', 'medium', 'low', 'none']
      .map((p) => ({
        key: p,
        label: labels[p],
        tasks: tasks.filter((t) => (p === 'none' ? !t.priority : t.priority === p)),
      }))
      .filter((g) => g.tasks.length > 0);
  }

  if (groupBy === 'assignee') {
    const groups = new Map();
    groups.set('none', { key: 'none', label: 'Unassigned', tasks: [] });
    for (const t of tasks) {
      const key = t.assignee ? t.assignee.id : 'none';
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          label: t.assignee ? t.assignee.name : 'Unassigned',
          tasks: [],
        });
      }
      groups.get(key).tasks.push(t);
    }
    return Array.from(groups.values()).filter((g) => g.tasks.length > 0);
  }

  return [{ key: 'all', label: 'All tasks', tasks }];
}

export const FILTER_TYPES = [
  { key: 'status', label: 'Status', options: [
    { value: 'todo', label: 'To-do' },
    { value: 'doing', label: 'Doing' },
    { value: 'done', label: 'Done' },
  ]},
  { key: 'priority', label: 'Priority', options: [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]},
  { key: 'category', label: 'Category', options: [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'study', label: 'Study' },
  ]},
  { key: 'assignee', label: 'Assignee', options: [
    { value: 'me', label: 'Me' },
    { value: 'u-2', label: 'Doyin Olanusi' },
    { value: 'u-3', label: 'Bisi Adebayo' },
    { value: 'none', label: 'Unassigned' },
  ]},
];