# Matrix

A TypeScript-based matrix operations tool for solving systems of linear equations using Gaussian elimination.

## Overview

This project provides a `Matrix` class that supports basic row operations commonly used in linear algebra:

- Insert a row at a specific index
- Add a scaled version of one row to another
- Scale a row by a constant
- Swap two rows
- Render the matrix in a readable format
- Get values at specific positions

## Prerequisites

- [Node.js](https://nodejs.org/) (with npm)
- TypeScript (installed via dev dependencies)

## Installation

```sh
npm install
```

## Build

Compile TypeScript to JavaScript:

```sh
npm run build
```

This runs `tsc -p tsconfig.json` and outputs `.js` and `.map` files alongside the source `.ts` files.

## Run

After building, run the demo application:

```sh
npm start
```

This executes `src/app.js`, which demonstrates solving the system of linear equations:

```
4x₁ +  x₂ = 9
 x₁ -  x₂ = 1
```

The program uses Gaussian elimination (row operations) to arrive at the solution **x₁ = 2**, **x₂ = 1**, and then reverses the operations to restore the original matrix.

## Test

Run the test suite using Jest:

```sh
npm test
```

Tests are located in `tests/matrix.test.ts`.

## Project Structure

```
├── src/
│   ├── app.ts          # Main application entry point
│   └── matrix.ts       # Matrix class implementation
├── tests/
│   └── matrix.test.ts  # Jest test suite
├── build/              # Compiled output (alternate)
├── .vscode/
│   ├── launch.json     # VS Code debug configuration
│   ├── tasks.json      # VS Code build tasks
│   └── settings.json   # VS Code workspace settings
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript compiler configuration
└── jest.config.js      # Jest configuration
```

## Usage Example

```typescript
import { Matrix } from "./matrix";

// Create a 2x3 augmented matrix (2 equations, 2 unknowns + 1 result column)
const matrix = new Matrix(2, 3);

// Set up the system: 4x₁ + x₂ = 9, x₁ - x₂ = 1
matrix.insertRowAtIndex(0, [4, 1, 9]);
matrix.insertRowAtIndex(1, [1, -1, 1]);

// Gaussian elimination
matrix.addToRow(0, 1, 1);      // row0 = row0 + 1 * row1
matrix.scaleRow(0, 1 / 5);     // row0 = (1/5) * row0
matrix.scaleRow(1, -1);        // row1 = -1 * row1
matrix.addToRow(1, 0, 1);      // row1 = row1 + 1 * row0

matrix.renderMatrix();
// Solution: x₁ = 2, x₂ = 1
```

## Matrix API

| Method | Description |
|---|---|
| `new Matrix(rows, cols)` | Create a matrix initialized with zeros |
| `insertRowAtIndex(index, values)` | Replace a row with the given values |
| `addToRow(target, source, scalar)` | Add `scalar × source` row to `target` row |
| `scaleRow(index, scalar)` | Multiply all values in a row by `scalar` (cannot be 0) |
| `swapRows(a, b)` | Swap two rows |
| `getValueAt(row, col)` | Get the value at a specific position |
| `getNoRows()` | Get the number of rows |
| `getNoCols()` | Get the number of columns |
| `renderMatrix()` | Print the matrix to the console |

## Debugging

A VS Code launch configuration is provided in `.vscode/launch.json`. Press **F5** to build and debug the application.

## License

ISC
