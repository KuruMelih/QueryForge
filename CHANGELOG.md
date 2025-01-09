# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2024-01-09

### Added
- Complete CRUD operations support
  * Enhanced INSERT operations with single and bulk insert
  * Improved SELECT queries with complex conditions
  * Advanced UPDATE operations with WHERE clauses
  * Robust DELETE operations
  * Full transaction support for all operations
- Comprehensive examples for all CRUD operations
- Better error handling for database operations

### Fixed
- Fixed WHERE clause accumulation in consecutive queries
- Fixed ORDER BY clause duplication
- Improved state management in QueryBuilder
- Enhanced error handling in database connections
- Added proper state reset between queries

### Changed
- Updated TypeScript configuration for better type safety
- Improved documentation and examples
- Enhanced error messages for better debugging
- Optimized bulk insert operations
- Added detailed examples for each CRUD operation

## [0.1.0] - 2024-01-09

### Added
- Initial release with core query builder functionality
- Support for MySQL, PostgreSQL, and SQLite databases
- Fluent API for building SQL queries
- Basic CRUD operations (SELECT, INSERT, UPDATE, DELETE)
- Transaction management with commit and rollback
- Connection management with pooling
- Type-safe query building with TypeScript
- Parameterized queries for SQL injection protection
- Comprehensive test suite with Jest
- Basic documentation and examples

### Features
- SELECT queries with WHERE, JOIN, GROUP BY, HAVING, ORDER BY, LIMIT, and OFFSET
- Single and bulk INSERT operations
- UPDATE queries with WHERE conditions
- DELETE queries with WHERE conditions
- Transaction support (BEGIN, COMMIT, ROLLBACK)
- Connection pooling and management
- Error handling and logging
- TypeScript support with type definitions
- SQL injection protection through parameterized queries

[0.1.1]: https://github.com/kurumelih/queryforge/releases/tag/v0.1.1
[0.1.0]: https://github.com/kurumelih/queryforge/releases/tag/v0.1.0 