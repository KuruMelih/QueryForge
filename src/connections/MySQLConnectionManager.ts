import { Connection, createConnection } from 'mysql2/promise';
import { ConnectionManager } from './ConnectionManager';
import { DatabaseConfig, QueryResult } from '../interfaces';

export class MySQLConnectionManager implements ConnectionManager {
  private connection: Connection | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.username,
        password: this.config.password,
        database: this.config.database,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`MySQL connection failed: ${errorMessage}`);
    }
  }

  isConnected(): boolean {
    return this.connection !== null;
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  async query<T = any>(sql: string, parameters: any[] = []): Promise<QueryResult<T>> {
    if (!this.connection) {
      throw new Error('No MySQL connection established');
    }

    try {
      const [rows] = await this.connection.execute(sql, parameters);
      return {
        rows: rows as T[],
        count: Array.isArray(rows) ? rows.length : 0,
        query: sql,
        parameters,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`MySQL query failed: ${errorMessage}`);
    }
  }

  async beginTransaction(): Promise<void> {
    if (!this.connection) {
      throw new Error('No MySQL connection established');
    }

    try {
      await this.connection.beginTransaction();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Begin transaction failed: ${errorMessage}`);
    }
  }

  async commit(): Promise<void> {
    if (!this.connection) {
      throw new Error('No MySQL connection established');
    }

    try {
      await this.connection.commit();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Commit failed: ${errorMessage}`);
    }
  }

  async rollback(): Promise<void> {
    if (!this.connection) {
      throw new Error('No MySQL connection established');
    }

    try {
      await this.connection.rollback();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Rollback failed: ${errorMessage}`);
    }
  }
}
