# API Reference

## QueryForge Class

### Constructor

```typescript
constructor(config: DatabaseConfig, options?: QueryOptions)
```

#### DatabaseConfig
- `type`: 'mysql' | 'postgres' | 'sqlite'
- `host`: string (not required for SQLite)
- `port`: number (not required for SQLite)
- `username`: string (not required for SQLite)
- `password`: string (not required for SQLite)
- `database`: string (database name or file path for SQLite)

#### QueryOptions
- `logging`: boolean (default: false)

### Connection Methods

#### connect()
```typescript
async connect(): Promise<void>
```
Establishes database connection.

#### disconnect()
```typescript
async disconnect(): Promise<void>
```
Closes database connection.

### Transaction Methods

#### beginTransaction()
```typescript
async beginTransaction(): Promise<void>
```
Starts a new transaction.

#### commit()
```typescript
async commit(): Promise<void>
```
Commits the current transaction.

#### rollback()
```typescript
async rollback(): Promise<void>
```
Rolls back the current transaction.

### Query Building Methods

#### table(tableName: string)
```typescript
table(tableName: string): QueryBuilder
```
Sets the target table for the query.

#### select(...columns: string[])
```typescript
select(...columns: string[]): QueryBuilder
```
Specifies columns to select.

#### where(column: string, operator: string, value: any)
```typescript
where(column: string, operator: string, value: any): QueryBuilder
```
Adds WHERE condition.

#### andWhere(column: string, operator: string, value: any)
```typescript
andWhere(column: string, operator: string, value: any): QueryBuilder
```
Adds AND WHERE condition.

#### orWhere(column: string, operator: string, value: any)
```typescript
orWhere(column: string, operator: string, value: any): QueryBuilder
```
Adds OR WHERE condition.

#### join(table: string, leftColumn: string, operator: string, rightColumn: string)
```typescript
join(table: string, leftColumn: string, operator: string, rightColumn: string): QueryBuilder
```
Adds INNER JOIN.

#### leftJoin(table: string, leftColumn: string, operator: string, rightColumn: string)
```typescript
leftJoin(table: string, leftColumn: string, operator: string, rightColumn: string): QueryBuilder
```
Adds LEFT JOIN.

#### orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC')
```typescript
orderBy(column: string, direction?: 'ASC' | 'DESC'): QueryBuilder
```
Adds ORDER BY clause.

#### groupBy(...columns: string[])
```typescript
groupBy(...columns: string[]): QueryBuilder
```
Adds GROUP BY clause.

#### having(column: string, operator: string, value: any)
```typescript
having(column: string, operator: string, value: any): QueryBuilder
```
Adds HAVING clause.

#### limit(limit: number)
```typescript
limit(limit: number): QueryBuilder
```
Sets LIMIT clause.

#### offset(offset: number)
```typescript
offset(offset: number): QueryBuilder
```
Sets OFFSET clause.

#### insert(data: Record<string, any>)
```typescript
insert(data: Record<string, any>): QueryBuilder
```
Prepares INSERT query with single record.

#### insertMany(records: Record<string, any>[])
```typescript
insertMany(records: Record<string, any>[]): QueryBuilder
```
Prepares INSERT query with multiple records.

#### update(data: Record<string, any>)
```typescript
update(data: Record<string, any>): QueryBuilder
```
Prepares UPDATE query.

#### delete()
```typescript
delete(): QueryBuilder
```
Prepares DELETE query.

#### execute<T = any>()
```typescript
async execute<T = any>(): Promise<T[]>
```
Executes the built query and returns results.

### Utility Methods

#### raw(sql: string)
```typescript
raw(sql: string): RawSQL
```
Creates a raw SQL expression.

## Types

### WhereCondition
```typescript
interface WhereCondition {
  column: string;
  operator: string;
  value: any;
  logic: 'AND' | 'OR';
}
```

### JoinCondition
```typescript
interface JoinCondition {
  table: string;
  type: 'INNER' | 'LEFT';
  on: {
    leftColumn: string;
    operator: string;
    rightColumn: string;
  };
}
```

### OrderDirection
```typescript
type OrderDirection = 'ASC' | 'DESC';
``` 