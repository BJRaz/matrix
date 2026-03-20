import { Matrix } from "../src/matrix";

describe('Matrix', () => {
    let matrix: Matrix;

    beforeEach(() => {
        // Initialize a new Matrix before each test
        matrix = new Matrix(3, 3); // 3 rows, 3 columns
    });

    // --- Basic Operations ---

    it('should initialize the matrix with zeros', () => {
        expect(matrix.getNoRows()).toBe(3);
        expect(matrix.getNoCols()).toBe(3);
        expect(matrix.getValueAt(0, 0)).toBe(0);
        expect(matrix.getValueAt(1, 1)).toBe(0);
        expect(matrix.getValueAt(2, 2)).toBe(0);
    });

    it('should insert a row at a specific index', () => {
        const newRow = [1, 2, 3];
        matrix.insertRowAtIndex(0, newRow);
        expect(matrix.getValueAt(0, 0)).toBe(1);
        expect(matrix.getValueAt(0, 1)).toBe(2);
        expect(matrix.getValueAt(0, 2)).toBe(3);
    });

    it('should add to one row from another row scaled by a constant', () => {
        const row1 = [1, 2, 3];
        const row2 = [4, 5, 6];
        matrix.insertRowAtIndex(0, row1);
        matrix.insertRowAtIndex(1, row2);
        matrix.addToRow(0, 1, 2); // row0 = row0 + 2 * row1

        expect(matrix.getValueAt(0, 0)).toBe(9); // 1 + 2*4
        expect(matrix.getValueAt(0, 1)).toBe(12); // 2 + 2*5
        expect(matrix.getValueAt(0, 2)).toBe(15); // 3 + 2*6
    });

    it('should scale a row by a constant', () => {
        const row = [1, 2, 3];
        matrix.insertRowAtIndex(0, row);
        matrix.scaleRow(0, 3); // Scale row 0 by 3

        expect(matrix.getValueAt(0, 0)).toBe(3); // 1 * 3
        expect(matrix.getValueAt(0, 1)).toBe(6); // 2 * 3
        expect(matrix.getValueAt(0, 2)).toBe(9); // 3 * 3
    });

    it('should swap two rows', () => {
        const row1 = [1, 2, 3];
        const row2 = [4, 5, 6];
        matrix.insertRowAtIndex(0, row1);
        matrix.insertRowAtIndex(1, row2);
        matrix.swapRows(0, 1); // Swap row 0 with row 1
        
        expect(matrix.getValueAt(0, 0)).toBe(4); // Row 1 now at Row 0
        expect(matrix.getValueAt(1, 0)).toBe(1); // Row 0 now at Row 1
    });

    it('should throw an error when scaling by zero', () => {
        const row = [1, 2, 3];
        matrix.insertRowAtIndex(0, row);
        expect(() => matrix.scaleRow(0, 0)).toThrow('c must not be 0');
    });

    it('should throw an error for out-of-bounds row access', () => {
        expect(() => matrix.insertRowAtIndex(3, [1, 2, 3])).toThrow('Row index is out of bounds.');
        expect(() => matrix.insertRowAtIndex(-1, [1, 2, 3])).toThrow('Row index is out of bounds.');
        expect(() => matrix.scaleRow(-1, 2)).toThrow('Row is not within range.');
        expect(() => matrix.scaleRow(3, 2)).toThrow('Row is not within range.');
    });

    // --- Gaussian Elimination ---

    describe('gaussianElimination', () => {
        it('should solve a 2x2 system of equations', () => {
            // 4x1 + x2 = 9
            // x1 - x2 = 1
            // Solution: x1 = 2, x2 = 1
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            m.gaussianElimination();

            // RREF should be identity on left, solution on right
            expect(m.getValueAt(0, 0)).toBeCloseTo(1);
            expect(m.getValueAt(0, 1)).toBeCloseTo(0);
            expect(m.getValueAt(0, 2)).toBeCloseTo(2); // x1 = 2
            expect(m.getValueAt(1, 0)).toBeCloseTo(0);
            expect(m.getValueAt(1, 1)).toBeCloseTo(1);
            expect(m.getValueAt(1, 2)).toBeCloseTo(1); // x2 = 1
        });

        it('should solve a 3x3 system of equations', () => {
            // 2x1 + x2 - x3 = 1
            // x1 + 3x2 + 2x3 = 13
            // x1 + x2 + x3 = 6
            // Solution: x1 = 1, x2 = 2, x3 = 3
            const m = new Matrix(3, 4);
            m.insertRowAtIndex(0, [2, 1, -1, 1]);
            m.insertRowAtIndex(1, [1, 3, 2, 13]);
            m.insertRowAtIndex(2, [1, 1, 1, 6]);

            m.gaussianElimination();

            const solution = m.getSolution();
            expect(solution[0]).toBeCloseTo(1);
            expect(solution[1]).toBeCloseTo(2);
            expect(solution[2]).toBeCloseTo(3);
        });

        it('should handle a system requiring row swaps (zero pivot)', () => {
            // 0x1 + 2x2 = 4
            // 3x1 + 1x2 = 5
            // Solution: x1 = 1, x2 = 2
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [0, 2, 4]);
            m.insertRowAtIndex(1, [3, 1, 5]);

            m.gaussianElimination();

            const solution = m.getSolution();
            expect(solution[0]).toBeCloseTo(1);
            expect(solution[1]).toBeCloseTo(2);
        });

        it('should handle a system with negative coefficients', () => {
            // -2x1 + x2 = -3
            // x1 + 3x2 = 5
            // Solution: x1 = 2, x2 = 1
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [-2, 1, -3]);
            m.insertRowAtIndex(1, [1, 3, 5]);

            m.gaussianElimination();

            const solution = m.getSolution();
            expect(solution[0]).toBeCloseTo(2);
            expect(solution[1]).toBeCloseTo(1);
        });

        it('should solve an already-diagonal matrix (identity coefficients)', () => {
            // 1x1 = 5
            // 1x2 = 3
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [1, 0, 5]);
            m.insertRowAtIndex(1, [0, 1, 3]);

            m.gaussianElimination();

            const solution = m.getSolution();
            expect(solution[0]).toBeCloseTo(5);
            expect(solution[1]).toBeCloseTo(3);
        });

        it('should throw an error for a singular matrix (no unique solution)', () => {
            // x1 + x2 = 2
            // 2x1 + 2x2 = 4  (same equation, linearly dependent)
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [1, 1, 2]);
            m.insertRowAtIndex(1, [2, 2, 4]);

            expect(() => m.gaussianElimination()).toThrow('No unique solution');
        });

        it('should throw an error for an inconsistent system', () => {
            // x1 + x2 = 2
            // x1 + x2 = 5  (contradictory)
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [1, 1, 2]);
            m.insertRowAtIndex(1, [1, 1, 5]);

            expect(() => m.gaussianElimination()).toThrow('No unique solution');
        });

        it('should record operations during elimination', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            m.gaussianElimination();

            const history = m.getOperationHistory();
            expect(history.length).toBeGreaterThan(0);

            // Verify each operation has a valid type
            history.forEach(op => {
                expect(['swap', 'scale', 'add']).toContain(op.type);
            });
        });
    });

    // --- getSolution ---

    describe('getSolution', () => {
        it('should return the last column values as the solution', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [1, 0, 7]);
            m.insertRowAtIndex(1, [0, 1, 3]);

            const solution = m.getSolution();
            expect(solution).toEqual([7, 3]);
        });

        it('should return the solution after Gaussian elimination', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            m.gaussianElimination();
            const solution = m.getSolution();

            expect(solution[0]).toBeCloseTo(2);
            expect(solution[1]).toBeCloseTo(1);
        });
    });

    // --- Undo / Redo ---

    describe('undo and redo', () => {
        it('should undo all operations and restore the original matrix', () => {
            // 4x1 + x2 = 9
            // x1 - x2 = 1
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            m.gaussianElimination();

            // Verify solved state
            expect(m.getValueAt(0, 2)).toBeCloseTo(2);
            expect(m.getValueAt(1, 2)).toBeCloseTo(1);

            // Undo all
            m.undoAll();

            // Should be back to original
            expect(m.getValueAt(0, 0)).toBeCloseTo(4);
            expect(m.getValueAt(0, 1)).toBeCloseTo(1);
            expect(m.getValueAt(0, 2)).toBeCloseTo(9);
            expect(m.getValueAt(1, 0)).toBeCloseTo(1);
            expect(m.getValueAt(1, 1)).toBeCloseTo(-1);
            expect(m.getValueAt(1, 2)).toBeCloseTo(1);
        });

        it('should redo all operations and restore the solved matrix', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            m.gaussianElimination();
            m.undoAll();
            m.redoAll();

            // Should be back to solved state
            expect(m.getValueAt(0, 0)).toBeCloseTo(1);
            expect(m.getValueAt(0, 1)).toBeCloseTo(0);
            expect(m.getValueAt(0, 2)).toBeCloseTo(2);
            expect(m.getValueAt(1, 0)).toBeCloseTo(0);
            expect(m.getValueAt(1, 1)).toBeCloseTo(1);
            expect(m.getValueAt(1, 2)).toBeCloseTo(1);
        });

        it('should support single undo steps', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            m.gaussianElimination();
            const historyLength = m.getOperationHistory().length;

            m.undo(); // undo one step

            // History should be one shorter
            expect(m.getOperationHistory().length).toBe(historyLength - 1);
        });

        it('should throw an error when undoing with no history', () => {
            const m = new Matrix(2, 3);
            expect(() => m.undo()).toThrow('No operations to undo.');
        });

        it('should throw an error when redoing with no redo history', () => {
            const m = new Matrix(2, 3);
            expect(() => m.redo()).toThrow('No operations to redo.');
        });

        it('should undo/redo a 3x3 system correctly', () => {
            // 2x1 + x2 - x3 = 1
            // x1 + 3x2 + 2x3 = 13
            // x1 + x2 + x3 = 6
            const m = new Matrix(3, 4);
            m.insertRowAtIndex(0, [2, 1, -1, 1]);
            m.insertRowAtIndex(1, [1, 3, 2, 13]);
            m.insertRowAtIndex(2, [1, 1, 1, 6]);

            m.gaussianElimination();

            const solution = m.getSolution();
            expect(solution[0]).toBeCloseTo(1);
            expect(solution[1]).toBeCloseTo(2);
            expect(solution[2]).toBeCloseTo(3);

            // Undo all → original
            m.undoAll();
            expect(m.getValueAt(0, 0)).toBeCloseTo(2);
            expect(m.getValueAt(0, 1)).toBeCloseTo(1);
            expect(m.getValueAt(0, 2)).toBeCloseTo(-1);
            expect(m.getValueAt(0, 3)).toBeCloseTo(1);
            expect(m.getValueAt(1, 0)).toBeCloseTo(1);
            expect(m.getValueAt(1, 1)).toBeCloseTo(3);
            expect(m.getValueAt(2, 2)).toBeCloseTo(1);
            expect(m.getValueAt(2, 3)).toBeCloseTo(6);

            // Redo all → solved again
            m.redoAll();
            const reSolution = m.getSolution();
            expect(reSolution[0]).toBeCloseTo(1);
            expect(reSolution[1]).toBeCloseTo(2);
            expect(reSolution[2]).toBeCloseTo(3);
        });

        it('should clear redo history when a new operation is recorded', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            m.gaussianElimination();
            m.undo(); // creates redo history

            // Clear history and re-solve — redo should be empty
            m.clearHistory();
            expect(() => m.redo()).toThrow('No operations to redo.');
        });
    });
});
