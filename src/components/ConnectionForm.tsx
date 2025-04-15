
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { DatabaseConnection } from '@/types/database';
import api from '@/utils/api';

// Validation schema mirroring backend, but potentially adjusted for frontend needs
const connectionFormSchema = z.object({
  name: z.string().min(1, "Connection name is required"),
  type: z.enum(["mysql", "postgresql", "mongodb", "sqlite"]),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().int().positive("Port must be a positive integer"), // Use coerce for string input
  database: z.string().min(1, "Database name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  ssl: z.boolean().optional().default(false), // Default to false for simplicity in form
});

type ConnectionFormValues = z.infer<typeof connectionFormSchema>;

interface ConnectionFormProps {
  onSuccess?: () => void; // Optional callback on successful submission
  onCancel?: () => void; // Optional callback for cancellation
  connection?: DatabaseConnection | null; // Optional connection data for editing
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ 
  onSuccess, 
  onCancel,
  connection 
}) => {
  const { getFirebaseToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionFormSchema),
    defaultValues: {
      name: connection?.name || '',
      type: (connection?.type as any) || 'postgresql', // Type cast since types might not match exactly
      host: '',
      port: undefined, // Default to empty for number input
      database: '',
      username: '',
      password: '',
      ssl: false,
    },
  });

  // Update form values when editing an existing connection
  useEffect(() => {
    if (connection) {
      // We would typically fetch the connection details here
      // For now, we just pre-fill what we have
      form.reset({
        name: connection.name,
        type: (connection.type as any),
        host: '', // These would come from the API
        port: undefined,
        database: '',
        username: '',
        password: '',
        ssl: false,
      });
    }
  }, [connection, form]);

  const onSubmit = async (data: ConnectionFormValues) => {
    setIsLoading(true);
    const { port, ...restData } = data; // Separate port for potential parsing if needed

    console.log('Form Data:', data); // Log form data for debugging

    try {
      const token = await getFirebaseToken();
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      let response;
      if (connection) {
        // Update existing connection
        response = await api.put(`/api/connections/${connection.id}`, {
          ...restData,
          port: Number(port)
        });
        toast.success('Database connection updated successfully!');
      } else {
        // Create new connection
        response = await api.post('/api/connections', {
          ...restData,
          port: Number(port)
        });
        toast.success('Database connection created successfully!');
      }

      console.log('Connection response:', response.data);
      form.reset(); // Reset form after successful submission
      onSuccess?.(); // Call success callback if provided

    } catch (error) {
      console.error('Failed to save connection:', error);
      toast.error(`Failed to ${connection ? 'update' : 'create'} connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection Name</FormLabel>
              <FormControl>
                <Input placeholder="My PostgreSQL DB" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Input placeholder="localhost or IP address" {...field} />
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
                {/* Use input type="number" but handle potential string value via zod coerce */}
                <Input type="number" placeholder="5432" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.value)} />
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
                <Input placeholder="mydatabase" {...field} />
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
                <Input placeholder="admin" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ssl"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
               <FormControl>
                 <Checkbox
                   checked={field.value}
                   onCheckedChange={field.onChange}
                 />
               </FormControl>
               <div className="space-y-1 leading-none">
                 <FormLabel>
                   Use SSL/TLS Connection
                 </FormLabel>
               </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
             <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
               Cancel
             </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {connection ? 'Update Connection' : 'Create Connection'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
