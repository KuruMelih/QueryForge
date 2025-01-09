import { Database } from 'sqlite3';
import { DatabaseConfig, QueryResult } from '../interfaces';
import { ConnectionManager } from './ConnectionManager';

export class SQLiteConnectionManager implements ConnectionManager {
  private db: Database | null = null;
  private config: DatabaseConfig;
  private inTransaction: boolean = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.db = new Database(this.config.database, (err) => {
        if (err) {
          reject(new Error(`SQLite connection failed: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  async disconnect(): Promise<void> {
    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.db!.close((err) => {
        if (err) {
          reject(new Error(`SQLite disconnect failed: ${err.message}`));
        } else {
          this.db = null;
          resolve();
        }
      });
    });
  }

  async query<T = any>(sql: string, parameters: any[] = []): Promise<QueryResult<T>> {
    if (!this.db) {
      throw new Error('SQLite connection not established');
    }

    return new Promise((resolve, reject) => {
      const isSelect = sql.trim().toLowerCase().startsWith('select');

      if (isSelect) {
        this.db!.all(sql, parameters, (err, rows) => {
          if (err) {
            reject(new Error(`SQLite query failed: ${err.message}`));
          } else {
            resolve({
              rows: rows as T[],
              count: rows.length,
              query: sql,
              parameters
            });
          }
        });
      } else {
        this.db!.run(sql, parameters, function(err) {
          if (err) {
            reject(new Error(`SQLite query failed: ${err.message}`));
          } else {
            resolve({
              rows: [],
              count: this.changes,
              query: sql,
              parameters
            });
          }
        });
      }
    });
  }

  async beginTransaction(): Promise<void> {
    if (!this.db) {
      throw new Error('SQLite connection not established');
    }

    if (this.inTransaction) {
      throw new Error('Transaction already in progress');
    }

    return new Promise((resolve, reject) => {
      this.db!.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          reject(new Error(`Begin transaction failed: ${err.message}`));
        } else {
          this.inTransaction = true;
          resolve();
        }
      });
    });
  }

  async commit(): Promise<void> {
    if (!this.db) {
      throw new Error('SQLite connection not established');
    }

    if (!this.inTransaction) {
      throw new Error('No active transaction');
    }

    return new Promise((resolve, reject) => {
      this.db!.run('COMMIT', (err) => {
        if (err) {
          reject(new Error(`Commit failed: ${err.message}`));
        } else {
          this.inTransaction = false;
          resolve();
        }
      });
    });
  }

  async rollback(): Promise<void> {
    if (!this.db) {
      throw new Error('SQLite connection not established');
    }

    if (!this.inTransaction) {
      throw new Error('No active transaction');
    }

    return new Promise((resolve, reject) => {
      this.db!.run('ROLLBACK', (err) => {
        if (err) {
          reject(new Error(`Rollback failed: ${err.message}`));
        } else {
          this.inTransaction = false;
          resolve();
        }
      });
    });
  }

  isConnected(): boolean {
    return this.db !== null;
  }
} 