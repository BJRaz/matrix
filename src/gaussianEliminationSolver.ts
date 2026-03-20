import { Matrix } from "./matrix";
import { LinearSystemSolver, RowOperation } from "./interfaces";

/**
 * Solves a system of linear equations using Gaussian elimination.
 *
 * This class encapsulates the Gaussian elimination algorithm and operation recording,
 * keeping the Matrix class focused on its core responsibility: data structure management.
 *
 * The solver:
 * - Accepts an augmented matrix (coefficients | constants)
 * - Performs forward elimination and back substitution to reduce to RREF
 * - Records all row operations for inspection
 * - Returns the solution vector without modifying the input matrix
 *
 * @example
 * const matrix = new Matrix(2, 3);
 * matrix.insertRowAtIndex(0, [4, 1, 9]);
 * matrix.insertRowAtIndex(1, [1, -1, 1]);
 *
 * const solver = new GaussianEliminationSolver(matrix);
 * const solution = solver.solve(); // [2, 1]
 * const operations = solver.getOperationHistory(); // record of row ops
 */
export class GaussianEliminationSolver implements LinearSystemSolver {
    /** Floating-point tolerance used for comparing values to zero */
    private static readonly EPSILON: number = 1e-10;

    /** Stack of operations performed (most recent last) */
    private operationHistory: RowOperation[] = [];

    /** The matrix being solved (modified in place during solve) */
    private matrix: Matrix;

    constructor(matrix: Matrix) {
        // Create a deep copy so we don't modify the input matrix
        this.matrix = new Matrix(matrix.getNoRows(), matrix.getNoCols());
        for (let i = 0; i < matrix.getNoRows(); i++) {
            const row: number[] = [];
            for (let j = 0; j < matrix.getNoCols(); j++) {
                row.push(matrix.getValueAt(i, j));
            }
            this.matrix.insertRowAtIndex(i, row);
        }
    }

    /**
     * Checks whether a value is effectively zero within floating-point tolerance.
     * @param value The value to check
     * @returns true if the absolute value is less than EPSILON
     */
    private isEffectivelyZero(value: number): boolean {
        return Math.abs(value) < GaussianEliminationSolver.EPSILON;
    }

    /**
     * Records an operation to the history.
     * @param operation The row operation to record
     */
    private recordOperation(operation: RowOperation): void {
        this.operationHistory.push(operation);
    }

    /**
     * Performs Gaussian elimination to reduce the augmented matrix to
     * reduced row-echelon form (RREF), solving the system of linear equations.
     *
     * Uses floating-point tolerance (epsilon) for zero comparisons.
     * Records all operations for inspection.
     *
     * @throws Error if the system has no unique solution (singular matrix or zero pivot encountered)
     *
     * @example
     * const solver = new GaussianEliminationSolver(matrix);
     * solver.solve();
     * // Matrix is now in RREF: [[1, 0, 2], [0, 1, 1]]
     * const solution = solver.getSolution(); // [2, 1]
     */
    public solve(): number[] {
        const numPivots = Math.min(this.matrix.getNoRows(), this.matrix.getNoCols() - 1);

        // Forward elimination: produce row-echelon form
        for (let pivotCol = 0; pivotCol < numPivots; pivotCol++) {
            // Find the best pivot row (largest absolute value for numerical stability)
            let maxVal = Math.abs(this.matrix.getValueAt(pivotCol, pivotCol));
            let maxRow = pivotCol;
            for (let row = pivotCol + 1; row < this.matrix.getNoRows(); row++) {
                const absVal = Math.abs(this.matrix.getValueAt(row, pivotCol));
                if (absVal > maxVal) {
                    maxVal = absVal;
                    maxRow = row;
                }
            }

            // Check if pivot is effectively zero (singular matrix)
            if (this.isEffectivelyZero(this.matrix.getValueAt(maxRow, pivotCol))) {
                throw new Error(
                    `No unique solution: zero pivot encountered in column ${pivotCol}. ` +
                    `The system may be inconsistent or have infinitely many solutions.`
                );
            }

            // Swap current row with the best pivot row if needed
            if (maxRow !== pivotCol) {
                this.matrix.swapRows(pivotCol, maxRow);
                this.recordOperation({ type: 'swap', row1: pivotCol, row2: maxRow });
            }

            // Scale pivot row so the pivot element becomes 1
            const pivotValue = this.matrix.getValueAt(pivotCol, pivotCol);
            if (!this.isEffectivelyZero(pivotValue - 1)) {
                const scaleFactor = 1 / pivotValue;
                this.matrix.scaleRow(pivotCol, scaleFactor);
                this.recordOperation({ type: 'scale', row: pivotCol, factor: scaleFactor });
            }

            // Eliminate all rows below the pivot
            for (let row = pivotCol + 1; row < this.matrix.getNoRows(); row++) {
                const factor = this.matrix.getValueAt(row, pivotCol);
                if (!this.isEffectivelyZero(factor)) {
                    this.matrix.addToRow(row, pivotCol, -factor);
                    this.recordOperation({ type: 'add', targetRow: row, sourceRow: pivotCol, factor: -factor });
                }
            }
        }

        // Back substitution: produce reduced row-echelon form
        for (let pivotCol = numPivots - 1; pivotCol >= 1; pivotCol--) {
            for (let row = pivotCol - 1; row >= 0; row--) {
                const factor = this.matrix.getValueAt(row, pivotCol);
                if (!this.isEffectivelyZero(factor)) {
                    this.matrix.addToRow(row, pivotCol, -factor);
                    this.recordOperation({ type: 'add', targetRow: row, sourceRow: pivotCol, factor: -factor });
                }
            }
        }

        return this.getSolution();
    }

    /**
     * Extracts the solution vector from the solved augmented matrix (RREF).
     * The solution values are taken from the last column of each row.
     *
     * @returns An array of solution values [x1, x2, ..., xn]
     *
     * @example
     * const solution = solver.getSolution(); // [2, 1]
     */
    public getSolution(): number[] {
        const lastCol = this.matrix.getNoCols() - 1;
        const solution: number[] = [];
        for (let row = 0; row < this.matrix.getNoRows(); row++) {
            solution.push(this.matrix.getValueAt(row, lastCol));
        }
        return solution;
    }

    /**
     * Returns a copy of the recorded operation history.
     * @returns Array of RowOperation in the order they were performed
     */
    public getOperationHistory(): RowOperation[] {
        return [...this.operationHistory];
    }

    /**
     * Returns the solved matrix in reduced row-echelon form.
     * @returns The Matrix object after solve() has been called
     */
    public getSolvedMatrix(): Matrix {
        return this.matrix;
    }
}
