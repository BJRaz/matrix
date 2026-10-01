# Matrix

TypeScript toolkit for parsing and solving linear equation systems with Gaussian elimination.

## Current Status (April 2026)

The project currently includes:

- A focused `Matrix` class for row operations and matrix accessors
- A text equation pipeline (`Scanner` + `Parser`) for algebra input
- A pluggable solver architecture via `LinearSystemSolver`
- A production `GaussianEliminationSolver` implementation
- Jest test suites for matrix operations, parser/scanner, solver behavior, and Gaussian elimination internals

## Features

### Matrix operations

- Insert rows in an augmented matrix
- Add scaled source row into target row: `row1 += c * row2`
- Scale rows by non-zero constants
- Swap rows
- Read matrix values and dimensions

### Algebra parsing and solving

- Parse semicolon-separated equations, e.g. `4x1 + x2 = 9; x1 - x2 = 1`
- Support integer and decimal coefficients
- Support variable names like `x`, `x1`, `price`, `tax`
- Handle terms/constants on either side of `=`
- Solve for unique solutions through Gaussian elimination
- Return a typed `Record<string, number>` solution map

### Solver internals

- Deep-copy input matrix (solver does not mutate caller matrix)
- Partial pivoting (best absolute pivot per column)
- Floating-point tolerance checks (`EPSILON = 1e-10`)
- Operation history recording (`swap`, `scale`, `add`)

## Installation

```sh
npm install
```

## Scripts

```sh
npm run build
npm test
npm start
```

- `npm run build`: Compiles `src/` TypeScript into `build/`
- `npm test`: Runs Jest with `ts-jest` over `tests/**/*.test.ts`
- `npm start`: Runs `node build/app.js` (demo program)

## Usage

### High-level solver from text equations

```typescript
import { Solver } from "./solver";
import { Matrix } from "./matrix";
import { GaussianEliminationSolver } from "./solvers/gaussianEliminationSolver";

const solverFactory = (matrix: Matrix) => new GaussianEliminationSolver(matrix);
const solver = new Solver(solverFactory);

const solution = solver.solveAlgebra("4x1 + x2 = 9; x1 - x2 = 1");
// { x1: 2, x2: 1 }
```

### Matrix API (core operations)

| Method | Description |
|---|---|
| `new Matrix(rows, cols)` | Create a zero-initialized matrix |
| `insertRowAtIndex(rowIndex, row)` | Replace a row at index |
| `addToRow(row1, row2, c)` | `row1 += c * row2` |
| `scaleRow(row, c)` | Scale row by non-zero `c` |
| `swapRows(row1, row2)` | Swap two rows |
| `getValueAt(row, col)` | Read a value |
| `getNoRows()` | Number of rows |
| `getNoCols()` | Number of columns |
| `renderMatrix()` | Print matrix to console |

## Error Handling

Examples of current validation behavior:

- Matrix row bounds checks (`Row index is out of bounds.`, `Row is not within range.`)
- Zero-scaling prevention (`c must not be 0`)
- Parser/scanner syntax errors (`Unexpected character`, missing `=`)
- Solver shape validation (equation/variable count mismatch)
- No-unique-solution detection (singular or inconsistent systems)

## Project Structure

```text
src/
	app.ts                           # Demo app (multiple sample systems)
	matrix.ts                        # Matrix data structure + row operations
	parser.ts                        # Scanner, token types, parser AST output
	solver.ts                        # High-level orchestration: parse -> matrix -> solve
	solvers/
		interfaces.ts                  # LinearSystemSolver, RowOperation
		gaussianEliminationSolver.ts   # Gaussian elimination implementation

tests/
	matrix.test.ts
	solver.test.ts
	gaussianEliminationSolver.test.ts
```

## Notes

- TypeScript strict mode is enabled in `tsconfig.json`
- Jest config lives in `jest.config.ts`
- Build output is generated to `build/`
- Ongoing updates are tracked in `CHANGELOG.md`

## License

ISC
