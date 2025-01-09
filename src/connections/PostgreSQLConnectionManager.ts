import { Client } from 'pg';
import { ConnectionManager } from './ConnectionManager';
import { DatabaseConfig, QueryResult } from '../interfaces';

export class PostgreSQLConnectionManager implements ConnectionManager {
  private client: Client | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      this.client = new Client({
        host: this.config.host,
        port: this.config.port,
        user: this.config.username,
        password: this.config.password,
        database: this.config.database
      });
      await this.client.connect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`PostgreSQL connection failed: ${errorMessage}`);
    }
  }

  isConnected(): boolean {
    return this.client !== null;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }

  async query<T = any>(sql: string, parameters: any[] = []): Promise<QueryResult<T>> {
    if (!this.client) {
      throw new Error('No PostgreSQL connection established');
    }

    try {
      const result = await this.client.query(sql, parameters);
      return {
        rows: result.rows as T[],
        count: result.rowCount || 0,
        query: sql,
        parameters
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`PostgreSQL query failed: ${errorMessage}`);
    }
  }

  async beginTransaction(): Promise<void> {
    if (!this.client) {
      throw new Error('No PostgreSQL connection established');
    }

    try {
      await this.client.query('BEGIN');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Begin transaction failed: ${errorMessage}`);
    }
  }

  async commit(): Promise<void> {
    if (!this.client) {
      throw new Error('No PostgreSQL connection established');
    }

    try {
      await this.client.query('COMMIT');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Commit failed: ${errorMessage}`);
    }
  }

  async rollback(): Promise<void> {
    if (!this.client) {
      throw new Error('No PostgreSQL connection established');
    }

    try {
      await this.client.query('ROLLBACK');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Rollback failed: ${errorMessage}`);
    }
  }
} 