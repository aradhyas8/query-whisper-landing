
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
  onAddThread?: (databaseId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const DatabaseSidebar = ({ 
  databases, 
  onSelectThread,
  activeThread,
  onConnectionAdded,
  onConnectionDeleted,
  onAddThread,
  isCollapsed = false,
  onToggleCollapse
}: DatabaseSidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);

  // Handle accordion state to manage expanded items
  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value);
  };

  // Handler for deleting a database connection
  const handleDeleteConnection = async (connectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const success = await deleteConnection(connectionId);
    
    if (success && onConnectionDeleted) {
      onConnectionDeleted(connectionId);
    }
  };
  
  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-64'}`}>
      {/* New Connection Button */}
      <Button 
        variant="outline" 
        className={`mb-3 mx-2 bg-transparent border border-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-[#2DD4BF] transition-all duration-200 flex items-center justify-center ${isCollapsed ? 'p-2' : ''}`}
        onClick={() => setIsConnectionDialogOpen(true)}
      >
        <Plus className="h-4 w-4 mr-1" />
        {!isCollapsed && <span>New Connection</span>}
      </Button>
      
      <ConnectionDialog 
        open={isConnectionDialogOpen} 
        onOpenChange={setIsConnectionDialogOpen}
        onConnectionAdded={onConnectionAdded} 
      />
      
      <ScrollArea className="flex-1 pr-1">
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
                onAddThread={onAddThread}
              />
            ))}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  );
};

export default DatabaseSidebar;
