
import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { MessageSquare, History, Settings as SettingsIcon, User, CreditCard, Database, ChevronRight, ExternalLink, Download, Trash2, Edit, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsItem, TabsList } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import FadeIn from '@/components/FadeIn';

import { ProfileSection } from '@/components/settings/ProfileSection';
import { SubscriptionSection } from '@/components/settings/SubscriptionSection';
import { BillingSection } from '@/components/settings/BillingSection';
import { DatabaseConnectionsSection } from '@/components/settings/DatabaseConnectionsSection';

const SettingsPage = () => {
  const { user } = useAuth();

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
                    <SidebarMenuButton asChild tooltip="History">
                      <a href="/app/history">
                        <History className="text-muted-foreground" />
                        <span>History</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive tooltip="Settings">
                      <a href="/app/settings">
                        <SettingsIcon className="text-white" />
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
            <h1 className="text-xl font-semibold">Settings</h1>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <FadeIn>
            <div className="p-6">
              <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                <ProfileSection />
                <SubscriptionSection />
                <BillingSection />
                <DatabaseConnectionsSection />
              </div>
            </div>
          </FadeIn>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SettingsPage;
