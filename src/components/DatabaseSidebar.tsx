
import React from 'react';
import { Plus, Database, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { DatabaseConnection } from '@/types/database';
import { cn } from '@/lib/utils';

interface DatabaseSidebarProps {
  databases: DatabaseConnection[];
  onSelectThread: (databaseId: string, threadId: string) => void;
  activeThread?: { databaseId: string; threadId: string } | null;
}

const DatabaseSidebar = ({ 
  databases, 
  onSelectThread,
  activeThread 
}: DatabaseSidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal bg-muted hover:bg-muted/80 text-muted-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Connection
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-1">
        <Accordion type="multiple" defaultValue={activeThread ? [activeThread.databaseId] : []} className="w-full">
          {databases.map((db) => (
            <AccordionItem key={db.id} value={db.id} className="border-b-0">
              <AccordionTrigger className="py-2 px-3 text-sm hover:no-underline hover:bg-muted/50 rounded-md">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <span className="truncate">{db.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3">
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="justify-start text-muted-foreground hover:text-white hover:bg-muted/80 pl-9"
                  >
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    New Chat
                  </Button>
                  
                  {db.threads.map((thread) => (
                    <Button
                      key={thread.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectThread(db.id, thread.id)}
                      className={cn(
                        "justify-start text-muted-foreground hover:text-white hover:bg-muted/80 pl-9",
                        activeThread?.databaseId === db.id && activeThread?.threadId === thread.id && 
                        "bg-secondary text-white"
                      )}
                    >
                      <MessageSquare className="mr-2 h-3.5 w-3.5" />
                      <span className="truncate">{thread.name}</span>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default DatabaseSidebar;
