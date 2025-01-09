import { DatabaseConfig, QueryResult } from '../interfaces';

export interface ConnectionManager {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T = any>(sql: string, parameters?: any[]): Promise<QueryResult<T>>;
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  isConnected(): boolean;
} 