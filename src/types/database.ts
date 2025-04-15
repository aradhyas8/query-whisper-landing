
export interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
}

export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'mongodb' | 'sqlite';
  threads: ChatThread[];
  isDefault?: boolean; // Added to mark connections that cannot be deleted
}
