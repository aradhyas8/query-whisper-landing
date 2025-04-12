
import React, { useState } from 'react';
import { Loader2, Send, MessageSquare, History, Settings } from 'lucide-react';
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
import FadeIn from '@/components/FadeIn';
import DatabaseSidebar from '@/components/DatabaseSidebar';
import { mockDatabases } from '@/data/mockDatabases';
import { DatabaseConnection, ChatThread } from '@/types/database';

// Types for messages
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to Query.io! Ask me anything about your database.',
      sender: 'ai',
      timestamp: new Date(),
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
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Here's the data you requested based on your query: "${inputMessage}"`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Failed to generate response. Please try again.');
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
        },
        {
          id: '2',
          content: selectedThread.lastMessage,
          sender: 'user',
          timestamp: selectedThread.timestamp,
        },
        {
          id: '3',
          content: `Here's the response to your query: "${selectedThread.lastMessage}"`,
          sender: 'ai',
          timestamp: new Date(selectedThread.timestamp.getTime() + 10000), // 10 seconds after
        },
      ]);
    }
  };

  return (
    <div className="flex min-h-screen bg-queryio-background">
      <SidebarProvider>
        <Sidebar>
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
                      <a href="/app">
                        <MessageSquare className="text-white" />
                        <span>Chat</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="History">
                      <a href="/app/history">
                        <History className="text-muted-foreground" />
                        <span>History</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Settings">
                      <a href="/app/settings">
                        <Settings className="text-muted-foreground" />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-border">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <FadeIn>
            <div className="flex flex-col flex-1 p-4 h-[calc(100vh-72px)]">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Messages */}
              <Card className="flex-1 mb-4 overflow-hidden bg-card border border-border">
                <ScrollArea className="h-[calc(100vh-180px)] p-4">
                  <div className="flex flex-col gap-4">
                    {messages.map((message) => (
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
                          <p>{message.content}</p>
                          <p className="text-xs opacity-50 mt-1">
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
                  className="flex-1 bg-card border-border"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-white hover:bg-gray-200 text-queryio-background px-4"
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

export default Dashboard;
