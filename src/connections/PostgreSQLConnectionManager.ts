import { Pool, PoolClient } from 'pg';
import { DatabaseConfig, QueryResult } from '../interfaces';
import { ConnectionManager } from './ConnectionManager';

export class PostgreSQLConnectionManager implements ConnectionManager {
  private pool: Pool | null = null;
  private client: PoolClient | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.pool) {
      return;
    }

    try {
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.username,
        password: this.config.password,
        database: this.config.database,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test bağlantısı
      await this.pool.connect();
    } catch (error) {
      throw new Error(`PostgreSQL connection failed: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.release();
      this.client = null;
    }
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async query<T = any>(sql: string, parameters: any[] = []): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('PostgreSQL connection not established');
    }

    try {
      const client = await this.pool.connect();
      try {
        const result = await client.query(sql, parameters);
        client.release();

        return {
          rows: result.rows as T[],
          count: result.rowCount || 0,
          query: sql,
          parameters
        };
      } catch (error) {
        client.release();
        throw error;
      }
    } catch (error) {
      throw new Error(`PostgreSQL query failed: ${error.message}`);
    }
  }

  async beginTransaction(): Promise<void> {
    if (!this.pool) {
      throw new Error('PostgreSQL connection not established');
    }

    if (this.client) {
      throw new Error('Transaction already in progress');
    }

    try {
      this.client = await this.pool.connect();
      await this.client.query('BEGIN');
    } catch (error) {
      if (this.client) {
        this.client.release();
        this.client = null;
      }
      throw new Error(`Begin transaction failed: ${error.message}`);
    }
  }

  async commit(): Promise<void> {
    if (!this.client) {
      throw new Error('No active transaction');
    }

    try {
      await this.client.query('COMMIT');
      this.client.release();
      this.client = null;
    } catch (error) {
      throw new Error(`Commit failed: ${error.message}`);
    }
  }

  async rollback(): Promise<void> {
    if (!this.client) {
      throw new Error('No active transaction');
    }

    try {
      await this.client.query('ROLLBACK');
      this.client.release();
      this.client = null;
    } catch (error) {
      throw new Error(`Rollback failed: ${error.message}`);
    }
  }

  isConnected(): boolean {
    return this.pool !== null;
  }
} 