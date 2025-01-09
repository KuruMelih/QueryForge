import { QueryOptions } from './interfaces';
import { WhereCondition, JoinCondition, OrderDirection } from './types';

interface QueryState {
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

export class QueryBuilder {
  protected state: QueryState;
  protected options: QueryOptions;

  constructor(options: QueryOptions = {}) {
    this.options = options;
    this.state = {
      table: '',
      columns: ['*'],
      where: [],
      joins: [],
      groupBy: [],
      having: [],
      orderBy: [],
    };
  }

  table(tableName: string): this {
    this.state.table = tableName;
    return this;
  }

  select(...columns: string[]): this {
    this.state.columns = columns.length ? columns : ['*'];
    return this;
  }

  where(column: string, operator: string, value: any): this {
    this.state.where.push({
      column,
      operator: operator as any,
      value,
      logic: 'AND'
    });
    return this;
  }

  orWhere(column: string, operator: string, value: any): this {
    this.state.where.push({
      column,
      operator: operator as any,
      value,
      logic: 'OR'
    });
    return this;
  }

  join(table: string, leftColumn: string, operator: string, rightColumn: string): this {
    this.state.joins.push({
      table,
      type: 'INNER',
      on: {
        leftColumn,
        operator: operator as any,
        rightColumn
      }
    });
    return this;
  }

  leftJoin(table: string, leftColumn: string, operator: string, rightColumn: string): this {
    this.state.joins.push({
      table,
      type: 'LEFT',
      on: {
        leftColumn,
        operator: operator as any,
        rightColumn
      }
    });
    return this;
  }

  orderBy(column: string, direction: OrderDirection = 'ASC'): this {
    this.state.orderBy.push({ column, direction });
    return this;
  }

  groupBy(...columns: string[]): this {
    this.state.groupBy.push(...columns);
    return this;
  }

  having(column: string, operator: string, value: any): this {
    this.state.having.push({
      column,
      operator: operator as any,
      value,
      logic: 'AND'
    });
    return this;
  }

  limit(limit: number): this {
    this.state.limit = limit;
    return this;
  }

  offset(offset: number): this {
    this.state.offset = offset;
    return this;
  }

  getState(): QueryState {
    return { ...this.state };
  }

  protected buildQuery(): string {
    // Bu metod alt sınıflarda implement edilecek
    throw new Error('buildQuery method must be implemented in derived class');
  }

  protected buildParameters(): any[] {
    // Bu metod alt sınıflarda implement edilecek
    throw new Error('buildParameters method must be implemented in derived class');
  }

  async execute<T = any>(): Promise<T[]> {
    // Bu metod alt sınıflarda implement edilecek
    throw new Error('execute method must be implemented in derived class');
  }
} 