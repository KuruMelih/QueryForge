# QueryForge

[![npm version](https://badge.fury.io/js/queryforge.svg)](https://www.npmjs.com/package/queryforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/kurumelih/queryforge)

A powerful, type-safe SQL query builder primarily designed for TypeScript, with support for MySQL, PostgreSQL, and SQLite.

## Features

- 🔒 **Type Safety**: Full TypeScript integration with type definitions
- 🎯 **Fluent API**: Easy to read and write query chains
- 🔄 **Multi-Database Support**: MySQL, PostgreSQL, and SQLite
- 🛡️ **Security**: SQL injection protection with parameterized queries
- 🎭 **Transaction Management**: ACID compliant operations
- 🔌 **Connection Pool**: Automatic connection management

## Installation

```bash
npm install queryforge
```

## JavaScript vs TypeScript Usage

QueryForge is primarily designed for TypeScript, but you can use it in JavaScript projects in two ways:

### 1. Using Compiled JavaScript (Recommended)
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

// Use normally
async function example() {
  await qf.connect();
  const users = await qf
    .table('users')
    .select('*')
    .execute();
}
```

### 2. Using TypeScript with JavaScript
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

// Now you get TypeScript type checking in JS
```

## Quick Start (TypeScript)

```typescript
import { QueryForge } from 'queryforge';

// Database configuration
const config = {
  type: 'mysql', // or 'postgres', 'sqlite'
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test_db'
};

// Create QueryForge instance
const qf = new QueryForge(config, { logging: true });

// Basic Usage Examples
async function examples() {
  // Connect to database
  await qf.connect();

  try {
    // SELECT example
    const users = await qf
      .table('users')
      .select('id', 'name', 'email')
      .where('age', '>', 18)
      .orderBy('name', 'ASC')
      .limit(10)
      .execute();

    // INSERT example
    const newUser = await qf
      .table('users')
      .insert({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      })
      .execute();

    // UPDATE example
    await qf
      .table('users')
      .update({ status: 'active' })
      .where('id', '=', 1)
      .execute();

    // DELETE example
    await qf
      .table('users')
      .delete()
      .where('status', '=', 'inactive')
      .execute();

    // Transaction example
    await qf.beginTransaction();
    try {
      await qf
        .table('orders')
        .insert({
          user_id: 1,
          total: 100
        })
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
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await qf.disconnect();
  }
}
```

## Advanced Examples

### Complex SELECT Queries

```typescript
const result = await qf
  .table('users as u')
  .select('u.id', 'u.name', 'o.total as order_total')
  .join('orders as o', 'u.id', '=', 'o.user_id')
  .where('u.status', '=', 'active')
  .andWhere('o.created_at', '>', '2024-01-01')
  .groupBy('u.id')
  .having('COUNT(o.id)', '>', 5)
  .orderBy('u.name', 'ASC')
  .limit(10)
  .offset(0)
  .execute();
```

### Bulk Insert Operations

```typescript
const users = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
];

await qf
  .table('users')
  .insertMany(users)
  .execute();
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 