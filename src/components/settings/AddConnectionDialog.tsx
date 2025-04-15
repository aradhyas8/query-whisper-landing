
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ConnectionForm } from '@/components/ConnectionForm';
import { DatabaseConnection } from '@/types/database';

interface AddConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editConnection?: DatabaseConnection | null;
}

export const AddConnectionDialog: React.FC<AddConnectionDialogProps> = ({
  open,
  onOpenChange,
  editConnection
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editConnection ? 'Edit Connection' : 'Add Database Connection'}</DialogTitle>
          <DialogDescription>
            {editConnection 
              ? 'Edit your database connection details below.' 
              : 'Connect to your database to start querying data using natural language.'}
          </DialogDescription>
        </DialogHeader>
        
        <ConnectionForm 
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
          connection={editConnection}
        />
      </DialogContent>
    </Dialog>
  );
};
