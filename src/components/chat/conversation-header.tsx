'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getIcon, getAgentColors } from '@/lib/icons';

export interface ConversationHeaderAgent {
  id: string;
  icon: string;
  name: string;
  role: string;
}

interface ConversationHeaderProps {
  agent: ConversationHeaderAgent | null;
  onTap: () => void;
  className?: string;
}

export function ConversationHeader({ agent, onTap, className }: ConversationHeaderProps) {
  if (!agent) {
    return (
      <button
        onClick={onTap}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'hover:bg-muted/50 transition-colors',
          'min-h-[48px] touch-manipulation',
          className
        )}
      >
        <span className="text-muted-foreground text-sm">Select an agent...</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
    );
  }

  const Icon = getIcon(agent.icon);
  const colors = getAgentColors(agent.id);

  return (
    <button
      onClick={onTap}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg',
        'hover:bg-muted/50 transition-colors',
        'min-h-[48px] touch-manipulation',
        className
      )}
    >
      <div className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full',
        colors.bg
      )}>
        <Icon className={cn('h-5 w-5', colors.text)} aria-label={agent.name} />
      </div>
      <div className="flex flex-col items-start">
        <span className="font-semibold text-foreground leading-tight">
          {agent.name}
        </span>
        <span className="text-xs text-muted-foreground leading-tight">
          {agent.role}
        </span>
      </div>
      <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
    </button>
  );
}
