// index.js - application entry point
//
// Usage:
//   node src/index.js "3 + 5 * (2 - 8)"   -> evaluates one expression
//   node src/index.js                     -> interactive mode (type "exit" to quit)

const readline = require("readline");
const { tokenize } = require("./tokenizer");
const { parse } = require("./parser");
const { evaluate } = require("./evaluator");

function calculate(input) {
  const tokens = tokenize(input);
  const tree = parse(tokens);
  return evaluate(tree);
}

function run(input) {
  try {
    console.log(calculate(input));
  } catch (error) {
    console.log("Error:", error.message);
  }
}

const arg = process.argv.slice(2).join(" ");

if (arg) {
  run(arg);
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('Expression Evaluator - type an expression, or "exit" to quit.');

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", (line) => {
    if (line.trim().toLowerCase() === "exit") {
      rl.close();
      return;
    }
    if (line.trim() !== "") {
      run(line);
    }
    rl.prompt();
  });
}
