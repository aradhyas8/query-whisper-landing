
export interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  isStarred?: boolean;
  tables?: string[];
}

export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'mongodb' | 'sqlite';
  threads: ChatThread[];
  isDefault?: boolean; // Added to mark connections that cannot be deleted
  healthStatus?: 'healthy' | 'warning' | 'error' | 'unknown';
}

export interface QueryResult {
  columns: string[];
  rows: any[];
  executionTime?: string;
  rowCount?: number;
  schema?: string;
  table?: string;
}
