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

  test('should build a simple SELECT query', async () => {
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