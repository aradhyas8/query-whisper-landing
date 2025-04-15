
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatThread } from '@/types/database';

interface ThreadItemProps {
  thread: ChatThread;
  isActive: boolean;
  onClick: () => void;
}

const ThreadItem = ({ thread, isActive, onClick }: ThreadItemProps) => {
  return (
    <button
      className={cn(
        "w-full text-left py-1 px-2 text-sm rounded-md mb-1 hover:bg-muted/50",
        isActive ? "bg-muted font-medium" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <MessageSquare className="h-3 w-3 mr-2 text-muted-foreground" />
        <span>{thread.name}</span>
      </div>
    </button>
  );
};

export default ThreadItem;
