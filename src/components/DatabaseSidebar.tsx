
import React, { useState } from 'react';
import { Plus, Database, MessageSquare } from 'lucide-react';
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
  FormMessage 
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

interface DatabaseSidebarProps {
  databases: DatabaseConnection[];
  onSelectThread: (databaseId: string, threadId: string) => void;
  activeThread?: { databaseId: string; threadId: string } | null;
}

// Add Connection Form Schema
const formSchema = z.object({
  name: z.string().min(1, "Connection name is required"),
  databaseType: z.enum(["MySQL", "PostgreSQL", "MongoDB", "Snowflake"]),
  connectionString: z.string().min(1, "Connection string is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const DatabaseSidebar = ({ 
  databases, 
  onSelectThread,
  activeThread 
}: DatabaseSidebarProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      databaseType: "MySQL",
      connectionString: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Database connection data:', data);
      
      toast.success("Database connection added successfully");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding database connection:', error);
      toast.error("Failed to add database connection");
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
                  name="databaseType"
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
                          <SelectItem value="MySQL">MySQL</SelectItem>
                          <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                          <SelectItem value="MongoDB">MongoDB</SelectItem>
                          <SelectItem value="Snowflake">Snowflake</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="connectionString"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection String</FormLabel>
                      <FormControl>
                        <Input placeholder="localhost:3306/mydb" {...field} />
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
