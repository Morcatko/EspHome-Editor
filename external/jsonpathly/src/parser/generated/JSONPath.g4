grammar JSONPath;

////////////
// TOKENS //
///////////

CURRENT_VALUE : '@' ;
DOTDOT : '..' ;
ROOT_VALUE : '$' ;
DOT : '.' ;
STAR : '*' ;

AND : '&&' ;
EQ : '==' ;
GE : '>=' ;
GT : '>' ;
LE : '<=' ;
LT : '<' ;
NE : '!=' ;
REG : '=~' ;
IN : ' in ' ;
NIN : ' nin ' ;
SUB : ' subsetof ' ;
ANY : ' anyof ' ;
NON : ' noneof ' ;
SIZO : ' sizeof ' ;
SIZ : ' size ' ;
EMPT : ' empty' ;
NOT : '!' ;
OR : '||' ;

TRUE : 'true' ;
FALSE : 'false' ;
NULL : 'null' ;

BRACE_LEFT : '{' ;
BRACE_RIGHT : '}' ;
BRACKET_LEFT : '[' ;
BRACKET_RIGHT : ']' ;
COLON : ':' ;
COMMA : ',' ;
PAREN_LEFT : '(' ;
PAREN_RIGHT : ')' ;
QUESTION : '?' ;

MINUS_SP: '- ';
PLUS: '+';
DIV: '/';

REGEX_OPT: [gimsuy]*;
REGEX_EXPR: '/'.*?'/';
KEY: [a-zA-Z-_]*[a-zA-Z_][a-zA-Z0-9_]*;
SPECIAL_KEY: [\u0080-\uFFFF_]+;

WS
   : [ \t\n\r] + -> skip
   ;

NUMBER
   : '-'? INT ('.' [0-9] +)? EXP?
   ;

STRING
   : '"' (ESC_DOUBLE | SAFECODEPOINT_DOUBLE)* '"'
   | '\'' (ESC_SINGLE | SAFECODEPOINT_SINGLE)* '\''
   ;

///////////////
// FRAGMENTS //
//////////////

fragment ESC_SINGLE
   : '\\' (['\\/bfnrt] | UNICODE)
   ;

fragment ESC_DOUBLE
   : '\\' (["\\/bfnrt] | UNICODE)
   ;

fragment UNICODE
   : 'u' HEX HEX HEX HEX
   ;

fragment HEX
   : [0-9a-fA-F]
   ;

fragment SAFECODEPOINT_SINGLE
   : ~ ['\\\u0000-\u001F]
   ;

fragment SAFECODEPOINT_DOUBLE
   : ~ ["\\\u0000-\u001F]
   ;

fragment INT
   : [0-9]+
   ;
// with leading zeros

fragment EXP
   : [Ee] [+\-]? INT
   ;
// \- since - means "range" inside [...]

/////////////
// QUERIES //
////////////

jsonpath
   : ROOT_VALUE subscript? EOF
   ;

filterarg
   : PAREN_LEFT filterarg PAREN_RIGHT
   | filterarg ( STAR | DIV ) filterarg
   | filterarg ( PLUS | MINUS_SP )? filterarg
   | value
   | filterpath
   ;

subscript
   : DOTDOT dotdotContent subscript?
   | DOT dotContent subscript?
   | bracket subscript?
   ;

dotdotContent
   : STAR
   | identifier
   | bracket
   ;

dotContent
   : STAR
   | NUMBER
   | identifier
   ;

bracket
   : BRACKET_LEFT bracketContent BRACKET_RIGHT
   ;

bracketContent
   : unions
   | indexes
   | slices
   | STAR
   | NUMBER
   | STRING
   | identifier
   | filterExpression
   ;

filterExpression
   : QUESTION PAREN_LEFT expression PAREN_RIGHT
   ;

indexes
   : NUMBER ( COMMA NUMBER )+
   ;

unions
   : STRING ( COMMA STRING )+
   | identifier ( COMMA identifier )+
   ;

slices
   : NUMBER? COLON NUMBER? ( COLON ( NUMBER )? )?
   ;

regex : REGEX_EXPR REGEX_OPT?;

expression
   : NOT PAREN_LEFT expression PAREN_RIGHT
   | PAREN_LEFT expression PAREN_RIGHT
   | expression ( AND | OR ) expression
   | filterarg ( EQ | NE | LT | LE | GT | GE | IN | NIN | SUB | ANY | SIZO| NON | SIZ ) filterarg
   | filterarg REG regex
   | filterarg EMPT
   | filterpath
   | TRUE
   | FALSE
   | NULL
   ;

filterpath
   : ( ROOT_VALUE | CURRENT_VALUE ) subscript?
   ;

identifier
   : KEY
   | SPECIAL_KEY
   | TRUE
   | FALSE
   | NULL
   ;

obj
   : BRACE_LEFT pair ( COMMA pair )* BRACE_RIGHT
   | BRACE_LEFT BRACE_RIGHT
   ;

pair
   : STRING COLON value
   ;

array
   : BRACKET_LEFT value ( COMMA value )* BRACKET_RIGHT
   | BRACKET_LEFT BRACKET_RIGHT
   ;

value
   : STRING
   | NUMBER
   | obj
   | array
   | TRUE
   | FALSE
   | NULL
   ;

