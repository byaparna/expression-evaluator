// tokenizer.js - turns the input string into a list of tokens
// Example: "3 + 5" -> [ {type:"number", value:3}, {type:"operator", value:"+"}, {type:"number", value:5} ]

function isDigit(ch) {
  return ch >= "0" && ch <= "9";
}

function tokenize(input) {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    // skip spaces
    if (ch === " " || ch === "\t") {
      i++;
      continue;
    }

    // numbers (integers and decimals)
    if (isDigit(ch) || ch === ".") {
      let text = "";
      while (i < input.length && (isDigit(input[i]) || input[i] === ".")) {
        text += input[i];
        i++;
      }
      const value = Number(text);
      if (Number.isNaN(value)) {
        throw new Error(`Invalid number: "${text}"`);
      }
      tokens.push({ type: "number", value: value });
      continue;
    }

    // operators
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/") {
      tokens.push({ type: "operator", value: ch });
      i++;
      continue;
    }

    // parentheses
    if (ch === "(" || ch === ")") {
      tokens.push({ type: "paren", value: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: "${ch}"`);
  }

  return tokens;
}

module.exports = { tokenize };
