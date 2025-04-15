
import React from 'react';
import { Database, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { DatabaseConnection, ChatThread } from '@/types/database';
import ThreadItem from './ThreadItem';

interface DatabaseItemProps {
  database: DatabaseConnection;
  isExpanded: boolean;
  activeThreadId?: string | null;
  onSelectThread: (threadId: string) => void;
  onDelete: (event: React.MouseEvent) => void;
}

const DatabaseItem = ({ 
  database, 
  isExpanded, 
  activeThreadId, 
  onSelectThread, 
  onDelete 
}: DatabaseItemProps) => {
  return (
    <AccordionItem key={database.id} value={database.id} className="border-b-0">
      <AccordionTrigger className="py-2 px-3 text-sm font-medium hover:bg-muted/50 hover:no-underline rounded-md group relative">
        <div className="flex items-center w-full">
          <Database className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="flex-1 text-left">{database.name}</span>
          
          {/* Delete button - Always visible */}
          {!database.isDefault && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0.5 ml-2"
              onClick={onDelete}
              aria-label={`Delete ${database.name} connection`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-4 pr-1">
          {database.threads.map((thread) => (
            <ThreadItem 
              key={thread.id}
              thread={thread}
              isActive={activeThreadId === thread.id}
              onClick={() => onSelectThread(thread.id)}
            />
          ))}
          {database.threads.length === 0 && (
            <div className="text-xs text-muted-foreground py-1 px-2">
              No queries yet. Start a new conversation!
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DatabaseItem;
