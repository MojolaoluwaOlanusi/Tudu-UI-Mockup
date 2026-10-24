export const DOC_ORDER = [
  'index',
  'boards', 'lists', 'shortcuts',
  'pomodoro', 'time', 'analytics',
  'ai', 'nlp', 'celebrations',
  'templates',
  'api', 'webhooks', 'tokens',
];

export const DOCS = {
  index: {
    title: 'Welcome to Tudu',
    intro: "Tudu is the fast, offline-first Kanban for people tired of Trello's limits and Jira's chaos. These docs cover everything from creating your first board to shipping webhooks.",
    sections: [
      {
        heading: 'What you can do',
        bullets: [
          'Boards, lists, kanban columns, and WIP limits',
          'Keyboard-first interactions with Cmd+K everywhere',
          'Pomodoro focus sessions and time tracking',
          'AI-powered task breakdown',
          'Team workspaces with roles and invites',
          'GitHub + Slack integrations',
          'Public API, webhooks, and API tokens',
          'Self-hosting license for on-prem deployments',
        ],
      },
      {
        heading: 'Where to go next',
        paragraphs: [
          'New here? Start with Boards & Kanban. Power user? Jump to Bulk & shortcuts. Building an integration? See the Public API reference.',
        ],
      },
    ],
  },

  boards: {
    title: 'Boards & Kanban',
    intro: 'Boards are the top-level container. Each board has one or more columns, and each column holds cards.',
    sections: [
      {
        heading: 'Create a board',
        paragraphs: ['Click + New board in the sidebar. Give it a name, optionally pick a workspace, and hit enter.'],
        code: `curl -X POST https://api.tudu.app/api/v1/boards \\
  -H "Authorization: Bearer tudu_pat_..." \\
  -d '{"name": "Q4 Sprint"}'`,
      },
      {
        heading: 'WIP limits',
        paragraphs: [
          'Every column can have a Work-In-Progress limit. When a column reaches its limit, new cards are blocked until you finish or move existing ones.',
        ],
      },
      {
        heading: 'Templates',
        paragraphs: [
          'Start with a template to skip setup. Sprint, Bug Fix, Content, and Roadmap are built in; more live in the marketplace.',
        ],
      },
    ],
  },

  lists: {
    title: 'Lists & filters',
    intro: 'The list view is where most work happens. Filter, group, sort, and save views that stick.',
    sections: [
      {
        heading: 'Filter syntax',
        bullets: [
          '@me — assigned to you',
          '#work — category is work',
          'due:week — due within 7 days',
          'priority:high — high priority only',
          'status:doing — current status',
        ],
      },
      {
        heading: 'Grouping',
        paragraphs: [
          'Group by Status (default), Priority, Assignee, or none. Every grouping collapses and remembers state.',
        ],
      },
    ],
  },

  shortcuts: {
    title: 'Bulk & shortcuts',
    intro: 'Tudu is designed to be usable without a mouse. Every action has a keystroke.',
    sections: [
      {
        heading: 'Global',
        bullets: [
          'Cmd+K — command palette',
          '? — shortcut help',
          'N — new task (list or board)',
          'Ctrl+Shift+D — toggle density',
          'Esc — close panel / dismiss',
        ],
      },
      {
        heading: 'Navigation',
        bullets: [
          'G then L — go to List',
          'G then B — go to Board',
          'G then S — go to Stats',
          'G then A — go to Analytics',
        ],
      },
      {
        heading: 'Bulk select',
        paragraphs: [
          'Click the checkbox on any row to enter select mode. Shift-click for ranges, Cmd-click to toggle, Cmd+A to select all visible.',
        ],
      },
    ],
  },

  pomodoro: {
    title: 'Pomodoro',
    intro: 'Start a 25-minute focus session against any task. Tudu tracks the minutes and folds them into your stats.',
    sections: [
      {
        heading: 'Start a session',
        paragraphs: [
          'From any task, click Start 25m. The timer shows in the topbar and keeps counting even if you navigate away.',
        ],
      },
      {
        heading: 'Where it lands',
        paragraphs: [
          'Completed sessions roll into Focus stats. See today, this week, and all-time minutes, plus per-task breakdowns.',
        ],
      },
    ],
  },

  time: {
    title: 'Time tracking',
    intro: 'Pro feature. Log hours against any task, mark them billable, and export weekly.',
    sections: [
      {
        heading: 'Manual and running timers',
        paragraphs: [
          'Start a timer from a task card, or log manually from the task detail panel. Billable vs non-billable is per-entry.',
        ],
      },
      {
        heading: 'Weekly report',
        paragraphs: [
          'Every Monday, a per-task and per-category rollup is available in Stats > Time tracking. Export to CSV from the same screen.',
        ],
      },
    ],
  },

  analytics: {
    title: 'Analytics',
    intro: 'Personal and team insights — completion rates, burndown, per-member breakdowns.',
    sections: [
      {
        heading: 'Personal',
        paragraphs: [
          'See tasks completed, in progress, overdue, and total focus time across the last 7 days, 30 days, or 12 weeks.',
        ],
      },
      {
        heading: 'Team (Pro)',
        paragraphs: [
          'Per-member completion and in-progress rates, burndown, and per-board progress. Requires the analytics.team feature flag.',
        ],
      },
    ],
  },

  ai: {
    title: 'AI breakdown',
    intro: "Turn a one-line task into a checklist. Tudu parses the title and proposes 6 (Free) or 12 (Pro) subtasks.",
    sections: [
      {
        heading: 'How to use it',
        paragraphs: [
          "On any task detail, click Suggest subtasks. Review what comes back, uncheck the ones you don't want, and accept.",
        ],
      },
      {
        heading: 'Limits',
        bullets: [
          'Free: 100 calls/month, 6 steps per breakdown',
          'Pro: 1,200 calls/month, 12 steps per breakdown, streaming',
          'Pro+: unlimited, on higher tiers',
        ],
      },
    ],
  },

  nlp: {
    title: 'NLP parsing',
    intro: 'Type it like you say it. Tudu parses dates, categories, and priorities from plain text.',
    sections: [
      {
        heading: 'What parses',
        bullets: [
          'Dates: tomorrow, today, next week, Monday, Oct 24',
          'Times: at 9am, at 14:30',
          'Categories: #work, #personal, #study',
          'Priorities: urgent, asap, high priority, no rush',
        ],
      },
      {
        heading: 'Example',
        paragraphs: [
          'This produces a task titled "Buy milk" with category personal, priority high, and a due date of tomorrow at 9:00.',
        ],
        code: 'Buy milk tomorrow at 9am #personal urgent',
      },
    ],
  },

  celebrations: {
    title: 'Celebrations',
    intro: 'A small confetti pop when you finish a task, and at focus-session milestones.',
    sections: [
      {
        heading: 'Toggle',
        paragraphs: [
          'Turn it off in Settings > Notifications > In-app. The preference persists per-account.',
        ],
      },
      {
        heading: 'Accessibility',
        paragraphs: [
          'Celebrations respect prefers-reduced-motion. If your OS asks apps to reduce motion, confetti is suppressed automatically.',
        ],
      },
    ],
  },

  templates: {
    title: 'Templates',
    intro: 'Skip setup. Sprint, Bug Fix, Content, and Roadmap are built in. Install more from the marketplace, or publish your own.',
    sections: [
      {
        heading: 'Built-in',
        bullets: [
          'Sprint — Backlog > In Progress > Review > Done',
          'Bug Fix — Triage > Reproduce > Fix > QA',
          'Content — Idea > Draft > Review > Published',
        ],
      },
      {
        heading: 'Publish your own',
        paragraphs: [
          'Pro feature. From a board, open the menu > Publish as template. Set a price (0 or 100 NGN minimum) and Tudu handles delivery + payment.',
        ],
      },
    ],
  },

  api: {
    title: 'Public API',
    intro: 'REST, JSON, personal tokens. Free tier is read-only; Pro unlocks write.',
    sections: [
      {
        heading: 'Authentication',
        code: `curl -H "Authorization: Bearer tudu_pat_yourtoken" \\
  https://api.tudu.app/api/v1/tasks`,
      },
      {
        heading: 'Endpoints',
        bullets: [
          'GET /api/v1/tasks — list with filters',
          'POST /api/v1/tasks — create (Pro)',
          'PATCH /api/v1/tasks/:id — update (Pro)',
          'DELETE /api/v1/tasks/:id — soft delete (Pro)',
          'GET /api/v1/boards — list boards',
        ],
      },
      {
        heading: 'Rate limits',
        paragraphs: [
          'Free: 60 req/min. Pro: 600 req/min. Every response includes X-RateLimit-Remaining.',
        ],
      },
    ],
  },

  webhooks: {
    title: 'Webhooks',
    intro: 'Signed HTTPS POSTs on every task mutation. HMAC-SHA256 in the X-Tudu-Signature header.',
    sections: [
      {
        heading: 'Setup',
        paragraphs: [
          'Add an endpoint in Settings > Webhooks. Every active endpoint receives every event unless you filter by type.',
        ],
      },
      {
        heading: 'Payload',
        code: `{
  "event": "task.created",
  "timestamp": "2026-10-22T14:23:00Z",
  "task": { "id": "t-1", "title": "Ship v1", "status": "todo" }
}`,
      },
      {
        heading: 'Retries',
        paragraphs: [
          '5xx — retried 6 times with exponential backoff over 24h. 4xx — no retry (dead letter). View and requeue in Settings > Webhooks.',
        ],
      },
    ],
  },

  tokens: {
    title: 'API tokens',
    intro: 'Personal access tokens give scripts read (Free) or read/write (Pro) access to your account.',
    sections: [
      {
        heading: 'Create',
        paragraphs: [
          'Settings > API > Create token. Give it a label, copy the plaintext immediately. It will not be shown again.',
        ],
      },
      {
        heading: 'Rotate',
        paragraphs: [
          'Tokens do not expire automatically. Revoke any token at any time from the same page. Revoked tokens are rejected within 5 seconds.',
        ],
      },
    ],
  },
};