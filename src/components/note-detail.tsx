'use client';

import { Note, ColumnId, COLUMNS } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface NoteDetailProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
  onMove: (noteId: string, column: ColumnId) => void;
  onToggleAction: (noteId: string, actionIndex: number) => void;
}

export function NoteDetail({ note, open, onClose, onMove, onToggleAction }: NoteDetailProps) {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="space-y-2">
            <Badge
              className={cn(
                'font-mono text-[9px] uppercase tracking-widest rounded-none px-2.5 py-1',
                note.type === 'voice'
                  ? 'bg-donnie text-white hover:bg-donnie'
                  : 'bg-mikey text-white hover:bg-mikey'
              )}
            >
              {note.type}
            </Badge>
            <DialogTitle className="text-xl font-semibold leading-tight">
              {note.title}
            </DialogTitle>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              {note.date}
            </p>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Synopsis */}
            <section>
              <h4 className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">
                Synopsis
              </h4>
              <p className="text-[15px] leading-relaxed">{note.synopsis}</p>
            </section>

            {/* Takeaways */}
            {note.takeaways.length > 0 && (
              <section>
                <h4 className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">
                  Takeaways
                </h4>
                <ul className="space-y-0">
                  {note.takeaways.map((t, i) => (
                    <li key={i} className="py-2.5 border-b border-border text-[14px] leading-snug">
                      <span className="text-muted-foreground mr-2">—</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Actions */}
            {note.actions.length > 0 && (
              <section>
                <h4 className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">
                  Actions
                </h4>
                <ul className="space-y-0">
                  {note.actions.map((action, i) => (
                    <li key={i} className="py-3 border-b border-border flex items-start gap-3">
                      <Checkbox
                        checked={action.done}
                        onCheckedChange={() => onToggleAction(note.id, i)}
                        className="mt-0.5"
                      />
                      <span className={cn(
                        'text-[14px] leading-snug',
                        action.done && 'line-through text-muted-foreground'
                      )}>
                        {action.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Transcript */}
            <section>
              <h4 className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">
                Transcript
              </h4>
              <div className="bg-background border border-border p-4 text-[14px] leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                {note.transcript.split(/(\d{2}:\d{2}:\d{2})/g).map((part, i) => (
                  part.match(/^\d{2}:\d{2}:\d{2}$/) ? (
                    <span key={i} className="block mt-3 first:mt-0 mb-1 font-mono text-[10px] text-leo tracking-wider">
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Move buttons */}
        <div className="p-4 border-t border-border flex gap-2">
          {COLUMNS.filter(c => c.id !== note.column).map(col => (
            <Button
              key={col.id}
              variant={col.id === 'done' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 font-mono text-[10px] uppercase tracking-wider rounded-none"
              onClick={() => {
                onMove(note.id, col.id);
                onClose();
              }}
            >
              {col.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
