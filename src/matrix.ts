/**
 * A matrix class that manages 2D array data and supports basic row operations.
 * Responsibilities: data structure management and primitive row manipulations.
 * Does NOT handle solving algorithms or undo/redo (separate concerns).
 *
 * Provides methods to:
 * - Insert a row at a specific index
 * - Add a scaled version of one row to another
 * - Scale a row by a constant
 * - Swap two rows
 * - Render the matrix in a readable format
 * - Query dimensions and values
 *
 * The class includes error handling for out-of-bounds indices and invalid scaling factors.
 *
 * @example
 * const matrix = new Matrix(2, 3);
 * matrix.insertRowAtIndex(0, [4, 1, 9]);
 * matrix.insertRowAtIndex(1, [1, -1, 1]);
 *
 * // Use a solver to solve:
 * // const solver = new GaussianEliminationSolver(matrix);
 * // const solution = solver.solve(); // [2, 1]
 */
export class Matrix {
    /** The underlying 2D number array representing the matrix */
    private totalMatrix: number[][];

    constructor(private rows: number, private cols: number) {
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

    /**
     * Scales a specific row of the matrix in place by a non-zero scalar.
     *
     * Multiplies each element in the specified zero-based row by the provided
     * multiplier `c`, updating the underlying matrix storage.
     *
     * @param row - Zero-based index of the row to scale. Must satisfy 0 <= row < this.rows.
     * @param c - Non-zero scalar to multiply the row by.
     * @throws {Error} If `c` is 0.
     * @throws {Error} If `row` is not within the valid range.
     * @remarks
     * - This method mutates the matrix stored in `this.totalMatrix`.
     * - Time complexity: O(this.cols).
     * @example
     * // Scale the second row (index 1) by 2
     * matrix.scaleRow(1, 2);
     */
    public scaleRow(row: number, c: number): void {
        if (c === 0) throw new Error('c must not be 0');
        if (row >= this.rows || row < 0) throw new Error('Row is not within range.');
        for (let i = 0; i < this.cols; i++) {
            this.totalMatrix[row][i] *= c;
        }
    }

    /**
     * Swap two rows of the matrix in-place.
     *
     * Swaps the entries at the given row indices within the internal `totalMatrix`
     * storage. The operation mutates the matrix and does not allocate a new matrix.
     *
     * @param row1 - Zero-based index of the first row to swap.
     * @param row2 - Zero-based index of the second row to swap.
     *
     * @throws {Error} If either `row1` or `row2` is outside the valid row range.
     *
     * @example
     * // Swap the first and second rows
     * matrix.swapRows(0, 1);
     */
    public swapRows(row1: number, row2: number): void {
        if (row1 >= this.rows || row2 >= this.rows || row1 < 0 || row2 < 0) {
            throw new Error('Row indices must be within range.');
        }
        [this.totalMatrix[row1], this.totalMatrix[row2]] = [this.totalMatrix[row2], this.totalMatrix[row1]];
    }

    /**
     * Renders the current state of the matrix to the console in a readable format.
     *
     * Each row is printed on its own line, prefixed with the row index, for example:
     * `[0] [ 1 2 3 ]`
     *
     * This method is primarily intended for debugging and demonstration purposes.
     */
    public renderMatrix(): void {
        const str = this.totalMatrix.map((row, index) => `[${index}] [ ${row.join(' ')} ]`).join('\n');
        console.log(str);
    }

    /**
     * Gets the number of rows in this matrix.
     *
     * @remarks
     * Simple accessor for the internal `rows` property; value is expected to be a non-negative integer.
     *
     * @returns The number of rows in the matrix.
     * @return The number of rows in the matrix (JDoc-compatible).
     */
    public getNoRows(): number {
        return this.rows;
    }

    /**
     * Gets the number of columns in the matrix.
     *
     * Returns the count of columns maintained by this matrix instance.
     *
     * @returns {number} The number of columns.
     */
    public getNoCols(): number {
        return this.cols;
    }

    /**
     * Returns the numeric value stored at the specified zero-based row and column in the matrix.
     *
     * @param row - Zero-based index of the matrix row.
     * @param col - Zero-based index of the matrix column.
     * @returns The numeric value at the given row and column.
     * @throws {RangeError} If either index is out of bounds for the underlying matrix.
     */
    public getValueAt(row: number, col: number): number {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            throw new RangeError('Row or column index is out of bounds.');
        }
        return this.totalMatrix[row][col];
    }
}
