'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Note, NoteType, ColumnId, COLUMNS } from '@/lib/types';
import { sampleNotes } from '@/lib/data';
import { KanbanColumn } from './kanban-column';
import { NoteDetail } from './note-detail';
import { TaskSidebar } from './task-sidebar';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

export function KanbanBoard() {
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeNote = notes.find(n => n.id === active.id);
    if (!activeNote) return;

    // Check if we're over a column
    const overColumn = COLUMNS.find(c => c.id === over.id);
    if (overColumn && activeNote.column !== overColumn.id) {
      setNotes(prev =>
        prev.map(n =>
          n.id === active.id ? { ...n, column: overColumn.id } : n
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeNote = notes.find(n => n.id === active.id);
    if (!activeNote) return;

    // Final column assignment
    const overColumn = COLUMNS.find(c => c.id === over.id);
    if (overColumn) {
      setNotes(prev =>
        prev.map(n =>
          n.id === active.id ? { ...n, column: overColumn.id } : n
        )
      );
    }
  };

  const handleMove = (noteId: string, column: ColumnId) => {
    setNotes(prev =>
      prev.map(n => (n.id === noteId ? { ...n, column } : n))
    );
  };

  const handleToggleAction = (noteId: string, actionIndex: number) => {
    setNotes(prev =>
      prev.map(n => {
        if (n.id !== noteId) return n;
        const newActions = [...n.actions];
        newActions[actionIndex] = {
          ...newActions[actionIndex],
          done: !newActions[actionIndex].done,
        };
        return { ...n, actions: newActions };
      })
    );
  };

  const activeNote = activeId ? notes.find(n => n.id === activeId) : null;

  const renderSection = (type: NoteType, label: string) => {
    const typeNotes = notes.filter(n => n.type === type);
    return (
      <section className="py-4">
        <div className="sticky top-0 bg-background z-40 border-b border-border px-5 py-3 flex items-center gap-3">
          <div className={cn('w-1 h-6', type === 'voice' ? 'bg-donnie' : 'bg-mikey')} />
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground ml-auto">
            {typeNotes.length}
          </span>
        </div>
        <div className="flex gap-3 p-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {COLUMNS.map(col => (
            <KanbanColumn
              key={`${type}-${col.id}`}
              id={col.id}
              label={col.label}
              notes={typeNotes.filter(n => n.column === col.id)}
              onNoteClick={setSelectedNote}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background border-b border-border px-5 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-mono text-sm font-bold tracking-[0.25em] uppercase">
              PLAUD
            </h1>
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
              NOTES
            </span>
          </div>
          <ThemeToggle />
        </header>

        {/* Main layout */}
        <div className="flex flex-1 h-[calc(100vh-69px)]">
          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            {renderSection('voice', 'Voice')}
            <div className="h-px bg-border mx-5" />
            {renderSection('meeting', 'Meetings')}
          </main>

          {/* Sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <TaskSidebar notes={notes} onToggleAction={handleToggleAction} />
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeNote && (
          <div className={cn(
            'bg-card border border-border p-3 w-60 shadow-xl',
            'border-l-[3px]',
            activeNote.type === 'voice' ? 'border-l-donnie' : 'border-l-mikey'
          )}>
            <h3 className="text-sm font-medium line-clamp-2">{activeNote.title}</h3>
          </div>
        )}
      </DragOverlay>

      {/* Note detail modal */}
      <NoteDetail
        note={selectedNote}
        open={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        onMove={handleMove}
        onToggleAction={handleToggleAction}
      />
    </DndContext>
  );
}
