
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'mongodb' | 'sqlite';
  status: 'connected' | 'disconnected' | 'error';
  host: string;
}

interface AddConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editConnection?: DatabaseConnection | null;
}

// Connection Form Schema
const formSchema = z.object({
  name: z.string().min(1, "Connection name is required"),
  type: z.enum(["postgres", "mysql", "mongodb", "sqlite"]),
  connectionString: z.string().min(1, "Connection string is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const AddConnectionDialog = ({ 
  open, 
  onOpenChange,
  editConnection 
}: AddConnectionDialogProps) => {
  const isEditing = !!editConnection;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editConnection?.name || "",
      type: editConnection?.type || "postgres",
      connectionString: editConnection?.host || "",
      username: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (editConnection) {
      form.reset({
        name: editConnection.name,
        type: editConnection.type,
        connectionString: editConnection.host,
        username: "", // We don't pre-fill these for security
        password: "", // We don't pre-fill these for security
      });
    } else {
      form.reset({
        name: "",
        type: "postgres",
        connectionString: "",
        username: "",
        password: "",
      });
    }
  }, [editConnection, form]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Database connection data:', data);
      
      toast.success(isEditing 
        ? "Database connection updated successfully" 
        : "Database connection added successfully"
      );
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error with database connection:', error);
      toast.error(isEditing 
        ? "Failed to update database connection" 
        : "Failed to add database connection"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Database Connection</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your database connection details below." 
              : "Enter your database connection details below."
            }
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
                      <SelectItem value="postgres">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (isEditing ? "Updating..." : "Saving...") 
                  : (isEditing ? "Update Connection" : "Save Connection")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
