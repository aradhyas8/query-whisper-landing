<<<<<<< HEAD

import React, { useState } from 'react';
import { Loader2, Send, MessageSquare, History, Settings, User, LogOut, ChevronDown, ChevronRight, CheckCircle, XCircle, Code, Database as DatabaseIcon, FileText } from 'lucide-react';
=======
import React, { useState, useEffect } from 'react';
import { Loader2, Send, MessageSquare, History, Settings, User, LogOut } from 'lucide-react';
>>>>>>> 4684c61 (Backend DB connected)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/FadeIn';
import DatabaseSidebar from '@/components/DatabaseSidebar';
import { DatabaseConnection, ChatThread } from '@/types/database';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '@/utils/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';

// Types for messages
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'code' | 'text' | 'error' | 'success';
  metadata?: {
    executionTime?: string;
    rowsAffected?: number;
    schema?: string;
    table?: string;
  };
}

// Form schema for database connection
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

const Dashboard = () => {
  const { logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to Query.io! Ask me anything about your database.',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<{ databaseId: string; threadId: string } | null>(null);
  const [databases, setDatabases] = useState<DatabaseConnection[]>([]);
  const [isLoadingDatabases, setIsLoadingDatabases] = useState(true);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    setIsLoadingDatabases(true);
    try {
      const response = await api.get('/api/connections');
      // Transform the API response to match the DatabaseConnection structure
      const connectionsData: DatabaseConnection[] = response.data.map((conn: any) => {
        // Generate some placeholder threads for each connection
        const threads: ChatThread[] = [
          {
            id: `thread-${conn.id}-1`,
            name: `Query ${conn.name} Data`,
            lastMessage: `Tell me about the data in ${conn.name}`,
            timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
          }
        ];
        
        return {
          id: conn.id,
          name: conn.name,
          type: conn.type as any, // Cast to match the expected type
          threads: threads
        };
      });
      
      setDatabases(connectionsData);
    } catch (error) {
      console.error('Error fetching database connections:', error);
      toast.error('Failed to load your database connections');
    } finally {
      setIsLoadingDatabases(false);
    }
  };

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock response based on the query
      let aiResponse: Message;
      
      if (inputMessage.toLowerCase().includes('select')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `
SELECT id, name, population, country_code 
FROM cities 
WHERE population > 1000000 
ORDER BY population DESC
LIMIT 10;

| id      | name       | population | country_code |
|---------|------------|------------|--------------|
| 1       | Tokyo      | 37400068   | JP           |
| 2       | Delhi      | 28514000   | IN           |
| 3       | Shanghai   | 25582000   | CN           |
| 4       | São Paulo  | 21650000   | BR           |
| 5       | Mexico City| 21581000   | MX           |
| 6       | Cairo      | 20076000   | EG           |
| 7       | Mumbai     | 19980000   | IN           |
| 8       | Beijing    | 19618000   | CN           |
| 9       | Dhaka      | 19578000   | BD           |
| 10      | Osaka      | 19281000   | JP           |
`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'code',
          metadata: {
            executionTime: '0.138s',
            rowsAffected: 10,
            schema: 'geo',
            table: 'cities'
          }
        };
      } else if (inputMessage.toLowerCase().includes('update') || 
                inputMessage.toLowerCase().includes('insert') || 
                inputMessage.toLowerCase().includes('delete')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `Operation completed successfully.`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'success',
          metadata: {
            executionTime: '0.043s',
            rowsAffected: 3,
            schema: 'geo',
            table: 'cities'
          }
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `Here's the data you requested based on your query: "${inputMessage}"`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Failed to generate response. Please try again.');
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: 'An error occurred while processing your query. Please check your syntax and try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'error',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle thread selection
  const handleSelectThread = (databaseId: string, threadId: string) => {
    setActiveThread({ databaseId, threadId });
    
    // Find the selected database and thread
    const selectedDb = databases.find(db => db.id === databaseId);
    const selectedThread = selectedDb?.threads.find(thread => thread.id === threadId);
    
    if (selectedThread) {
      // Load thread messages (simulated)
      setMessages([
        {
          id: '1',
          content: `You're now viewing the "${selectedThread.name}" thread from ${selectedDb?.name}.`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        },
        {
          id: '2',
          content: selectedThread.lastMessage,
          sender: 'user',
          timestamp: selectedThread.timestamp,
          type: 'text',
        },
        {
          id: '3',
          content: `
SELECT * FROM planets WHERE name = 'Earth';

| id      | name   | distance_from_sun | mass      | is_inhabited |
|---------|--------|-------------------|-----------|--------------|
| EA-1001 | Earth  | 1.0               | 5.97e24   | true         |
`,
          sender: 'ai',
          timestamp: new Date(selectedThread.timestamp.getTime() + 10000),
          type: 'code',
          metadata: {
            executionTime: '0.021s',
            rowsAffected: 1,
            schema: 'space',
            table: 'planets'
          }
        },
      ]);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation is handled in AuthContext
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

<<<<<<< HEAD
  // Function to render message content based on type
  const renderMessageContent = (message: Message) => {
    if (message.type === 'code') {
      return (
        <div className="w-full">
          <pre className="w-full whitespace-pre-wrap overflow-x-auto bg-[#0D0D0D] p-4 rounded-md text-sm font-mono border border-white/10">
            <code>{message.content}</code>
          </pre>
          {message.metadata && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="bg-[#0D0D0D] text-[#A0A0A0] hover:bg-[#0D0D0D]">
                {message.metadata.schema}.{message.metadata.table}
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {message.metadata.executionTime}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {message.metadata.rowsAffected} {message.metadata.rowsAffected === 1 ? 'row' : 'rows'}
              </span>
            </div>
          )}
        </div>
      );
    } else if (message.type === 'error') {
      return (
        <div className="flex items-start gap-2 text-red-500">
          <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{message.content}</span>
        </div>
      );
    } else if (message.type === 'success') {
      return (
        <div className="flex items-start gap-2 text-green-500">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <span>{message.content}</span>
            {message.metadata && (
              <div className="text-xs text-muted-foreground mt-1">
                {message.metadata.rowsAffected} {message.metadata.rowsAffected === 1 ? 'row' : 'rows'} affected • {message.metadata.executionTime}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return <span>{message.content}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212]">
=======
  const handleConnectionAdded = (newConnection: DatabaseConnection) => {
    setDatabases(prev => [...prev, newConnection]);
  };

  // Function to handle adding a new connection
  async function onSubmitConnection(data: FormValues) {
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
      setIsConnectionDialogOpen(false);
      
      // Add the new connection to state
      setDatabases(prev => [...prev, newConnection]);
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
    <div className="flex min-h-screen bg-queryio-background">
      {/* Connection Dialog */}
      <Dialog open={isConnectionDialogOpen} onOpenChange={setIsConnectionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Database Connection</DialogTitle>
            <DialogDescription>
              Enter your database connection details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitConnection)} className="space-y-4">
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>SSL Connection</FormLabel>
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
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-white hover:bg-gray-200 text-queryio-background"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Connection'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

>>>>>>> 4684c61 (Backend DB connected)
      <SidebarProvider>
        <Sidebar className="bg-[#0D0D0D] border-[#1E1E1E]">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                {isLoadingDatabases ? (
                  <div className="flex justify-center items-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <DatabaseSidebar 
                    databases={databases}
                    onSelectThread={handleSelectThread}
                    activeThread={activeThread}
                    onConnectionAdded={handleConnectionAdded}
                  />
                )}
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive tooltip="Chat">
                      <Link to="/app">
                        <MessageSquare className="text-white" />
                        <span>Chat</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="History">
                      <Link to="/app/history">
                        <History className="text-muted-foreground" />
                        <span>History</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Settings">
                      <Link to="/app/settings">
                        <Settings className="text-muted-foreground" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-[#1E1E1E] bg-[#121212]">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-medium tracking-tight">Databases</h1>
              <Badge variant="outline" className="bg-[#1A1A1A] text-[#A0A0A0]">Connection 3</Badge>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                    <Avatar className="border border-[#2A2A2A]">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback className="bg-[#1A1A1A] text-[#A0A0A0]">U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-[#2A2A2A]">
                  <DropdownMenuItem asChild className="hover:bg-[#222222]">
                    <Link to="/app/settings" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-[#222222] focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <FadeIn>
            <div className="flex flex-col flex-1 p-4 h-[calc(100vh-72px)]">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Messages */}
              <Card className="flex-1 mb-4 overflow-hidden bg-[#161616] border border-[#1E1E1E]">
                <ScrollArea className="h-[calc(100vh-180px)] p-4">
<<<<<<< HEAD
                  <div className="flex flex-col gap-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-[#1A1A1A] text-white p-4'
                              : 'bg-[#161616] text-[#E0E0E0] p-4 border border-[#1E1E1E]'
                          }`}
                        >
                          {renderMessageContent(message)}
                          <p className="text-xs opacity-50 mt-2">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
=======
                  <div className="flex flex-col gap-4">
                    {isLoadingDatabases ? (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading your databases...</span>
                      </div>
                    ) : databases.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <h3 className="text-lg font-medium mb-2">No databases connected</h3>
                        <p className="text-muted-foreground mb-4">
                          Connect a database to start querying your data with natural language.
                        </p>
                        <Button 
                          onClick={() => setIsConnectionDialogOpen(true)}
                          className="bg-white hover:bg-gray-200 text-queryio-background"
                        >
                          Connect a Database
                        </Button>
                      </div>
                    ) : !activeThread ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <h3 className="text-lg font-medium mb-2">Select a thread or start a new conversation</h3>
                        <p className="text-muted-foreground">
                          Choose from your existing query threads or start a new one from the sidebar.
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-secondary text-secondary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {message.content}
                          </div>
>>>>>>> 4684c61 (Backend DB connected)
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </Card>
              
              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your database..."
<<<<<<< HEAD
                  className="flex-1 bg-[#161616] border-[#1E1E1E] focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:ring-offset-0"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-white hover:bg-gray-200 text-[#121212] px-4"
=======
                  className="flex-1 bg-card border-border"
                  disabled={isLoadingDatabases || databases.length === 0 || !activeThread}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim() || isLoadingDatabases || databases.length === 0 || !activeThread}
                  className="bg-white hover:bg-gray-200 text-queryio-background px-4"
>>>>>>> 4684c61 (Backend DB connected)
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </SidebarProvider>
    </div>
  );
};

// Helper component for the clock icon
const Clock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default Dashboard;
