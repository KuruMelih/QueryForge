import { QueryForge } from '../src/QueryForge';
import { DatabaseConfig } from '../src/interfaces';

describe('QueryForge', () => {
  let queryForge: QueryForge;

  beforeEach(() => {
    const config: DatabaseConfig = {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'test',
      database: 'test_db'
    };
    queryForge = new QueryForge(config);
  });

  describe('SELECT queries', () => {
    test('should build a simple SELECT query', () => {
      const query = queryForge
        .table('users')
        .select('id', 'name', 'email')
        .where('age', '>', 18)
        .orderBy('name', 'ASC')
        .limit(10)
        .getState();

      expect(query.table).toBe('users');
      expect(query.columns).toEqual(['id', 'name', 'email']);
      expect(query.where[0]).toEqual({
        column: 'age',
        operator: '>',
        value: 18,
        logic: 'AND'
      });
      expect(query.orderBy[0]).toEqual({
        column: 'name',
        direction: 'ASC'
      });
      expect(query.limit).toBe(10);
    });
  });

  describe('INSERT queries', () => {
    test('should build a single INSERT query', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      };

      const state = queryForge
        .table('users')
        .insert(data)
        .getState();

      expect(state.type).toBe('INSERT');
      expect(state.columns).toEqual(['name', 'email', 'age']);
      expect(state.values).toEqual(['John Doe', 'john@example.com', 25]);
    });

    test('should build a bulk INSERT query', () => {
      const records = [
        { name: 'John Doe', email: 'john@example.com', age: 25 },
        { name: 'Jane Smith', email: 'jane@example.com', age: 30 }
      ];

      const state = queryForge
        .table('users')
        .insertMany(records)
        .getState();

      expect(state.type).toBe('INSERT');
      expect(state.columns).toEqual(['name', 'email', 'age']);
      expect(state.values).toEqual([
        'John Doe', 'john@example.com', 25,
        'Jane Smith', 'jane@example.com', 30
      ]);
    });
  });

  describe('UPDATE queries', () => {
    test('should build an UPDATE query', () => {
      const data = {
        name: 'John Smith',
        age: 26
      };

      const state = queryForge
        .table('users')
        .update(data)
        .where('id', '=', 1)
        .getState();

      expect(state.type).toBe('UPDATE');
      expect(state.updateValues).toEqual(data);
      expect(state.where[0]).toEqual({
        column: 'id',
        operator: '=',
        value: 1,
        logic: 'AND'
      });
    });
  });

  describe('DELETE queries', () => {
    test('should build a DELETE query', () => {
      const state = queryForge
        .table('users')
        .delete()
        .where('id', '=', 1)
        .getState();

      expect(state.type).toBe('DELETE');
      expect(state.where[0]).toEqual({
        column: 'id',
        operator: '=',
        value: 1,
        logic: 'AND'
      });
    });
  });
}); 