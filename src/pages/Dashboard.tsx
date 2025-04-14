
import React, { useState } from 'react';
import { Loader2, Send, MessageSquare, History, Settings, User, LogOut, ChevronDown, ChevronRight, CheckCircle, XCircle, Code, Database as DatabaseIcon, FileText } from 'lucide-react';
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
import { mockDatabases } from '@/data/mockDatabases';
import { DatabaseConnection, ChatThread } from '@/types/database';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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

const Dashboard = () => {
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
    const selectedDb = mockDatabases.find(db => db.id === databaseId);
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

  const handleLogout = () => {
    // Mock logout functionality
    toast.success("Logged out successfully");
    // In a real app, this would redirect to login or call an auth logout function
  };

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
      <SidebarProvider>
        <Sidebar className="bg-[#0D0D0D] border-[#1E1E1E]">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <DatabaseSidebar 
                  databases={mockDatabases}
                  onSelectThread={handleSelectThread}
                  activeThread={activeThread}
                />
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
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
              
              {/* Input Bar */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your database..."
                  className="flex-1 bg-[#161616] border-[#1E1E1E] focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:ring-offset-0"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-white hover:bg-gray-200 text-[#121212] px-4"
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
