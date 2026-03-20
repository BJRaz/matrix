# GitHub Copilot Instructions for Matrix Project

You are an expert TypeScript developer assisting with the Matrix project. This project implements a matrix class for performing row operations and solving systems of linear equations using Gaussian elimination.

## Project Context

- **Language:** TypeScript
- **Runtime:** Node.js
- **Testing Framework:** Jest
- **Main Class:** `Matrix` in `src/matrix.ts`
- **Demo Application:** `src/app.ts` - solves 2×2 system of linear equations
- **Build Tool:** TypeScript Compiler (tsc)

## Code Style and Conventions

1. **TypeScript Best Practices:**
   - Use strict type checking (enabled in `tsconfig.json`)
   - Provide explicit type annotations for parameters and return values
   - Use access modifiers (`public`, `private`, `protected`) appropriately
   - Use meaningful variable names over abbreviated names

2. **Method Naming:**
   - Use camelCase for methods and properties
   - Use descriptive names: `insertRowAtIndex()`, `addToRow()`, `scaleRow()`
   - Prefix getters with `get`: `getValueAt()`, `getNoRows()`

3. **Error Handling:**
   - Throw descriptive errors for invalid operations:
     - Scaling by zero: `throw new Error('c must not be 0')`
     - Out of bounds: `throw new Error('Row index is out of bounds.')`
     - Invalid ranges: `throw new Error('Row is not within range.')`

4. **Documentation:**
   - Include JSDoc comments for all public methods
   - Document parameters, return types, and throws clauses
   - Provide usage examples in docstrings when helpful

## Matrix Class API

The `Matrix` class manages a 2D number array with the following methods:

```typescript
// Constructor
new Matrix(rows: number, cols: number)

// Core operations
insertRowAtIndex(rowIndex: number, row: number[]): void
addToRow(row1: number, row2: number, c: number): void
scaleRow(row: number, c: number): void
swapRows(row1: number, row2: number): void

// Accessors
getValueAt(row: number, col: number): number
getNoRows(): number
getNoCols(): number

// Display
renderMatrix(): void
```

## Testing Guidelines

- **Test Framework:** Jest with ts-jest preset
- **Test Location:** `tests/matrix.test.ts`
- **Coverage Areas:**
  - Matrix initialization with zeros
  - Row insertion at specific indices
  - Row operations (add, scale, swap)
  - Error conditions (zero scaling, out of bounds)
  - Integration tests combining multiple operations

**Run tests:** `npm test`

## Common Patterns

### System of Equations
The project solves systems in augmented matrix form:
```typescript
const matrix = new Matrix(2, 3); // 2 equations, 2 unknowns + 1 constant
matrix.insertRowAtIndex(0, [4, 1, 9]);   // 4x₁ + x₂ = 9
matrix.insertRowAtIndex(1, [1, -1, 1]);  // x₁ - x₂ = 1
```

### Gaussian Elimination Steps
1. Forward elimination: Create zeros below pivot
2. Back substitution: Extract solution values
3. Reverse operations (optional): Restore original matrix

## Development Workflow

1. **Make changes** to TypeScript files in `src/`
2. **Build:** `npm run build` or use VS Code build task (Ctrl+Shift+B)
3. **Test:** `npm test` to validate changes
4. **Debug:** Press F5 in VS Code to run with debugger
5. **Run:** `npm start` to execute the application

## When Helping with the Matrix Project

- **Implementing new features:** Maintain the strict type system and error handling patterns
- **Writing tests:** Use the existing test structure in `matrix.test.ts` as a template
- **Fixing bugs:** Ensure all row operations preserve mathematical correctness
- **Extending functionality:** Consider backward compatibility with existing method signatures
- **Performance:** The matrix operations are simple and correctness takes priority over optimization

## Key Files to Reference

- `src/matrix.ts` - Main implementation
- `src/app.ts` - Usage example
- `tests/matrix.test.ts` - Test patterns
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Test configuration

## Mathematical Correctness

Row operations must maintain the solution set:
- **Add scaled row:** `row1 += c * row2`
- **Scale row:** `row *= c` (where c ≠ 0)
- **Swap rows:** Rearranges but doesn't change relationships

Always verify that operations preserve the solution to the system.
