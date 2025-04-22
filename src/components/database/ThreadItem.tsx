
import React from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatThread } from '@/types/database';
import { motion } from 'framer-motion';

interface ThreadItemProps {
  thread: ChatThread;
  isActive: boolean;
  onClick: () => void;
  isStarred?: boolean;
  onToggleStar?: (threadId: string) => void;
}

const ThreadItem = ({ 
  thread, 
  isActive, 
  onClick, 
  isStarred = false,
  onToggleStar
}: ThreadItemProps) => {
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleStar) {
      onToggleStar(thread.id);
    }
  };
  
  return (
    <motion.button
      whileHover={{ y: -1, transition: { duration: 0.2 } }}
      className={cn(
        "w-full text-left py-2 px-3 text-sm rounded-lg mb-1 hover:bg-muted/50 transition-all duration-200",
        isActive ? "bg-muted border-l-2 border-[#2DD4BF] font-medium" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <MessageSquare className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
        <span className="flex-1 truncate">{thread.name}</span>
        {onToggleStar && (
          <Star 
            className={cn(
              "h-3.5 w-3.5 ml-1 transition-colors", 
              isStarred ? "text-[#2DD4BF] fill-[#2DD4BF]" : "text-muted-foreground hover:text-[#2DD4BF]"
            )}
            onClick={handleStarClick}
          />
        )}
      </div>
      {thread.lastMessage && (
        <p className="text-xs text-muted-foreground mt-0.5 truncate pl-5">
          {thread.lastMessage}
        </p>
      )}
    </motion.button>
  );
};

export default ThreadItem;
