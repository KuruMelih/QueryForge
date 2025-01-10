# Getting Started with QueryForge

## Installation

Install QueryForge using npm:

```bash
npm install queryforge
```

## Using with JavaScript

While QueryForge is primarily designed for TypeScript, it can be used in JavaScript projects. Here are two approaches:

### Method 1: Using Compiled JavaScript
The package includes compiled JavaScript files, so you can use it directly:

```javascript
const { QueryForge } = require('queryforge');

const qf = new QueryForge({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test_db'
});

async function example() {
  await qf.connect();
  try {
    const users = await qf
      .table('users')
      .select('*')
      .execute();
    
    console.log(users);
  } finally {
    await qf.disconnect();
  }
}
```

### Method 2: Using TypeScript Type Definitions
You can get TypeScript type checking in JavaScript files using JSDoc comments:

```javascript
// @ts-check
const { QueryForge } = require('queryforge');

/** @type {import('queryforge').DatabaseConfig} */
const config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test_db'
};

const qf = new QueryForge(config);
```

## Basic Configuration

```typescript
import { QueryForge } from 'queryforge';

// MySQL Configuration
const mysqlConfig = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test_db'
};

// PostgreSQL Configuration
const postgresConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '',
  database: 'test_db'
};

// SQLite Configuration
const sqliteConfig = {
  type: 'sqlite',
  database: './database.sqlite'
};

// Create instance with logging enabled
const qf = new QueryForge(mysqlConfig, { logging: true });
```

## Basic Operations

### Connecting to Database

```typescript
// Connect
await qf.connect();

// Disconnect
await qf.disconnect();
```

### SELECT Queries

```typescript
// Basic select
const users = await qf
  .table('users')
  .select('id', 'name', 'email')
  .execute();

// With conditions
const activeUsers = await qf
  .table('users')
  .select('*')
  .where('status', '=', 'active')
  .andWhere('age', '>', 18)
  .execute();

// With joins
const userOrders = await qf
  .table('users')
  .select('users.name', 'orders.total')
  .join('orders', 'users.id', '=', 'orders.user_id')
  .where('orders.status', '=', 'completed')
  .execute();
```

### INSERT Operations

```typescript
// Single insert
await qf
  .table('users')
  .insert({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
  })
  .execute();

// Bulk insert
const users = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
];

await qf
  .table('users')
  .insertMany(users)
  .execute();
```

### UPDATE Operations

```typescript
// Basic update
await qf
  .table('users')
  .update({ status: 'active' })
  .where('id', '=', 1)
  .execute();

// Update with multiple conditions
await qf
  .table('users')
  .update({ 
    status: 'inactive',
    updated_at: new Date()
  })
  .where('last_login', '<', '2024-01-01')
  .andWhere('status', '=', 'active')
  .execute();
```

### DELETE Operations

```typescript
// Delete with condition
await qf
  .table('users')
  .delete()
  .where('status', '=', 'inactive')
  .execute();
```

### Transaction Management

```typescript
// Using try-catch
await qf.beginTransaction();
try {
  await qf
    .table('orders')
    .insert({ user_id: 1, total: 100 })
    .execute();

  await qf
    .table('users')
    .update({ order_count: qf.raw('order_count + 1') })
    .where('id', '=', 1)
    .execute();

  await qf.commit();
} catch (error) {
  await qf.rollback();
  throw error;
}
```

## Error Handling

```typescript
try {
  await qf
    .table('users')
    .select('*')
    .where('invalid_column', '=', 'value')
    .execute();
} catch (error) {
  console.error('Query error:', error.message);
}
```

## Best Practices

1. Always close database connections when done:
```typescript
try {
  await qf.connect();
  // ... operations
} finally {
  await qf.disconnect();
}
```

2. Use transactions for multiple related operations

3. Enable logging during development:
```typescript
const qf = new QueryForge(config, { logging: true });
```

4. Use parameterized queries (automatic with QueryForge) to prevent SQL injection

5. Handle errors appropriately using try-catch blocks 