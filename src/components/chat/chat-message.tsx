'use client';

import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { getIcon, getAgentColors } from '@/lib/icons';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  agentId?: string;
  agentIcon?: string;
}

export function ChatMessage({ role, content, agentId, agentIcon }: ChatMessageProps) {
  const isUser = role === 'user';
  
  // Get icon and colors for agent, fallback to bot icon
  const Icon = isUser ? User : getIcon(agentIcon || 'bot');
  const colors = isUser 
    ? { bg: 'bg-primary', text: 'text-primary-foreground' }
    : agentId 
      ? getAgentColors(agentId)
      : { bg: 'bg-muted', text: 'text-muted-foreground' };
  
  return (
    <div className={cn(
      'flex gap-3 p-4 rounded-lg',
      isUser ? 'bg-muted/50' : 'bg-background'
    )}>
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        colors.bg
      )}>
        <Icon className={cn('h-4 w-4', colors.text)} />
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <p className="text-sm font-medium leading-none">
          {isUser ? 'You' : 'Assistant'}
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
