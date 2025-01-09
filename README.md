# QueryForge

[![npm version](https://badge.fury.io/js/queryforge.svg)](https://www.npmjs.com/package/queryforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/kurumelih/queryforge)

🚀 A powerful, type-safe and flexible SQL query builder with support for MySQL, PostgreSQL, and SQLite databases.

## ✨ Features

### 🔍 Core Query Features
- **SELECT** queries
  - Complex WHERE conditions
  - JOIN operations (INNER, LEFT, RIGHT)
  - GROUP BY and HAVING clauses
  - ORDER BY and LIMIT
  - Subqueries
  - Custom functions

### ✏️ CRUD Operations
- **INSERT** operations
  - Single record insertion
  - Bulk insert operations
  - INSERT ... ON DUPLICATE KEY UPDATE
  - RETURNING clause support

- **UPDATE** operations
  - Conditional updates
  - Multiple column updates
  - Subquery updates
  - Bulk update operations

- **DELETE** operations
  - Conditional deletes
  - Soft delete support
  - Cascade delete
  - Bulk delete operations

### 🔒 Security & Performance
- SQL injection protection
- Parameterized queries
- Connection pool management
- Transaction support
- Automatic connection recovery

### 🛠️ Developer Experience
- Full TypeScript support
- Fluent API design
- Detailed error messages
- Comprehensive documentation
- Example code snippets

## 📦 Installation

```bash
npm install queryforge
```

## 🚀 Quick Start

```typescript
import { QueryForge, DatabaseType } from 'queryforge';

// Configure database connection
const config = {
  type: DatabaseType.MYSQL,
  host: 'localhost',
  port: 3306,
  database: 'test_db',
  user: 'root',
  password: 'password'
};

// Create QueryForge instance
const qf = new QueryForge(config);

// Connect to database
await qf.connect();

// SELECT example
const users = await qf
  .select('users.*, orders.total')
  .from('users')
  .leftJoin('orders', 'users.id = orders.user_id')
  .where('users.age > ?', [18])
  .orderBy('users.name', 'ASC')
  .limit(10)
  .execute();

// INSERT example
const newUser = await qf
  .insertInto('users')
  .values({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
  })
  .execute();

// Bulk INSERT example
const users = [
  { name: 'Alice', email: 'alice@example.com', age: 30 },
  { name: 'Bob', email: 'bob@example.com', age: 25 }
];

await qf
  .insertInto('users')
  .values(users)
  .execute();

// UPDATE example
await qf
  .update('users')
  .set({ status: 'active' })
  .where('last_login > ?', ['2024-01-01'])
  .execute();

// DELETE example
await qf
  .deleteFrom('users')
  .where('status = ?', ['inactive'])
  .execute();

// Transaction example
await qf.beginTransaction();
try {
  await qf
    .insertInto('orders')
    .values({ user_id: 1, total: 100 })
    .execute();

  await qf
    .update('users')
    .set({ order_count: qf.raw('order_count + 1') })
    .where('id = ?', [1])
    .execute();

  await qf.commit();
} catch (error) {
  await qf.rollback();
  throw error;
}

// Close connection
await qf.disconnect();
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Thanks to everyone who has contributed to this project! 