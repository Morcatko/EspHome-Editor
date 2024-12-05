export type Root = {
  type: 'root';
  next: Subscript | null;
};

export type Current = {
  type: 'current';
  next: Subscript | null;
};

export type ValueObject = { type: 'value'; value: Record<string, unknown>; subtype: 'object' };
export type ValueArray = { type: 'value'; value: unknown[]; subtype: 'array' };
export type ValueString = { type: 'value'; value: string; subtype: 'string' };
export type ValueBoolean = { type: 'value'; value: boolean; subtype: 'boolean' };
export type ValueNumber = { type: 'value'; value: number; subtype: 'number' };
export type ValueNull = { type: 'value'; value: null; subtype: 'null' };
export type ValueRegex = { type: 'value'; value: `/${string}/`; subtype: 'regex'; opts: string };

export type Value = ValueString | ValueBoolean | ValueNumber | ValueNull | ValueArray | ValueObject | ValueRegex;

export type NotExpression = {
  type: 'notExpression';
  value: FilterExpressionContent;
};

export type GroupExpression = {
  type: 'groupExpression';
  value: FilterExpressionContent;
};

export type GroupOperation = {
  type: 'groupOperation';
  value: OperationContent;
};

export type LogicalExpression = {
  type: 'logicalExpression';
  operator: 'or' | 'and';
  left: FilterExpressionContent;
  right: FilterExpressionContent;
};

export type Slices = {
  type: 'slices';
  start: number | null;
  end: number | null;
  step: number | null;
};

export type Comparator =
  | {
      type: 'comparator';
      operator:
        | 'eq'
        | 'ne'
        | 'lt'
        | 'le'
        | 'gt'
        | 'ge'
        | 'in'
        | 'nin'
        | 'subsetof'
        | 'anyof'
        | 'noneof'
        | 'size'
        | 'sizeof';
      left: OperationContent;
      right: OperationContent;
    }
  | { type: 'comparator'; operator: 'reg'; left: OperationContent; right: ValueRegex }
  | { type: 'comparator'; operator: 'empty'; left: OperationContent; right: null };

export type DotContent = Identifier | NumericLiteral | Wildcard;

export type Dot = {
  type: 'dot';
  value: DotContent;
};

export type DotDotContent = Identifier | Wildcard | BracketMember | BracketExpression;

export type DotDot = {
  type: 'dotdot';
  value: DotDotContent;
};

export type BracketMemberContent = Identifier | NumericLiteral | StringLiteral;
export type BracketExpressionContent = Wildcard | FilterExpression | Slices | Unions | Indexes;

export type BracketExpression = {
  type: 'bracketExpression';
  value: BracketExpressionContent;
};

export type BracketMember = {
  type: 'bracketMember';
  value: BracketMemberContent;
};

export type Subscript = {
  type: 'subscript';
  value: Dot | DotDot | BracketMember | BracketExpression;
  next: Subscript | null;
};

export type Wildcard = {
  type: 'wildcard';
};

export type StringLiteral = {
  type: 'stringLiteral';
  value: string;
};

export type Identifier = {
  type: 'identifier';
  value: string;
};

export type NumericLiteral = {
  type: 'numericLiteral';
  value: number;
};

export type Indexes = {
  type: 'indexes';
  values: NumericLiteral[];
};

export type Unions = {
  type: 'unions';
  values: (StringLiteral | Identifier)[];
};

export type FilterExpressionContent =
  | Comparator
  | GroupExpression
  | LogicalExpression
  | NotExpression
  | Current
  | Root
  | Value;

export type FilterExpression = {
  type: 'filterExpression';
  value: FilterExpressionContent;
};

export type OperationContent = Root | Current | Value | GroupOperation | Operation;

export type Operation = {
  type: 'operation';
  operator: 'plus' | 'minus' | 'multi' | 'div' | '';
  left: OperationContent;
  right: OperationContent;
};

export type JsonPathElement =
  | ValueObject
  | ValueString
  | ValueBoolean
  | ValueArray
  | ValueNumber
  | ValueNull
  | ValueRegex
  | Root
  | Current
  | NotExpression
  | GroupOperation
  | GroupExpression
  | LogicalExpression
  | Slices
  | Comparator
  | Dot
  | DotDot
  | BracketMember
  | BracketExpression
  | Subscript
  | Wildcard
  | StringLiteral
  | Identifier
  | NumericLiteral
  | Indexes
  | Unions
  | FilterExpression
  | Operation;
