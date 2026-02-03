'use client';

import { useState } from 'react';
import { KanbanBoard } from './kanban-board';
import { SquadDashboard } from './mission-control/squad-dashboard';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

type View = 'plaud' | 'mission-control';

export function AppShell() {
  const [view, setView] = useState<View>('plaud');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with nav */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        {/* Title bar */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="font-mono text-sm font-bold tracking-[0.25em] uppercase">
              {view === 'plaud' ? 'PLAUD' : 'MISSION'}
            </h1>
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
              {view === 'plaud' ? 'NOTES' : 'CONTROL'}
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* View switcher */}
        <div className="flex border-t border-border">
          <button
            onClick={() => setView('plaud')}
            className={cn(
              'flex-1 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-colors',
              'border-b-2',
              view === 'plaud'
                ? 'border-b-donnie text-foreground'
                : 'border-b-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <span className={cn('w-2 h-2 inline-block mr-2', view === 'plaud' ? 'bg-donnie' : 'bg-muted-foreground')} />
            Plaud Notes
          </button>
          <button
            onClick={() => setView('mission-control')}
            className={cn(
              'flex-1 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-colors',
              'border-b-2',
              view === 'mission-control'
                ? 'border-b-raph text-foreground'
                : 'border-b-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <span className={cn('w-2 h-2 inline-block mr-2', view === 'mission-control' ? 'bg-raph' : 'bg-muted-foreground')} />
            Mission Control
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {view === 'plaud' ? (
          <KanbanBoard embedded />
        ) : (
          <SquadDashboard />
        )}
      </main>
    </div>
  );
}
