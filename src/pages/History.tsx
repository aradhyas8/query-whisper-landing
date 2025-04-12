
import React from 'react';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { MessageSquare, History, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FadeIn from '@/components/FadeIn';

const HistoryPage = () => {
  return (
    <div className="flex min-h-screen bg-queryio-background">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Chat">
                      <a href="/app">
                        <MessageSquare className="text-muted-foreground" />
                        <span>Chat</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive tooltip="History">
                      <a href="/app/history">
                        <History className="text-white" />
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
          <header className="flex items-center justify-between p-4 border-b border-border">
            <h1 className="text-xl font-semibold">History</h1>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <FadeIn>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Query History</h2>
              <p className="text-muted-foreground">Your recent database queries will appear here.</p>
            </div>
          </FadeIn>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default HistoryPage;
