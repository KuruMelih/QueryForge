import { DatabaseType } from './types';

export interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface QueryOptions {
  logging?: boolean;
}

export interface QueryResult<T = any> {
  rows: T[];
  count: number;
  query: string;
  parameters: any[];
}

export interface ConnectionManager {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  query<T = any>(sql: string, parameters?: any[]): Promise<QueryResult<T>>;
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
} 