# QueryForge

A powerful and flexible query builder for TypeScript and JavaScript applications.

## Features

- Type-safe query building
- Support for multiple databases (MySQL, PostgreSQL, SQLite)
- Chain-able API
- SQL injection protection
- TypeScript and JavaScript support
- Comprehensive documentation
- Extensive test coverage

## Installation

```bash
npm install queryforge
```

## Quick Start

```typescript
import { QueryForge } from 'queryforge';

// Create a new query
const query = new QueryForge()
  .select('users')
  .where('age', '>', 18)
  .orderBy('name', 'DESC')
  .limit(10);

// Execute the query
const results = await query.execute();
```

## Documentation

For detailed documentation, please visit our [documentation page](docs/README.md).

## Examples

Check out our [examples directory](examples/) for more usage examples.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 