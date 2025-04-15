import React, { useState } from 'react';
import { Plus, Database, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DatabaseConnection } from '@/types/database';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import api from "../utils/api";
import axios from 'axios';

interface DatabaseSidebarProps {
  databases: DatabaseConnection[];
  onSelectThread: (databaseId: string, threadId: string) => void;
  activeThread?: { databaseId: string; threadId: string } | null;
  onConnectionAdded?: (connection: DatabaseConnection) => void;
  onConnectionDeleted?: (connectionId: string) => void; // New prop for handling deletion
}

// Update the form schema to match our API
const formSchema = z.object({
  name: z.string().min(1, "Connection name is required"),
  type: z.enum(["mysql", "postgresql", "mongodb", "sqlite"]),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().int().positive("Port must be a positive number"),
  database: z.string().min(1, "Database name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  ssl: z.boolean().optional().default(true)
});

type FormValues = z.infer<typeof formSchema>;

const DatabaseSidebar = ({ 
  databases, 
  onSelectThread,
  activeThread,
  onConnectionAdded,
  onConnectionDeleted // Add the new prop
}: DatabaseSidebarProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "mysql",
      host: "",
      port: 3306,
      database: "",
      username: "",
      password: "",
      ssl: true,
    },
  });

  // Handler for deleting a database connection
  const handleDeleteConnection = async (connectionId: string, event: React.MouseEvent) => {
    // Stop event propagation to prevent expanding/collapsing the accordion item
    event.stopPropagation();
    
    try {
      // Call the API to delete the connection
      await api.delete(`/api/connections/${connectionId}`);
      
      toast.success("Database connection removed successfully");
      
      // Call the callback if provided
      if (onConnectionDeleted) {
        onConnectionDeleted(connectionId);
      }
    } catch (error) {
      console.error('Error deleting database connection:', error);
      let errorMessage = "Failed to delete database connection";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  // Handle accordion state to manage expanded items
  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value);
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/api/connections', data);
      
      // Create a formatted connection object with empty threads
      const newConnection: DatabaseConnection = {
        id: response.data.id,
        name: response.data.name,
        type: response.data.type,
        threads: [
          {
            id: `thread-${response.data.id}-1`,
            name: `Query ${response.data.name} Data`,
            lastMessage: `Tell me about the data in ${response.data.name}`,
            timestamp: new Date()
          }
        ]
      };
      
      toast.success("Database connection added successfully");
      form.reset();
      setOpen(false);
      
      // Call the callback with the properly formatted connection
      if (onConnectionAdded) {
        onConnectionAdded(newConnection);
      }
    } catch (error) {
      console.error('Error adding database connection:', error);
      let errorMessage = "Failed to add database connection";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal bg-muted hover:bg-muted/80 text-muted-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Database Connection</DialogTitle>
              <DialogDescription>
                Enter your database connection details below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Database" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select database type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mysql">MySQL</SelectItem>
                          <SelectItem value="postgresql">PostgreSQL</SelectItem>
                          <SelectItem value="mongodb">MongoDB</SelectItem>
                          <SelectItem value="sqlite">SQLite</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host</FormLabel>
                      <FormControl>
                        <Input placeholder="localhost" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="database"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ssl"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>SSL Connection</FormLabel>
                        <FormDescription>
                          Use SSL/TLS for secure database connection
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Connection"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
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
              <AccordionItem key={db.id} value={db.id} className="border-b-0">
                <AccordionTrigger className="py-2 px-3 text-sm font-medium hover:bg-muted/50 hover:no-underline rounded-md group relative">
                  <div className="flex items-center w-full">
                    <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="flex-1 text-left">{db.name}</span>
                    
                    {/* Delete button - Always visible */}
                    {!db.isDefault && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0.5 ml-2"
                        onClick={(e) => handleDeleteConnection(db.id, e)}
                        aria-label={`Delete ${db.name} connection`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 pr-1">
                    {db.threads.map((thread) => (
                      <button
                        key={thread.id}
                        className={cn(
                          "w-full text-left py-1 px-2 text-sm rounded-md mb-1 hover:bg-muted/50",
                          activeThread?.databaseId === db.id && activeThread?.threadId === thread.id
                            ? "bg-muted font-medium"
                            : ""
                        )}
                        onClick={() => onSelectThread(db.id, thread.id)}
                      >
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span>{thread.name}</span>
                        </div>
                      </button>
                    ))}
                    {db.threads.length === 0 && (
                      <div className="text-xs text-muted-foreground py-1 px-2">
                        No queries yet. Start a new conversation!
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  );
};

export default DatabaseSidebar;
