export type DatabaseType = 'mysql' | 'postgresql' | 'sqlite';

export type Operator = '=' | '>' | '<' | '>=' | '<=' | '<>' | 'LIKE' | 'IN' | 'NOT IN' | 'BETWEEN' | 'IS NULL' | 'IS NOT NULL';

export type OrderDirection = 'ASC' | 'DESC';

export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';

export type WhereCondition = {
  column: string;
  operator: Operator;
  value: any;
  logic?: 'AND' | 'OR';
};

export type JoinCondition = {
  table: string;
  type: JoinType;
  on: {
    leftColumn: string;
    operator: Operator;
    rightColumn: string;
  };
}; 