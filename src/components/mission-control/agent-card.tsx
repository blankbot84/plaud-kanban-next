'use client';

import { Agent, formatRelativeTime } from '@/lib/mission-control-data';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

const statusColors: Record<Agent['status'], string> = {
  idle: 'bg-muted-foreground',
  working: 'bg-raph',
  blocked: 'bg-leo',
};

const statusLabels: Record<Agent['status'], string> = {
  idle: 'Idle',
  working: 'Working',
  blocked: 'Blocked',
};

const agentColors: Record<string, string> = {
  leo: 'border-l-leo',
  raph: 'border-l-raph',
  donnie: 'border-l-donnie',
  mikey: 'border-l-mikey',
};

export function AgentCard({ agent, onClick }: AgentCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left bg-card border border-border p-4 transition-all',
        'hover:border-muted-foreground cursor-pointer',
        'border-l-[3px]',
        agentColors[agent.color] || 'border-l-muted-foreground'
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{agent.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm">{agent.name}</h3>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider truncate">
            {agent.role}
          </p>
        </div>
        {/* Status dot */}
        <div className="flex items-center gap-1.5">
          <span className={cn('w-2 h-2 rounded-full', statusColors[agent.status])} />
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            {statusLabels[agent.status]}
          </span>
        </div>
      </div>

      {/* Focus area */}
      <div className="mb-2 min-h-[40px]">
        {agent.focus ? (
          <p className="text-sm text-foreground line-clamp-2 leading-snug">
            {agent.focus}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Awaiting assignment
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
        Active {formatRelativeTime(agent.lastActive)}
      </div>
    </button>
  );
}
