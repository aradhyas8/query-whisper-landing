import React, { useState } from 'react';
import { Send, Copy, CheckCircle, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsItem, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Message type definition
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'code' | 'text' | 'error' | 'success';
  sql?: string;
  data?: any[];
  chartData?: any[];
  metadata?: {
    executionTime?: string;
    rowsAffected?: number;
    schema?: string;
    table?: string;
  };
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  placeholder?: string;
  emptyStateImage?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onNewConversation?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  placeholder = "Ask anything about your database...",
  emptyStateImage,
  emptyStateTitle = "Let's explore your data",
  emptyStateDescription = "Ask me anything about your database using natural language.",
  onNewConversation
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render message content based on type
  const renderMessageContent = (message: Message) => {
    if (message.type === 'code' || message.sql) {
      return (
        <div className="w-full space-y-4">
          {/* Text content */}
          <p>{message.content}</p>
          
          {/* SQL code block */}
          {message.sql && (
            <div className="relative">
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-[#2DD4BF]"
                  onClick={() => copyToClipboard(message.sql!, message.id)}
                >
                  {copiedId === message.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <pre className="w-full whitespace-pre-wrap overflow-x-auto bg-[#0D0D0D] p-4 rounded-lg text-sm font-mono border border-[#1E1E1E]">
                <code>{message.sql}</code>
              </pre>
            </div>
          )}
          
          {/* Data display */}
          {message.data && message.data.length > 0 && (
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="bg-[#161616] border-b border-[#1E1E1E]">
                <TabsItem value="table" className="data-[state=active]:border-b-2 data-[state=active]:border-[#2DD4BF]">Table</TabsItem>
                <TabsItem value="chart" className="data-[state=active]:border-b-2 data-[state=active]:border-[#2DD4BF]">Chart</TabsItem>
              </TabsList>
              <TabsContent value="table" className="pt-4">
                <div className="border border-[#1E1E1E] rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {message.data[0] && Object.keys(message.data[0]).map((key) => (
                          <TableHead key={key} className="bg-[#161616]">{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {message.data.map((row, i) => (
                        <TableRow key={i} className={i % 2 === 0 ? 'bg-[#121212]' : 'bg-[#161616]'}>
                          {Object.values(row).map((value: any, j) => (
                            <TableCell key={j}>{String(value)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="chart" className="pt-4">
                <div className="border border-[#1E1E1E] rounded-lg p-4 bg-[#0D0D0D]">
                  <ChartContainer 
                    config={{
                      primary: { color: '#2DD4BF' },
                      secondary: { color: '#6B7280' }
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={message.chartData || message.data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis 
                          dataKey={Object.keys(message.data[0])[0]} 
                          tick={{ fill: '#6B7280' }} 
                          stroke="#444"
                        />
                        <YAxis tick={{ fill: '#6B7280' }} stroke="#444" />
                        <Tooltip content={
                          <ChartTooltipContent />
                        } />
                        <Legend />
                        {Object.keys(message.data[0]).slice(1).map((key, i) => (
                          <Line 
                            key={key}
                            type="monotone" 
                            dataKey={key} 
                            stroke={i === 0 ? '#2DD4BF' : '#6B7280'} 
                            strokeWidth={2}
                            activeDot={{ r: 6, fill: '#2DD4BF' }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {/* Metadata display */}
          {message.metadata && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {message.metadata.executionTime && (
                <span className="flex items-center gap-1">
                  ⏱️ {message.metadata.executionTime}
                </span>
              )}
              {message.metadata.rowsAffected && (
                <span className="flex items-center gap-1">
                  📊 {message.metadata.rowsAffected} {message.metadata.rowsAffected === 1 ? 'row' : 'rows'}
                </span>
              )}
              {message.metadata.schema && message.metadata.table && (
                <span className="flex items-center gap-1 bg-[#1A1A1A] px-2 py-1 rounded-full">
                  {message.metadata.schema}.{message.metadata.table}
                </span>
              )}
            </div>
          )}
        </div>
      );
    } else if (message.type === 'error') {
      return (
        <div className="flex items-start gap-2 text-red-500">
          <span>{message.content}</span>
        </div>
      );
    } else if (message.type === 'success') {
      return (
        <div className="flex items-start gap-2 text-[#2DD4BF]">
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
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <ScrollArea className="flex-1 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            {emptyStateImage && (
              <img src={emptyStateImage} alt="Empty state" className="w-32 h-32 mb-4 opacity-80" />
            )}
            <h3 className="text-xl font-semibold mb-2">{emptyStateTitle}</h3>
            <p className="text-muted-foreground mb-6 max-w-md">{emptyStateDescription}</p>
            {onNewConversation && (
              <Button 
                onClick={onNewConversation}
                className="bg-[#2DD4BF] hover:bg-[#25b0a0] text-black font-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 py-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card
                    className={`max-w-[85%] transition-all duration-200 ${
                      message.sender === 'user'
                        ? 'bg-[#1A1A1A] text-white p-4 hover:shadow-md'
                        : 'bg-[#161616] text-[#E0E0E0] p-4 border border-[#1E1E1E] hover:border-[#2DD4BF]/20 hover:shadow-md'
                    }`}
                  >
                    {renderMessageContent(message)}
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
      
      {/* Input area */}
      <div className="flex gap-2 mt-4">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-[#161616] border-[#1E1E1E] focus-visible:ring-1 focus-visible:ring-[#2DD4BF]/30 focus-visible:border-[#2DD4BF]/50 focus-visible:ring-offset-0 transition-all duration-200"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="bg-[#2DD4BF] hover:bg-[#25b0a0] text-black"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
