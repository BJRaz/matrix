/**
 * Represents a single recorded row operation that can be inspected.
 * Follows the Command pattern to allow inverse operations.
 */
export type RowOperation =
    | { type: 'swap'; row1: number; row2: number }
    | { type: 'scale'; row: number; factor: number }
    | { type: 'add'; targetRow: number; sourceRow: number; factor: number };

/**
 * Interface for solving a system of linear equations.
 *
 * Implementations encapsulate different numerical strategies (Gaussian elimination,
 * LU decomposition, iterative methods, etc.) while maintaining a consistent API.
 */
export interface LinearSystemSolver {
    /**
     * Solves the system of equations and returns the solution vector.
     * @returns Array of solution values [x1, x2, ..., xn]
     * @throws Error if the system has no unique solution
     */
    solve(): number[];

    /**
     * Returns the solution vector from the last solve operation.
     * @returns Array of solution values
     */
    getSolution(): number[];

    /**
     * Returns the operation history from the solve process.
     * Useful for inspection and debugging.
     * @returns Array of RowOperation in order
     */
    getOperationHistory(): RowOperation[];
}
