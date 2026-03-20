/**
 * Represents a single recorded row operation that can be undone/redone.
 * Follows the Command pattern to allow inverse operations.
 */
export type RowOperation =
    | { type: 'swap'; row1: number; row2: number }
    | { type: 'scale'; row: number; factor: number }
    | { type: 'add'; targetRow: number; sourceRow: number; factor: number };

/**
 * A simple matrix class that supports basic row operations and rendering.
 * This class is designed to help with solving systems of linear equations using Gaussian elimination.
 * The matrix is represented as a 2D array of numbers, and the class provides methods to:
 * - Insert a row at a specific index
 * - Add a scaled version of one row to another row
 * - Scale a row by a constant
 * - Swap two rows
 * - Render the matrix in a readable format
 * - Get the number of rows and columns
 * - Get the value at a specific row and column
 * - Perform Gaussian elimination to solve a system of linear equations
 * - Undo/redo operations using recorded operation history
 *
 * The class also includes error handling for out-of-bounds indices and invalid scaling factors.
 *
 * @example
 * const matrix = new Matrix(2, 3);
 * matrix.insertRowAtIndex(0, [4, 1, 9]);
 * matrix.insertRowAtIndex(1, [1, -1, 1]);
 * matrix.gaussianElimination();
 * const solution = matrix.getSolution(); // [2, 1]
 * matrix.undoAll(); // restores original matrix
 */
export class Matrix {
    /** The underlying 2D number array representing the matrix */
    public totalMatrix: number[][];

    /** Floating-point tolerance used for comparing values to zero */
    private static readonly EPSILON: number = 1e-10;

    /** Stack of operations performed (most recent last), used for undo */
    private operationHistory: RowOperation[] = [];

    /** Stack of operations that have been undone, used for redo */
    private redoHistory: RowOperation[] = [];

    constructor(protected rows: number, protected cols: number) {
        this.totalMatrix = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }

    /**
     * Inserts a row at the specified index in the matrix. 
     * The row should be an array of numbers with a length equal to the number of columns in the matrix.
     * @param rowIndex 
     * @param row 
     */
    public insertRowAtIndex(rowIndex: number, row: number[]): void {
        if (rowIndex >= this.rows || rowIndex < 0) {
            throw new Error('Row index is out of bounds.');
        }
        this.totalMatrix[rowIndex] = row;
    }

    /**
     * Adds a scaled version of one row (row2) to another row (row1).
     * The parameter c is the scaling factor applied to row2 before adding it to row1.
     * For example, if c is 2, then row1 will be updated to row1 + 2 * row2.    
     *  
     * @param row1 
     * @param row2 
     * @param c 
     */
    public addToRow(row1: number, row2: number, c: number): void {
        if (row1 >= this.rows || row2 >= this.rows || row1 < 0 || row2 < 0) {
            throw new Error('Row indices must be within range.');
        }
        for (let i = 0; i < this.cols; i++) {
            this.totalMatrix[row1][i] += c * this.totalMatrix[row2][i];
        }
    }

    public scaleRow(row: number, c: number): void {
        if (c === 0) throw new Error('c must not be 0');
        if (row >= this.rows || row < 0) throw new Error('Row is not within range.');
        for (let i = 0; i < this.cols; i++) {
            this.totalMatrix[row][i] *= c;
        }
    }

    public swapRows(row1: number, row2: number): void {
        [this.totalMatrix[row1], this.totalMatrix[row2]] = [this.totalMatrix[row2], this.totalMatrix[row1]];
    }

    public renderMatrix(): void {
        const str = this.totalMatrix.map((row, index) => `[${index}] [ ${row.join(' ')} ]`).join('\n');
        console.log(str);
    }

    public getNoRows(): number {
        return this.rows;
    }

    public getNoCols(): number {
        return this.cols;
    }

    public getValueAt(row: number, col: number): number {
        return this.totalMatrix[row][col];
    }

    // --- Gaussian Elimination ---

    /**
     * Checks whether a value is effectively zero within floating-point tolerance.
     * @param value The value to check
     * @returns true if the absolute value is less than EPSILON
     */
    private isEffectivelyZero(value: number): boolean {
        return Math.abs(value) < Matrix.EPSILON;
    }

    /**
     * Performs Gaussian elimination to reduce the augmented matrix to
     * reduced row-echelon form (RREF), solving the system of linear equations.
     *
     * Uses floating-point tolerance (epsilon) for zero comparisons.
     * Records all operations for undo/redo support.
     *
     * @throws Error if the system has no unique solution (singular matrix or zero pivot encountered)
     *
     * @example
     * const matrix = new Matrix(2, 3);
     * matrix.insertRowAtIndex(0, [4, 1, 9]);
     * matrix.insertRowAtIndex(1, [1, -1, 1]);
     * matrix.gaussianElimination();
     * // Matrix is now in RREF: [[1, 0, 2], [0, 1, 1]]
     */
    public gaussianElimination(): void {
        const numPivots = Math.min(this.rows, this.cols - 1);

        // Forward elimination: produce row-echelon form
        for (let pivotCol = 0; pivotCol < numPivots; pivotCol++) {
            // Find the best pivot row (largest absolute value for numerical stability)
            let maxVal = Math.abs(this.totalMatrix[pivotCol][pivotCol]);
            let maxRow = pivotCol;
            for (let row = pivotCol + 1; row < this.rows; row++) {
                const absVal = Math.abs(this.totalMatrix[row][pivotCol]);
                if (absVal > maxVal) {
                    maxVal = absVal;
                    maxRow = row;
                }
            }

            // Check if pivot is effectively zero (singular matrix)
            if (this.isEffectivelyZero(this.totalMatrix[maxRow][pivotCol])) {
                throw new Error(
                    `No unique solution: zero pivot encountered in column ${pivotCol}. ` +
                    `The system may be inconsistent or have infinitely many solutions.`
                );
            }

            // Swap current row with the best pivot row if needed
            if (maxRow !== pivotCol) {
                this.swapRows(pivotCol, maxRow);
                this.recordOperation({ type: 'swap', row1: pivotCol, row2: maxRow });
            }

            // Scale pivot row so the pivot element becomes 1
            const pivotValue = this.totalMatrix[pivotCol][pivotCol];
            if (!this.isEffectivelyZero(pivotValue - 1)) {
                const scaleFactor = 1 / pivotValue;
                this.scaleRow(pivotCol, scaleFactor);
                this.recordOperation({ type: 'scale', row: pivotCol, factor: scaleFactor });
            }

            // Eliminate all rows below the pivot
            for (let row = pivotCol + 1; row < this.rows; row++) {
                const factor = this.totalMatrix[row][pivotCol];
                if (!this.isEffectivelyZero(factor)) {
                    this.addToRow(row, pivotCol, -factor);
                    this.recordOperation({ type: 'add', targetRow: row, sourceRow: pivotCol, factor: -factor });
                }
            }
        }

        // Back substitution: produce reduced row-echelon form
        for (let pivotCol = numPivots - 1; pivotCol >= 1; pivotCol--) {
            for (let row = pivotCol - 1; row >= 0; row--) {
                const factor = this.totalMatrix[row][pivotCol];
                if (!this.isEffectivelyZero(factor)) {
                    this.addToRow(row, pivotCol, -factor);
                    this.recordOperation({ type: 'add', targetRow: row, sourceRow: pivotCol, factor: -factor });
                }
            }
        }
    }

    /**
     * Extracts the solution vector from a solved augmented matrix (RREF).
     * The solution values are taken from the last column of each row.
     *
     * @returns An array of solution values [x1, x2, ..., xn]
     *
     * @example
     * matrix.gaussianElimination();
     * const solution = matrix.getSolution(); // [2, 1]
     */
    public getSolution(): number[] {
        const lastCol = this.cols - 1;
        const solution: number[] = [];
        for (let row = 0; row < this.rows; row++) {
            solution.push(this.totalMatrix[row][lastCol]);
        }
        return solution;
    }

    // --- Operation History (Undo/Redo) ---

    /**
     * Records an operation to the history stack and clears the redo history.
     * @param operation The row operation to record
     */
    private recordOperation(operation: RowOperation): void {
        this.operationHistory.push(operation);
        this.redoHistory = [];
    }

    /**
     * Returns a copy of the recorded operation history.
     * @returns Array of RowOperation in the order they were performed
     */
    public getOperationHistory(): RowOperation[] {
        return [...this.operationHistory];
    }

    /**
     * Applies the inverse of a single row operation.
     * - swap → swap (self-inverse)
     * - scale by factor → scale by 1/factor
     * - add factor * source to target → add -factor * source to target
     *
     * @param operation The operation to invert and apply
     */
    private applyInverse(operation: RowOperation): void {
        switch (operation.type) {
            case 'swap':
                this.swapRows(operation.row1, operation.row2);
                break;
            case 'scale':
                this.scaleRow(operation.row, 1 / operation.factor);
                break;
            case 'add':
                this.addToRow(operation.targetRow, operation.sourceRow, -operation.factor);
                break;
        }
    }

    /**
     * Applies a single row operation exactly as recorded.
     * @param operation The operation to replay
     */
    private applyOperation(operation: RowOperation): void {
        switch (operation.type) {
            case 'swap':
                this.swapRows(operation.row1, operation.row2);
                break;
            case 'scale':
                this.scaleRow(operation.row, operation.factor);
                break;
            case 'add':
                this.addToRow(operation.targetRow, operation.sourceRow, operation.factor);
                break;
        }
    }

    /**
     * Undoes the most recent operation.
     * The undone operation is moved to the redo stack.
     *
     * @throws Error if there are no operations to undo
     */
    public undo(): void {
        const operation = this.operationHistory.pop();
        if (!operation) {
            throw new Error('No operations to undo.');
        }
        this.applyInverse(operation);
        this.redoHistory.push(operation);
    }

    /**
     * Redoes the most recently undone operation.
     * The redone operation is moved back to the operation history.
     *
     * @throws Error if there are no operations to redo
     */
    public redo(): void {
        const operation = this.redoHistory.pop();
        if (!operation) {
            throw new Error('No operations to redo.');
        }
        this.applyOperation(operation);
        this.operationHistory.push(operation);
    }

    /**
     * Undoes all recorded operations, restoring the matrix to the state
     * before any recorded operations were applied.
     * All undone operations are moved to the redo stack.
     */
    public undoAll(): void {
        while (this.operationHistory.length > 0) {
            this.undo();
        }
    }

    /**
     * Redoes all previously undone operations, restoring the matrix
     * to the state after all operations were applied.
     */
    public redoAll(): void {
        while (this.redoHistory.length > 0) {
            this.redo();
        }
    }

    /**
     * Clears all operation history and redo history.
     */
    public clearHistory(): void {
        this.operationHistory = [];
        this.redoHistory = [];
    }
}
