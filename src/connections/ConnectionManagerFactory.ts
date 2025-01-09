import { DatabaseConfig } from '../interfaces';
import { DatabaseType } from '../types';
import { ConnectionManager } from './ConnectionManager';
import { MySQLConnectionManager } from './MySQLConnectionManager';
import { PostgreSQLConnectionManager } from './PostgreSQLConnectionManager';
import { SQLiteConnectionManager } from './SQLiteConnectionManager';

export class ConnectionManagerFactory {
  static create(config: DatabaseConfig): ConnectionManager {
    switch (config.type) {
      case 'mysql':
        return new MySQLConnectionManager(config);
      case 'postgresql':
        return new PostgreSQLConnectionManager(config);
      case 'sqlite':
        return new SQLiteConnectionManager(config);
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }
} 