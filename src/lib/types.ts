export type NoteType = 'voice' | 'meeting';
export type ColumnId = 'inbox' | 'review' | 'action' | 'done';
export type ViewMode = 'kanban' | 'list';

export interface Action {
  text: string;
  done: boolean;
}

export interface Note {
  id: string;
  type: NoteType;
  title: string;
  synopsis: string;
  takeaways: string[];  // Also serves as tags
  actions: Action[];
  transcript: string;
  date: string;
  column: ColumnId;
  duration?: number;    // Duration in seconds
  participants?: string[];  // For meetings
}

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'review', label: 'Review' },
  { id: 'action', label: 'Action' },
  { id: 'done', label: 'Done' },
];

// ─────────────────────────────────────────────────────────────
// TASKS (File-based with Markdown + Frontmatter)
// ─────────────────────────────────────────────────────────────

export type TaskStatus = 'inbox' | 'active' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[];       // agent ids
  description: string;       // markdown content (body of file)
  created: string;           // ISO 8601 date
  updated?: string;          // ISO 8601 date
  due?: string;              // ISO 8601 date
  tags?: string[];
}

export const TASK_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'inbox', label: 'Inbox', color: 'bg-muted-foreground' },
  { id: 'active', label: 'Active', color: 'bg-raph' },
  { id: 'done', label: 'Done', color: 'bg-donnie' },
];
