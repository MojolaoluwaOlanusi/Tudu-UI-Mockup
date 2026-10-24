export const WORKSPACES = [
  { id: 'ws-1', name: 'Team A' },
  { id: 'ws-2', name: 'Team B' },
];

export const BOARDS = [
  { id: 'b-1', name: 'My board', workspace_id: null },
  { id: 'b-2', name: 'Side projects', workspace_id: null },
  { id: 'b-3', name: 'Sprint 12', workspace_id: 'ws-1' },
  { id: 'b-4', name: 'Backlog', workspace_id: 'ws-1' },
  { id: 'b-5', name: 'Marketing', workspace_id: 'ws-2' },
];

export const INVITES = [
  { id: 'inv-1', owner: 'Doyin Olanusi', initials: 'DO', taskCount: 3, permission: 'edit' },
  { id: 'inv-2', owner: 'Bisi Adebayo', initials: 'BA', taskCount: 2, permission: 'view' },
];

export const SHARED_WITH_ME = [
  { id: 'sw-1', owner: 'Doyin Olanusi', initials: 'DO', taskCount: 5, completedCount: 3 },
  { id: 'sw-2', owner: 'Bisi Adebayo', initials: 'BA', taskCount: 3, completedCount: 1 },
];

export const SHARED_BY_ME = [
  { id: 'sb-1', sharedWith: 'Tunde Adeyemi', initials: 'TA', status: 'accepted' },
  { id: 'sb-2', sharedWith: 'Chioma Eze', initials: 'CE', status: 'pending' },
];