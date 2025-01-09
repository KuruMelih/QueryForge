import { DatabaseConfig, QueryOptions, QueryResult } from './interfaces';
import { QueryBuilder } from './QueryBuilder';
import { ConnectionManagerFactory } from './connections/ConnectionManagerFactory';
import { ConnectionManager } from './connections/ConnectionManager';

export class QueryForge extends QueryBuilder {
  private connectionManager: ConnectionManager;

  constructor(config: DatabaseConfig, options: QueryOptions = {}) {
    super(options);
    this.connectionManager = ConnectionManagerFactory.create(config);
  }

  async connect(): Promise<void> {
    await this.connectionManager.connect();
  }

  async disconnect(): Promise<void> {
    await this.connectionManager.disconnect();
  }

  async beginTransaction(): Promise<void> {
    await this.connectionManager.beginTransaction();
  }

  async commit(): Promise<void> {
    await this.connectionManager.commit();
  }

  async rollback(): Promise<void> {
    await this.connectionManager.rollback();
  }

  protected buildQuery(): string {
    const query: string[] = [];

    // SELECT
    query.push(`SELECT ${this.state.columns.join(', ')}`);

    // FROM
    query.push(`FROM ${this.state.table}`);

    // JOINS
    if (this.state.joins.length) {
      const joins = this.state.joins.map(join => {
        return `${join.type} JOIN ${join.table} ON ${join.on.leftColumn} ${join.on.operator} ${join.on.rightColumn}`;
      });
      query.push(joins.join(' '));
    }

    // WHERE
    if (this.state.where.length) {
      const conditions = this.state.where.map((condition, index) => {
        const logic = index === 0 ? 'WHERE' : condition.logic;
        return `${logic} ${condition.column} ${condition.operator} ?`;
      });
      query.push(conditions.join(' '));
    }

    // GROUP BY
    if (this.state.groupBy.length) {
      query.push(`GROUP BY ${this.state.groupBy.join(', ')}`);
    }

    // HAVING
    if (this.state.having.length) {
      const conditions = this.state.having.map((condition, index) => {
        const logic = index === 0 ? 'HAVING' : condition.logic;
        return `${logic} ${condition.column} ${condition.operator} ?`;
      });
      query.push(conditions.join(' '));
    }

    // ORDER BY
    if (this.state.orderBy.length) {
      const orderClauses = this.state.orderBy.map(order => {
        return `${order.column} ${order.direction}`;
      });
      query.push(`ORDER BY ${orderClauses.join(', ')}`);
    }

    // LIMIT & OFFSET
    if (this.state.limit !== undefined) {
      query.push(`LIMIT ${this.state.limit}`);
    }
    if (this.state.offset !== undefined) {
      query.push(`OFFSET ${this.state.offset}`);
    }

    return query.join(' ');
  }

  protected buildParameters(): any[] {
    const parameters: any[] = [];

    // WHERE parameters
    this.state.where.forEach(condition => {
      if (condition.value !== undefined) {
        parameters.push(condition.value);
      }
    });

    // HAVING parameters
    this.state.having.forEach(condition => {
      if (condition.value !== undefined) {
        parameters.push(condition.value);
      }
    });

    return parameters;
  }

  async execute<T = any>(): Promise<T[]> {
    if (!this.connectionManager.isConnected()) {
      await this.connect();
    }

    const query = this.buildQuery();
    const parameters = this.buildParameters();

    try {
      if (this.options.logging) {
        console.log('Executing query:', query);
        console.log('Parameters:', parameters);
      }

      const result = await this.connectionManager.query<T>(query, parameters);
      return result.rows;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Query execution failed: ${error.message}`);
      }
      throw new Error('Query execution failed: Unknown error');
    }
  }
} 