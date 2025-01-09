import { DatabaseType, WhereCondition, JoinCondition, OrderDirection } from './types';

export interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface QueryOptions {
  timeout?: number;
  logging?: boolean;
}

export interface QueryState {
  table: string;
  columns: string[];
  where: WhereCondition[];
  joins: JoinCondition[];
  groupBy: string[];
  having: WhereCondition[];
  orderBy: { column: string; direction: OrderDirection }[];
  limit?: number;
  offset?: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  count: number;
  query: string;
  parameters: any[];
} 