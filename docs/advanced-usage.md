# Advanced Usage

## Complex Queries

### Subqueries
```typescript
const result = await qf
  .table('users')
  .select('users.*', '(SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) as order_count')
  .where('status', '=', 'active')
  .execute();
```

### Multiple Joins
```typescript
const result = await qf
  .table('orders as o')
  .select(
    'o.id as order_id',
    'u.name as user_name',
    'p.name as product_name',
    'o.total'
  )
  .join('users as u', 'o.user_id', '=', 'u.id')
  .join('order_items as oi', 'o.id', '=', 'oi.order_id')
  .join('products as p', 'oi.product_id', '=', 'p.id')
  .where('o.status', '=', 'completed')
  .groupBy('o.id')
  .having('o.total', '>', 100)
  .execute();
```

### Complex Conditions
```typescript
const result = await qf
  .table('users')
  .select('*')
  .where('age', '>', 18)
  .andWhere('status', '=', 'active')
  .orWhere('role', '=', 'admin')
  .execute();
```

## Transaction Management

### Complex Transaction Example
```typescript
await qf.beginTransaction();
try {
  // Create order
  const [order] = await qf
    .table('orders')
    .insert({
      user_id: 1,
      total: 150,
      status: 'pending'
    })
    .execute();

  // Add order items
  await qf
    .table('order_items')
    .insertMany([
      { order_id: order.id, product_id: 1, quantity: 2, price: 50 },
      { order_id: order.id, product_id: 2, quantity: 1, price: 50 }
    ])
    .execute();

  // Update product stock
  await qf
    .table('products')
    .update({ 
      stock: qf.raw('stock - 2')
    })
    .where('id', '=', 1)
    .execute();

  await qf
    .table('products')
    .update({ 
      stock: qf.raw('stock - 1')
    })
    .where('id', '=', 2)
    .execute();

  // Update order status
  await qf
    .table('orders')
    .update({ status: 'completed' })
    .where('id', '=', order.id)
    .execute();

  await qf.commit();
} catch (error) {
  await qf.rollback();
  throw error;
}
```

## Raw SQL Usage

### Using Raw Expressions
```typescript
// In UPDATE queries
await qf
  .table('users')
  .update({
    login_count: qf.raw('login_count + 1'),
    last_login: qf.raw('CURRENT_TIMESTAMP')
  })
  .where('id', '=', 1)
  .execute();

// In SELECT queries
const result = await qf
  .table('users')
  .select(
    'id',
    'name',
    qf.raw('YEAR(created_at) as registration_year'),
    qf.raw('COUNT(DISTINCT order_id) as order_count')
  )
  .groupBy('id')
  .execute();
```

## Error Handling

### Custom Error Handler
```typescript
class DatabaseError extends Error {
  constructor(
    message: string,
    public query?: string,
    public params?: any[]
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

async function executeQuery<T>(
  queryFn: () => Promise<T>
): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    if (error instanceof Error) {
      throw new DatabaseError(
        error.message,
        // Add additional context if needed
      );
    }
    throw error;
  }
}

// Usage
try {
  await executeQuery(async () => {
    return await qf
      .table('users')
      .select('*')
      .where('invalid_column', '=', 'value')
      .execute();
  });
} catch (error) {
  if (error instanceof DatabaseError) {
    console.error('Database Error:', error.message);
    // Handle database specific error
  } else {
    console.error('Unexpected Error:', error);
  }
}
```

## Performance Optimization

### Batch Processing
```typescript
async function processBatch<T>(
  items: T[],
  batchSize: number,
  processFn: (batch: T[]) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processFn(batch);
  }
}

// Usage example
const users = [/* large array of users */];

await processBatch(users, 100, async (batch) => {
  await qf
    .table('users')
    .insertMany(batch)
    .execute();
});
```

### Optimizing SELECT Queries
```typescript
// Select only needed columns
const users = await qf
  .table('users')
  .select('id', 'name') // Instead of select('*')
  .where('status', '=', 'active')
  .execute();

// Use indexes effectively
await qf
  .table('users')
  .select('*')
  .where('email', '=', 'user@example.com') // Assuming email is indexed
  .execute();

// Limit result set size
const page = 1;
const pageSize = 20;
const results = await qf
  .table('users')
  .select('*')
  .orderBy('created_at', 'DESC')
  .limit(pageSize)
  .offset((page - 1) * pageSize)
  .execute();
``` 