# QueryForge

[![npm version](https://badge.fury.io/js/queryforge.svg)](https://www.npmjs.com/package/queryforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A powerful, type-safe SQL query builder for Node.js applications. QueryForge provides a fluent API for building and executing SQL queries with support for MySQL, PostgreSQL, and SQLite.

## 🚀 Features

- ✨ Type-safe query building with TypeScript
- 🔌 Support for multiple databases:
  - MySQL
  - PostgreSQL
  - SQLite
- 🔗 Fluent, chainable API
- 🛡️ SQL injection protection with parameterized queries
- 🔄 Transaction management
- 🎯 Connection pooling
- 📝 Comprehensive TypeScript definitions
- 📚 High test coverage

## 📦 Installation

```bash
npm install queryforge
```

## 🎯 Quick Start

```typescript
import { QueryForge } from 'queryforge';

// Configure database connection
const config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'mydb'
};

// Create QueryForge instance
const qf = new QueryForge(config);

// Simple query example
const users = await qf
  .table('users')
  .select('id', 'name', 'email')
  .where('age', '>', 18)
  .orderBy('name', 'ASC')
  .limit(10)
  .execute();

// JOIN example
const orders = await qf
  .table('orders')
  .select('orders.id', 'orders.total', 'users.name')
  .join('users', 'orders.user_id', '=', 'users.id')
  .where('orders.total', '>', 100)
  .execute();

// Transaction example
await qf.beginTransaction();
try {
  // ... your queries here
  await qf.commit();
} catch (error) {
  await qf.rollback();
  throw error;
}
```

## 📚 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/queryforge)
- [GitHub Repository](https://github.com/kurumelih/queryforge)
- [Changelog](CHANGELOG.md) 