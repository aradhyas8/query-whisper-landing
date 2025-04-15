
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion
} from '@/components/ui/accordion';

import { DatabaseConnection } from '@/types/database';
import ConnectionDialog from './ConnectionDialog';
import DatabaseItem from './DatabaseItem';
import { deleteConnection } from '@/services/databaseService';

interface DatabaseSidebarProps {
  databases: DatabaseConnection[];
  onSelectThread: (databaseId: string, threadId: string) => void;
  activeThread?: { databaseId: string; threadId: string } | null;
  onConnectionAdded?: (connection: DatabaseConnection) => void;
  onConnectionDeleted?: (connectionId: string) => void;
}

const DatabaseSidebar = ({ 
  databases, 
  onSelectThread,
  activeThread,
  onConnectionAdded,
  onConnectionDeleted
}: DatabaseSidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Handle accordion state to manage expanded items
  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value);
  };

  // Handler for deleting a database connection
  const handleDeleteConnection = async (connectionId: string, event: React.MouseEvent) => {
    // Stop event propagation to prevent expanding/collapsing the accordion item
    event.stopPropagation();
    
    const success = await deleteConnection(connectionId);
    
    // Call the callback if provided and deletion was successful
    if (success && onConnectionDeleted) {
      onConnectionDeleted(connectionId);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ConnectionDialog onConnectionAdded={onConnectionAdded} />
      
      <ScrollArea className="flex-1">
        {databases.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No database connections yet.</p>
            <p className="text-sm mt-1">Add a new connection to get started.</p>
          </div>
        ) : (
          <Accordion 
            type="multiple" 
            className="w-full px-1"
            value={expandedItems}
            onValueChange={handleAccordionChange}
          >
            {databases.map((db) => (
              <DatabaseItem
                key={db.id}
                database={db}
                isExpanded={expandedItems.includes(db.id)}
                activeThreadId={activeThread?.databaseId === db.id ? activeThread.threadId : null}
                onSelectThread={(threadId) => onSelectThread(db.id, threadId)}
                onDelete={(e) => handleDeleteConnection(db.id, e)}
              />
            ))}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  );
};

export default DatabaseSidebar;
