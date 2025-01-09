import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { DatabaseConfig, QueryResult } from '../interfaces';
import { ConnectionManager } from './ConnectionManager';

export class MySQLConnectionManager implements ConnectionManager {
  private pool: Pool | null = null;
  private connection: PoolConnection | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.pool) {
      return;
    }

    try {
      this.pool = createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.username,
        password: this.config.password,
        database: this.config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Test bağlantısı
      await this.pool.getConnection();
    } catch (error) {
      throw new Error(`MySQL connection failed: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.release();
      this.connection = null;
    }
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async query<T = any>(sql: string, parameters: any[] = []): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('MySQL connection not established');
    }

    try {
      const connection = await this.pool.getConnection();
      try {
        const [rows, fields] = await connection.query(sql, parameters);
        connection.release();

        return {
          rows: rows as T[],
          count: Array.isArray(rows) ? rows.length : 0,
          query: sql,
          parameters
        };
      } catch (error) {
        connection.release();
        throw error;
      }
    } catch (error) {
      throw new Error(`MySQL query failed: ${error.message}`);
    }
  }

  async beginTransaction(): Promise<void> {
    if (!this.pool) {
      throw new Error('MySQL connection not established');
    }

    if (this.connection) {
      throw new Error('Transaction already in progress');
    }

    try {
      this.connection = await this.pool.getConnection();
      await this.connection.beginTransaction();
    } catch (error) {
      throw new Error(`Begin transaction failed: ${error.message}`);
    }
  }

  async commit(): Promise<void> {
    if (!this.connection) {
      throw new Error('No active transaction');
    }

    try {
      await this.connection.commit();
      await this.connection.release();
      this.connection = null;
    } catch (error) {
      throw new Error(`Commit failed: ${error.message}`);
    }
  }

  async rollback(): Promise<void> {
    if (!this.connection) {
      throw new Error('No active transaction');
    }

    try {
      await this.connection.rollback();
      await this.connection.release();
      this.connection = null;
    } catch (error) {
      throw new Error(`Rollback failed: ${error.message}`);
    }
  }

  isConnected(): boolean {
    return this.pool !== null;
  }
} 