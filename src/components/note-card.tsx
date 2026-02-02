'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Note } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const pendingTasks = note.actions.filter(a => !a.done).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'bg-background border border-border p-3 cursor-grab active:cursor-grabbing',
        'hover:border-muted-foreground transition-all duration-150',
        'border-l-[3px]',
        note.type === 'voice' ? 'border-l-donnie' : 'border-l-mikey',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <h3 className="text-sm font-medium mb-2 line-clamp-2 leading-snug">
        {note.title}
      </h3>
      <div className="flex justify-between items-center font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
        <span>{note.date}</span>
        {pendingTasks > 0 && (
          <span className="bg-raph text-white px-1.5 py-0.5 font-bold">
            {pendingTasks}
          </span>
        )}
      </div>
    </div>
  );
}
