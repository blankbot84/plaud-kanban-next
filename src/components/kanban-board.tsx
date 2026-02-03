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
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  embedded?: boolean;
}

export function KanbanBoard({ embedded }: KanbanBoardProps) {
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
  );

  const pendingTaskCount = notes.reduce(
    (sum, n) => sum + n.actions.filter(a => !a.done).length,
    0
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeNote = notes.find(n => n.id === active.id);
    if (!activeNote) return;

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

  const renderKanbanRow = (type: NoteType) => {
    const typeNotes = notes.filter(n => n.type === type);
    return (
      <div className="flex gap-3 md:gap-4 p-3 md:p-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-20 md:pb-4">
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
    );
  };

  const content = (
    <>
      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile: Tabs layout */}
        <main className="flex-1 overflow-hidden lg:hidden">
          <Tabs defaultValue="voice" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b border-border bg-transparent h-12 p-0">
              <TabsTrigger 
                value="voice" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-donnie data-[state=active]:bg-transparent font-mono text-xs uppercase tracking-widest h-full"
              >
                <span className="w-2 h-2 bg-donnie mr-2" />
                Voice
                <span className="ml-2 text-muted-foreground">
                  {notes.filter(n => n.type === 'voice').length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="meetings"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-mikey data-[state=active]:bg-transparent font-mono text-xs uppercase tracking-widest h-full"
              >
                <span className="w-2 h-2 bg-mikey mr-2" />
                Meetings
                <span className="ml-2 text-muted-foreground">
                  {notes.filter(n => n.type === 'meeting').length}
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="voice" className="flex-1 overflow-auto mt-0">
              {renderKanbanRow('voice')}
            </TabsContent>
            <TabsContent value="meetings" className="flex-1 overflow-auto mt-0">
              {renderKanbanRow('meeting')}
            </TabsContent>
          </Tabs>
        </main>

        {/* Desktop: Stacked sections */}
        <main className="hidden lg:flex lg:flex-1 lg:flex-col overflow-y-auto">
          <section className="py-4">
            <div className="sticky top-0 bg-background z-40 border-b border-border px-5 py-3 flex items-center gap-3">
              <div className="w-1 h-6 bg-donnie" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Voice
              </span>
              <span className="font-mono text-[11px] text-muted-foreground ml-auto">
                {notes.filter(n => n.type === 'voice').length}
              </span>
            </div>
            {renderKanbanRow('voice')}
          </section>
          <div className="h-px bg-border mx-5" />
          <section className="py-4">
            <div className="sticky top-0 bg-background z-40 border-b border-border px-5 py-3 flex items-center gap-3">
              <div className="w-1 h-6 bg-mikey" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Meetings
              </span>
              <span className="font-mono text-[11px] text-muted-foreground ml-auto">
                {notes.filter(n => n.type === 'meeting').length}
              </span>
            </div>
            {renderKanbanRow('meeting')}
          </section>
        </main>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <TaskSidebar notes={notes} onToggleAction={handleToggleAction} />
        </div>
      </div>

      {/* Mobile: Floating task button + sheet */}
      <div className="lg:hidden">
        <Sheet open={taskSheetOpen} onOpenChange={setTaskSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-none bg-raph hover:bg-raph/90 text-white font-mono text-sm font-bold shadow-lg z-50"
            >
              {pendingTaskCount}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] p-0">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Tasks ({pendingTaskCount})
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(70vh-60px)]">
              <TaskSidebar notes={notes} onToggleAction={handleToggleAction} embedded />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeNote && (
          <div className={cn(
            'bg-card border border-border p-3 w-[280px] shadow-xl',
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
    </>
  );

  if (embedded) {
    return (
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="h-full flex flex-col bg-background">
          {content}
        </div>
      </DndContext>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="font-mono text-sm font-bold tracking-[0.25em] uppercase">
              PLAUD
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        {content}
      </div>
    </DndContext>
  );
}
