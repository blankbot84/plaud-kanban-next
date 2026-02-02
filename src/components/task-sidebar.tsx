'use client';

import { Note } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TaskSidebarProps {
  notes: Note[];
  onToggleAction: (noteId: string, actionIndex: number) => void;
  embedded?: boolean;
}

export function TaskSidebar({ notes, onToggleAction, embedded }: TaskSidebarProps) {
  const notesWithTasks = notes.filter(n => n.actions.length > 0);
  const totalPending = notes.reduce(
    (sum, n) => sum + n.actions.filter(a => !a.done).length,
    0
  );

  const content = (
    <div className="p-3">
      {notesWithTasks.length === 0 ? (
        <p className="text-center py-10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          No tasks
        </p>
      ) : (
        notesWithTasks.map(note => {
          const pendingFirst = [
            ...note.actions.filter(a => !a.done),
            ...note.actions.filter(a => a.done),
          ];

          return (
            <div key={note.id} className="mb-5">
              <div
                className={cn(
                  'text-sm font-medium mb-2 p-3 bg-background border-l-[3px]',
                  note.type === 'voice' ? 'border-l-donnie' : 'border-l-mikey'
                )}
              >
                <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground mr-2">
                  {note.type}
                </span>
                <span className="line-clamp-1">
                  {note.title.length > 30 ? note.title.substring(0, 30) + '...' : note.title}
                </span>
              </div>

              {pendingFirst.map((action, i) => {
                const origIndex = note.actions.indexOf(action);
                return (
                  <label
                    key={i}
                    className="flex items-start gap-3 py-3 px-1 border-b border-border last:border-b-0 cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      checked={action.done}
                      onCheckedChange={() => onToggleAction(note.id, origIndex)}
                      className="mt-0.5 h-5 w-5"
                    />
                    <span
                      className={cn(
                        'text-sm leading-snug flex-1',
                        action.done && 'line-through text-muted-foreground'
                      )}
                    >
                      {action.text}
                    </span>
                  </label>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <aside className="w-72 flex-shrink-0 bg-card border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Tasks
        </span>
        <span className="font-mono text-[10px] text-muted-foreground ml-2">
          {totalPending}
        </span>
      </div>

      <ScrollArea className="flex-1">
        {content}
      </ScrollArea>
    </aside>
  );
}
