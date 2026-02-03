'use client';

import { Activity, getAgent, formatRelativeTime } from '@/lib/mission-control-data';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

const activityIcons: Record<Activity['type'], string> = {
  task_created: '📝',
  task_assigned: '👤',
  status_changed: '🔄',
  comment_posted: '💬',
  document_created: '📄',
  agent_status: '⚡',
};

export function ActivityFeed({ activities, maxItems }: ActivityFeedProps) {
  const items = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <div className="space-y-0">
      {items.map((activity, index) => {
        const agent = getAgent(activity.agentId);
        if (!agent) return null;

        return (
          <div
            key={activity.id}
            className={cn(
              'py-3 px-4 flex gap-3 items-start border-b border-border last:border-b-0',
              'hover:bg-accent/30 transition-colors'
            )}
          >
            {/* Agent emoji */}
            <span className="text-lg flex-shrink-0" title={agent.name}>
              {agent.emoji}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug">
                <span className="font-medium">{agent.name}</span>
                <span className="text-muted-foreground mx-1.5">·</span>
                <span>{activity.description}</span>
              </p>
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mt-1">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>

            {/* Activity type icon */}
            <span className="text-sm flex-shrink-0 opacity-50" title={activity.type}>
              {activityIcons[activity.type]}
            </span>
          </div>
        );
      })}
      
      {items.length === 0 && (
        <p className="text-center py-8 text-sm text-muted-foreground">
          No recent activity
        </p>
      )}
    </div>
  );
}
