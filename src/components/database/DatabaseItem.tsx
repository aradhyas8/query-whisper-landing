
import React, { useState } from 'react';
import { Database, Trash2, ChevronRight, ChevronDown, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { DatabaseConnection, ChatThread } from '@/types/database';
import ThreadItem from './ThreadItem';
import { ConnectionHealth, ConnectionHealthStatus } from './schema';

interface DatabaseItemProps {
  database: DatabaseConnection;
  isExpanded: boolean;
  activeThreadId?: string | null;
  onSelectThread: (threadId: string) => void;
  onDelete: (event: React.MouseEvent) => void;
  onAddThread?: (databaseId: string) => void;
}

const HealthStatusIcon = ({ status }: { status: ConnectionHealth }) => {
  switch (status) {
    case ConnectionHealthStatus.HEALTHY:
      return <CheckCircle className="h-4 w-4 text-[#2DD4BF]" />;
    case ConnectionHealthStatus.WARNING:
      return <AlertCircle className="h-4 w-4 text-amber-400" />;
    case ConnectionHealthStatus.ERROR:
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const DatabaseItem = ({ 
  database, 
  isExpanded, 
  activeThreadId, 
  onSelectThread, 
  onDelete,
  onAddThread
}: DatabaseItemProps) => {
  const [starredThreads, setStarredThreads] = useState<string[]>([]);
  
  const toggleStar = (threadId: string) => {
    setStarredThreads(prev => 
      prev.includes(threadId) 
        ? prev.filter(id => id !== threadId) 
        : [...prev, threadId]
    );
  };
  
  const healthStatus = database.healthStatus || ConnectionHealthStatus.UNKNOWN;
  
  return (
    <AccordionItem key={database.id} value={database.id} className="border-b-0">
      <AccordionTrigger className="py-2 px-3 text-sm font-medium hover:bg-[#1A1A1A] hover:no-underline rounded-md group relative transition-all duration-200">
        <div className="flex items-center w-full">
          <div className="flex items-center flex-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mr-2">
                    <HealthStatusIcon status={healthStatus} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {healthStatus === ConnectionHealthStatus.HEALTHY && "Connection healthy"}
                  {healthStatus === ConnectionHealthStatus.WARNING && "Connection has issues"}
                  {healthStatus === ConnectionHealthStatus.ERROR && "Connection failed"}
                  {healthStatus === ConnectionHealthStatus.UNKNOWN && "Connection status unknown"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="mr-1 font-medium">{database.name}</span>
            <Badge 
              variant="outline" 
              className="text-xs bg-transparent h-5 border-[#2A2A2A] text-muted-foreground uppercase"
            >
              {database.type}
            </Badge>
          </div>
          
          {/* Delete button - Always visible */}
          {!database.isDefault && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0.5 ml-2 hover:bg-[#222] hover:text-red-400 transition-colors"
              onClick={onDelete}
              aria-label={`Delete ${database.name} connection`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-4 pr-1 py-1">
          {database.threads.map((thread) => (
            <ThreadItem 
              key={thread.id}
              thread={thread}
              isActive={activeThreadId === thread.id}
              onClick={() => onSelectThread(thread.id)}
              isStarred={starredThreads.includes(thread.id)}
              onToggleStar={toggleStar}
            />
          ))}
          {database.threads.length === 0 && (
            <div className="text-xs text-muted-foreground py-2 px-3">
              No queries yet. Start a new conversation!
            </div>
          )}
          
          {onAddThread && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-muted-foreground hover:text-[#2DD4BF] py-1.5 px-3 mt-1"
              onClick={() => onAddThread(database.id)}
            >
              <span className="text-[#2DD4BF] mr-1">+</span> New Conversation
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DatabaseItem;
