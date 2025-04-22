
import React, { useState, useEffect } from 'react';
import { MessageSquare, History, Settings, User, LogOut, Database as DatabaseIcon, TableProperties, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import DatabaseSidebar from '@/components/database/DatabaseSidebar';
import DashboardHeader from '@/components/database/DashboardHeader';
import ChatInterface from '@/components/database/ChatInterface';
import { DatabaseConnection } from '@/types/database';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '@/utils/api';
import { ConnectionHealthStatus } from '@/components/database/schema';

// Default dummy database that will be available for all users
const DUMMY_DATABASE: DatabaseConnection = {
  id: 'demo-db-123',
  name: 'Demo Database',
  type: 'postgres',
  isDefault: true, // Mark as default so it can't be deleted
  healthStatus: ConnectionHealthStatus.HEALTHY,
  threads: [
    {
      id: 'thread-demo-db-1',
      name: 'Sample Query Thread',
      lastMessage: 'Show me all users in the system',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      tables: ['users', 'profiles']
    },
    {
      id: 'thread-demo-db-2',
      name: 'Product Analysis',
      lastMessage: 'Count products by category',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      tables: ['products', 'categories']
    }
  ]
};

// Sample message data
const demoChartData = [
  { year: 2018, SF: 120, NY: 80 },
  { year: 2019, SF: 140, NY: 110 },
  { year: 2020, SF: 170, NY: 130 },
  { year: 2021, SF: 200, NY: 160 },
  { year: 2022, SF: 250, NY: 210 },
];

const Dashboard = () => {
  const { logout } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<{ databaseId: string; threadId: string } | null>(null);
  const [databases, setDatabases] = useState<DatabaseConnection[]>([]);
  const [isLoadingDatabases, setIsLoadingDatabases] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch databases from the API and add the dummy database
  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    setIsLoadingDatabases(true);
    try {
      // Fetch user's databases from the API
      const response = await api.get('/api/connections');
      
      // Transform the API response to match the DatabaseConnection structure
      const connectionsData: DatabaseConnection[] = response.data.map((conn: any) => {
        // Generate some placeholder threads for each connection
        const threads = [
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
          threads: threads,
          healthStatus: Math.random() > 0.7 
            ? ConnectionHealthStatus.WARNING 
            : ConnectionHealthStatus.HEALTHY
        };
      });
      
      // Add the dummy database as the first item
      setDatabases([DUMMY_DATABASE, ...connectionsData]);
    } catch (error) {
      console.error('Error fetching database connections:', error);
      toast.error('Failed to load your database connections');
      
      // If there's an error fetching databases, at least show the dummy one
      setDatabases([DUMMY_DATABASE]);
    } finally {
      setIsLoadingDatabases(false);
    }
  };

  // Function to handle sending messages
  const handleSendMessage = async (inputMessage: string) => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock response based on the query
      let aiResponse: any;
      
      if (inputMessage.toLowerCase().includes('compare') && inputMessage.toLowerCase().includes('unicorn')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: 'This query shows the growth of unicorn companies in San Francisco and New York over time.',
          sender: 'ai',
          timestamp: new Date(),
          sql: `SELECT
  EXTRACT(YEAR FROM founded_date) AS year,
  COUNT(CASE WHEN city = 'San Francisco' THEN 1 END) AS SF,
  COUNT(CASE WHEN city = 'New York' THEN 1 END) AS NY
FROM
  unicorn_companies
GROUP BY
  EXTRACT(YEAR FROM founded_date)
ORDER BY
  year ASC;`,
          data: demoChartData,
          chartData: demoChartData,
          metadata: {
            executionTime: '0.138s',
            rowsAffected: 5,
            schema: 'startup_data',
            table: 'unicorn_companies'
          }
        };
      } else if (inputMessage.toLowerCase().includes('select')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `Here are the top 10 cities by population:`,
          sender: 'ai',
          timestamp: new Date(),
          sql: `SELECT id, name, population, country_code 
FROM cities 
WHERE population > 1000000 
ORDER BY population DESC
LIMIT 10;`,
          data: [
            { id: 1, name: 'Tokyo', population: 37400068, country_code: 'JP' },
            { id: 2, name: 'Delhi', population: 28514000, country_code: 'IN' },
            { id: 3, name: 'Shanghai', population: 25582000, country_code: 'CN' },
            { id: 4, name: 'São Paulo', population: 21650000, country_code: 'BR' },
            { id: 5, name: 'Mexico City', population: 21581000, country_code: 'MX' },
            { id: 6, name: 'Cairo', population: 20076000, country_code: 'EG' },
            { id: 7, name: 'Mumbai', population: 19980000, country_code: 'IN' },
            { id: 8, name: 'Beijing', population: 19618000, country_code: 'CN' },
            { id: 9, name: 'Dhaka', population: 19578000, country_code: 'BD' },
            { id: 10, name: 'Osaka', population: 19281000, country_code: 'JP' },
          ],
          metadata: {
            executionTime: '0.138s',
            rowsAffected: 10,
            schema: 'geo',
            table: 'cities'
          }
        };
      } else if (
        inputMessage.toLowerCase().includes('update') || 
        inputMessage.toLowerCase().includes('insert') || 
        inputMessage.toLowerCase().includes('delete')
      ) {
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
          content: selectedThread.lastMessage,
          sender: 'user',
          timestamp: selectedThread.timestamp,
          type: 'text',
        },
        {
          id: '2',
          content: `Here's the data you requested:`,
          sender: 'ai',
          timestamp: new Date(selectedThread.timestamp.getTime() + 10000),
          sql: `SELECT * FROM planets WHERE name = 'Earth';`,
          data: [
            { id: 'EA-1001', name: 'Earth', distance_from_sun: 1.0, mass: '5.97e24', is_inhabited: true }
          ],
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

  // Handle adding a new database connection
  const handleConnectionAdded = (newConnection: DatabaseConnection) => {
    setDatabases(prev => [...prev, newConnection]);
  };

  // Handle deleting a database connection
  const handleConnectionDeleted = (connectionId: string) => {
    setDatabases(prev => prev.filter(db => db.id !== connectionId));
    
    // If the active thread was in the deleted database, clear it
    if (activeThread && activeThread.databaseId === connectionId) {
      setActiveThread(null);
      // Reset messages to welcome message
      setMessages([]);
    }
  };

  const handleAddThread = (databaseId: string) => {
    const db = databases.find(d => d.id === databaseId);
    if (!db) return;
    
    const newThreadId = `thread-${databaseId}-${Date.now()}`;
    const newThread = {
      id: newThreadId,
      name: `New Conversation`,
      lastMessage: '',
      timestamp: new Date()
    };
    
    const updatedDb = {
      ...db,
      threads: [...db.threads, newThread]
    };
    
    setDatabases(prev => prev.map(d => d.id === databaseId ? updatedDb : d));
    setActiveThread({ databaseId, threadId: newThreadId });
    setMessages([]);
  };

  const handleNewConversation = () => {
    if (databases.length > 0) {
      handleAddThread(databases[0].id);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Current selected database and connection names for breadcrumb
  const currentDatabaseId = activeThread?.databaseId;
  const currentDatabase = databases.find(db => db.id === currentDatabaseId);
  
  return (
    <div className="flex min-h-screen bg-[#121212]">
      <SidebarProvider>
        <Sidebar className="bg-[#0D0D0D] border-[#1E1E1E]">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                {isLoadingDatabases ? (
                  <div className="flex justify-center items-center p-6">
                    <div className="h-6 w-6 animate-spin border-2 border-t-transparent border-[#2DD4BF] rounded-full" />
                  </div>
                ) : (
                  <DatabaseSidebar 
                    databases={databases}
                    onSelectThread={handleSelectThread}
                    activeThread={activeThread}
                    onConnectionAdded={handleConnectionAdded}
                    onConnectionDeleted={handleConnectionDeleted}
                    onAddThread={handleAddThread}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
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
                        <MessageSquare className="text-[#2DD4BF]" />
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
              <h1 className="text-xl font-medium tracking-tight flex items-center">
                <DatabaseIcon className="h-5 w-5 mr-2 text-[#2DD4BF]" /> 
                Query.io
              </h1>
              <Badge variant="outline" className="bg-[#1A1A1A] text-[#A0A0A0]">Connection {databases.length}</Badge>
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
              {/* Dashboard Header with Breadcrumb and Search/Filters */}
              <DashboardHeader 
                connectionName={currentDatabase?.name}
                databaseName={activeThread ? "Chat" : undefined}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                activeFilter={activeFilter}
              />
              
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4 mt-4 bg-red-900/20 border-red-900/50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Chat Interface */}
              <Card className="flex-1 mt-4 overflow-hidden bg-[#161616] border border-[#1E1E1E] p-4">
                <ChatInterface 
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  emptyStateTitle="Let's explore your data"
                  emptyStateDescription="Use natural language to query your database, analyze data, and visualize results - all in one place."
                  onNewConversation={handleNewConversation}
                />
              </Card>
            </div>
          </FadeIn>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
