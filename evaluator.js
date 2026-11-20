// evaluator.js - calculates the value of the tree using recursion

function evaluate(node) {
  if (node.type === "number") {
    return node.value;
  }

  if (node.type === "negate") {
    return -evaluate(node.operand);
  }

  if (node.type === "binary") {
    const left = evaluate(node.left);
    const right = evaluate(node.right);

    if (node.operator === "+") return left + right;
    if (node.operator === "-") return left - right;
    if (node.operator === "*") return left * right;
    if (node.operator === "/") {
      if (right === 0) {
        throw new Error("Division by zero");
      }
      return left / right;
    }
  }

  throw new Error("Unknown node in expression tree");
}

module.exports = { evaluate };
