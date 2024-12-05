# JsonPATHLY

<img src="https://user-images.githubusercontent.com/9162276/166061295-a41b7d28-a1e9-4d17-9103-132a1ca20de8.png" width="350">

[![npm version](https://badge.fury.io/js/jsonpathly.svg)](https://badge.fury.io/js/jsonpathly)
[![codecov](https://codecov.io/gh/atamano/jsonpathly/branch/master/graph/badge.svg?token=QSSZGZMULF)](https://codecov.io/gh/atamano/jsonpathly)

**A secured and eval free typescript DSL for reading JSON documents.**

[Link to the Demo](https://atamano.github.io/jsonpathly-demo/)

## Install

Install from npm:

```bash
$ npm install jsonpathly
```

Install from yarn:

```bash
$ yarn add jsonpathly
```

## Getting Started

```javascript
import jp from "jsonpathly";

const cities = [
  { name: "London", population: 8615246 },
  { name: "Berlin", population: 3517424 },
  { name: "Madrid", population: 3165235 },
  { name: "Rome", population: 2870528 },
];

const names = jp.query(cities, "$..name");

// [ "London", "Berlin", "Madrid", "Rome" ]
```

JsonPath expressions are used to access elements in a JSON structure, similar to how XPath expressions are used with XML documents. The starting point in JsonPath is referred to as "$" and can be either an object or array.

JsonPath expressions can use either dot notation, such as

`$.store.book[0].title`

or bracket notation, like

`$['store']['book'][0]['title']`

## Operators

The following table lists the available operators for JsonPath expressions:

| Operator                  | Description                                                                       |
| :------------------------ | :-------------------------------------------------------------------------------- |
| `$`                       | Refers to the root element of the JSON structure. It starts all path expressions. |
| `@`                       | Refers to the current node being processed by a filter predicate.                 |
| `*`                       | Acts as a wildcard, and can be used anywhere.                                     |
| `..<name>`                | Enables deep scanning, and can be used anywhere. A name is required.              |
| `.<name>`                 | Refers to a dot-notated child element.                                            |
| `['<name>' (, '<name>')]` | Refers to bracket-notated child elements.                                         |
| `[<number> (, <number>)]` | Refers to array index or indexes.                                                 |
| `[start:end:step]`        | A python-style array slicing operator.                                            |
| `[?(<expression>)]`       | A filter expression that must evaluate to a boolean value.                        |

## Filter Operators

Filters are used to select specific elements from arrays based on logical expressions. The expression [?(@.age > 18)] filters items where the "age" property is greater than 18, with @ referring to the current item being processed. Complex filters can be created using the logical operators && and ||. When working with string literals, they must be surrounded by single or double quotes, such as [?(@.color == 'blue')] or [?(@.color == "blue")].

The following table lists different operators and their descriptions:

| Operator | Description                                                                        |
| :------- | :--------------------------------------------------------------------------------- |
| ==       | left is equal to the right (note that 1 is not equal to '1')                       |
| !=       | left is not equal to the right                                                     |
| <        | left is less than the right                                                        |
| <=       | left is less than or equal to the right                                            |
| >        | left is greater than the right                                                     |
| >=       | left is greater than or equal to the right                                         |
| in       | left exists in the right (e.g. `[?(@.size in ['S', 'M'])]`)                        |
| nin      | left does not exist in the right                                                   |
| subsetof | left is a subset of the right (e.g. [?(@.sizes subsetof ['S', 'M', 'L'])])         |
| anyof    | left has items in common with the right (e.g. [?(@.sizes anyof ['M', 'L'])])       |
| noneof   | left has no items in common with the right (e.g. [?(@.sizes noneof ['M', 'L'])])   |
| sizeof   | size of the left must match the size of the right (both must be arrays or strings) |
| size     | size of the left must match the right (right must be a number)                     |
| empty    | left (array or string) must be empty                                               |

## Methods

#### jp.query(obj, pathExpression[, options])

Used to find elements in the obj data that match the given pathExpression. The function returns an array of elements that match the expression or an empty array if none are found.

```javascript
import jp from "jsonpathly";

const players = jp.query(data, "$..players");
// [ 'Nigel Short', 'Garry Kasparov', 'Vladimir Kramnik', 'Magnus Carlsen' ]
```

| Option         | Description                                                             |
| :------------- | :---------------------------------------------------------------------- |
| hideExceptions | Suppresses any exceptions that may be raised during the path evaluation |
| returnArray    | Forces array return                                                     |

#### jp.paths(obj, pathExpression[, options])

Get the paths to elements in obj that match pathExpression. The result is a list of paths to elements that fulfill the specified JSONPath expression.

```javascript
const paths = jp.paths(data, "$..author");
// [
//   '$["store"]["book"][0]["author"]',
//   '$["store"]["book"][1]["author"]',
//   '$["store"]["book"][2]["author"]',
//   '$["store"]["book"][3]["author"]'
// ]
```

| Option         | Description                                                               |
| :------------- | :------------------------------------------------------------------------ |
| hideExceptions | This option ensures that no exceptions are thrown during path evaluation. |

#### jp.parse(pathExpression[, options])

Generates a structured tree representation of a JSONPath expression, with each node being of a specific type.

```javascript
const tree = jp.parse("$..author");
// { type: 'root', next: { type: 'subscript', value: { type: 'dotdot', value: { type: "identifier", value: "author" } } } }
```

| Option         | Description                                                               |
| :------------- | :------------------------------------------------------------------------ |
| hideExceptions | This option ensures that no exceptions are thrown during path evaluation. |

#### jp.stringify(tree)

Returns a jsonpath string from a tree representing jsonpath expression (jp.parse response)

```javascript
const jsonpath = jp.stringify({
  type: "root",
  next: {
    type: "subscript",
    value: { type: "dotdot", value: { type: "identifier", value: "author" } },
  },
});
// "$..author"
```

## Differences from other javascript implementations

Main reason you should use this library is for security and stability.

#### Evaluating Expressions

Script expressions (i.e., (...)) are disallowed to prevent XSS injections.

Filter expressions (i.e., ?(...)) also avoid using eval or static-eval for security reasons.

Instead, jsonpathly has its own parser and evaluator. For example, `$[(@.number +5 > $.otherNumber * 10 + 2)]`
is valid, but
`?(alert("hello"))` will produce a syntax error (which would trigger an alert in some JavaScript libraries).

#### Grammar

The project uses ANTLR [grammar](https://github.com/atamano/jsonpathly/blob/master/src/parser/generated/JSONPath.g4) to parse JSONPath expressions and construct a typed abstract syntax tree (AST).

#### Implementation

For an overview of jsonpathly implementations and to compare its differences with other libraries, you can visit https://cburgmer.github.io/json-path-comparison
