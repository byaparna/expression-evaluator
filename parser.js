// parser.js - turns the list of tokens into a tree (AST) using recursion
//
// Grammar (lower rules bind tighter, which gives us operator precedence):
//   expression = term   (("+" | "-") term)*
//   term       = factor (("*" | "/") factor)*
//   factor     = number | "(" expression ")" | "-" factor
//
// Example: "3 + 5 * 2" becomes
//        +
//       / \
//      3   *
//         / \
//        5   2

function parse(tokens) {
  let pos = 0;

  function peek() {
    return tokens[pos];
  }

  function next() {
    return tokens[pos++];
  }

  function isOperator(token, ...ops) {
    return token !== undefined && token.type === "operator" && ops.includes(token.value);
  }

  // expression = term (("+" | "-") term)*
  function parseExpression() {
    let left = parseTerm();
    while (isOperator(peek(), "+", "-")) {
      const operator = next().value;
      const right = parseTerm();
      left = { type: "binary", operator, left, right };
    }
    return left;
  }

  // term = factor (("*" | "/") factor)*
  function parseTerm() {
    let left = parseFactor();
    while (isOperator(peek(), "*", "/")) {
      const operator = next().value;
      const right = parseFactor();
      left = { type: "binary", operator, left, right };
    }
    return left;
  }

  // factor = number | "(" expression ")" | "-" factor
  function parseFactor() {
    const token = next();

    if (token === undefined) {
      throw new Error("Unexpected end of expression");
    }

    if (token.type === "number") {
      return { type: "number", value: token.value };
    }

    if (token.type === "paren" && token.value === "(") {
      const inner = parseExpression();   // recursion: go back to the top
      const closing = next();
      if (closing === undefined || closing.value !== ")") {
        throw new Error('Missing closing ")"');
      }
      return inner;
    }

    if (isOperator(token, "-")) {
      return { type: "negate", operand: parseFactor() };
    }

    throw new Error(`Unexpected token: "${token.value}"`);
  }

  if (tokens.length === 0) {
    throw new Error("Empty expression");
  }

  const tree = parseExpression();

  // if tokens are left over, the expression was invalid (e.g. "3 4" or "3 + 4)")
  if (pos < tokens.length) {
    throw new Error(`Unexpected token: "${tokens[pos].value}"`);
  }

  return tree;
}

module.exports = { parse };
