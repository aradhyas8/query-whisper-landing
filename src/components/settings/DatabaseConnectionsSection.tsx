
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Database as DatabaseIcon, Check, AlertCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { AddConnectionDialog } from './AddConnectionDialog';

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'mongodb' | 'sqlite';
  status: 'connected' | 'disconnected' | 'error';
  host: string;
}

export const DatabaseConnectionsSection = () => {
  // Mock data - in a real app, this would come from your API
  const [connections, setConnections] = useState<DatabaseConnection[]>([
    { 
      id: '1', 
      name: 'Production DB', 
      type: 'postgres', 
      status: 'connected',
      host: 'db.example.com'
    },
    { 
      id: '2', 
      name: 'Analytics Database', 
      type: 'mysql', 
      status: 'connected',
      host: 'analytics.example.com'
    },
    { 
      id: '3', 
      name: 'User Data', 
      type: 'mongodb', 
      status: 'error',
      host: 'mongodb.example.com'
    }
  ]);

  const [isAddConnectionDialogOpen, setIsAddConnectionDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<DatabaseConnection | null>(null);
  const [removingConnection, setRemovingConnection] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    return <DatabaseIcon className="h-4 w-4" />;
  };

  const handleEditConnection = (connection: DatabaseConnection) => {
    setEditingConnection(connection);
    setIsAddConnectionDialogOpen(true);
  };

  const handleRemoveConnection = (id: string) => {
    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      setConnections(connections.filter(conn => conn.id !== id));
      toast.success('Connection removed successfully');
      setRemovingConnection(null);
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Database Connections</CardTitle>
              <CardDescription>
                Manage your database connections
              </CardDescription>
            </div>
            <Button 
              onClick={() => {
                setEditingConnection(null);
                setIsAddConnectionDialogOpen(true);
              }} 
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Connection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {connections.length > 0 ? (
            <div className="space-y-2">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-3 border border-border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary p-2 rounded">
                      {getTypeIcon(connection.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{connection.name}</p>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(connection.status)}
                          <Badge variant={connection.status === 'connected' ? 'secondary' : 'destructive'}>
                            {connection.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {connection.type} • {connection.host}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditConnection(connection)}
                    >
                      <span className="sr-only">Edit</span>
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100/10"
                          onClick={() => setRemovingConnection(connection.id)}
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the connection "{connection.name}" and all associated data. 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveConnection(connection.id)}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isDeleting && removingConnection === connection.id
                              ? "Removing..."
                              : "Yes, remove connection"
                            }
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No database connections yet.</p>
              <p className="text-muted-foreground text-sm">
                Add your first connection to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddConnectionDialog 
        open={isAddConnectionDialogOpen}
        onOpenChange={setIsAddConnectionDialogOpen}
        editConnection={editingConnection}
      />
    </>
  );
};
