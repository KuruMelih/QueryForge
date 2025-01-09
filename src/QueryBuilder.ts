import { QueryOptions } from './interfaces';
import { WhereCondition, JoinCondition, OrderDirection } from './types';

interface QueryState {
  type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  columns: string[];
  values: any[];
  where: WhereCondition[];
  joins: JoinCondition[];
  groupBy: string[];
  having: WhereCondition[];
  orderBy: { column: string; direction: OrderDirection }[];
  limit?: number;
  offset?: number;
  updateValues?: Record<string, any>;
}

export class QueryBuilder {
  protected state: QueryState;
  protected options: QueryOptions;

  constructor(options: QueryOptions = {}) {
    this.options = options;
    this.state = {
      type: 'SELECT',
      table: '',
      columns: ['*'],
      values: [],
      where: [],
      joins: [],
      groupBy: [],
      having: [],
      orderBy: [],
    };
  }

  protected reset(keepTable: boolean = false): void {
    const oldTable = keepTable ? this.state.table : '';
    this.state = {
      type: 'SELECT',
      table: oldTable,
      columns: ['*'],
      values: [],
      where: [],
      joins: [],
      groupBy: [],
      having: [],
      orderBy: [],
    };
  }

  table(tableName: string): this {
    this.reset(false);
    this.state.table = tableName;
    return this;
  }

  select(...columns: string[]): this {
    this.reset(true);
    this.state.type = 'SELECT';
    this.state.columns = columns.length ? columns : ['*'];
    return this;
  }

  where(column: string, operator: string, value: any): this {
    this.state.where.push({
      column,
      operator: operator as any,
      value,
      logic: 'AND',
    });
    return this;
  }

  orWhere(column: string, operator: string, value: any): this {
    this.state.where.push({
      column,
      operator: operator as any,
      value,
      logic: 'OR',
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
        rightColumn,
      },
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
        rightColumn,
      },
    });
    return this;
  }

  orderBy(column: string, direction: OrderDirection = 'ASC'): this {
    this.state.orderBy = [{ column, direction }];
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
      logic: 'AND',
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

  insert(data: Record<string, any>): this {
    this.reset(true);
    this.state.type = 'INSERT';
    this.state.columns = Object.keys(data);
    this.state.values = Object.values(data);
    return this;
  }

  insertMany(records: Record<string, any>[]): this {
    if (!records.length) {
      throw new Error('No records provided for bulk insert');
    }

    this.reset(true);
    this.state.type = 'INSERT';
    this.state.columns = Object.keys(records[0]);
    this.state.values = records
      .map(record => {
        const values = this.state.columns.map(column => record[column]);
        if (values.length !== this.state.columns.length) {
          throw new Error('All records must have the same columns');
        }
        return values;
      })
      .flat();
    return this;
  }

  update(data: Record<string, any>): this {
    this.reset(true);
    this.state.type = 'UPDATE';
    this.state.updateValues = data;
    return this;
  }

  delete(): this {
    this.reset(true);
    this.state.type = 'DELETE';
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
