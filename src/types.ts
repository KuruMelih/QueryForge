export type DatabaseType = 'mysql' | 'postgresql' | 'sqlite';

export type WhereCondition = {
  column: string;
  operator: '=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN' | 'IS NULL' | 'IS NOT NULL';
  value?: any;
  logic: 'AND' | 'OR';
};

export type JoinCondition = {
  table: string;
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  on: {
    leftColumn: string;
    operator: '=' | '>' | '<' | '>=' | '<=';
    rightColumn: string;
  };
};

export type OrderDirection = 'ASC' | 'DESC'; 