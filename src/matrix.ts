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
}
