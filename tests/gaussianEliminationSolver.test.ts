import { Matrix } from "../src/matrix";
import { GaussianEliminationSolver } from "../src/gaussianEliminationSolver";

describe('GaussianEliminationSolver', () => {
    // --- Gaussian Elimination ---

    describe('solve', () => {
        it('should solve a 2x2 system of equations', () => {
            // 4x1 + x2 = 9
            // x1 - x2 = 1
            // Solution: x1 = 2, x2 = 1
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            const solver = new GaussianEliminationSolver(m);
            const solution = solver.solve();

            expect(solution[0]).toBeCloseTo(2);
            expect(solution[1]).toBeCloseTo(1);

            // Verify RREF in the solver's matrix
            const solvedMatrix = solver.getSolvedMatrix();
            expect(solvedMatrix.getValueAt(0, 0)).toBeCloseTo(1);
            expect(solvedMatrix.getValueAt(0, 1)).toBeCloseTo(0);
            expect(solvedMatrix.getValueAt(0, 2)).toBeCloseTo(2);
            expect(solvedMatrix.getValueAt(1, 0)).toBeCloseTo(0);
            expect(solvedMatrix.getValueAt(1, 1)).toBeCloseTo(1);
            expect(solvedMatrix.getValueAt(1, 2)).toBeCloseTo(1);
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

            const solver = new GaussianEliminationSolver(m);
            const solution = solver.solve();

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

            const solver = new GaussianEliminationSolver(m);
            const solution = solver.solve();

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

            const solver = new GaussianEliminationSolver(m);
            const solution = solver.solve();

            expect(solution[0]).toBeCloseTo(2);
            expect(solution[1]).toBeCloseTo(1);
        });

        it('should solve an already-diagonal matrix (identity coefficients)', () => {
            // 1x1 = 5
            // 1x2 = 3
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [1, 0, 5]);
            m.insertRowAtIndex(1, [0, 1, 3]);

            const solver = new GaussianEliminationSolver(m);
            const solution = solver.solve();

            expect(solution[0]).toBeCloseTo(5);
            expect(solution[1]).toBeCloseTo(3);
        });

        it('should throw an error for a singular matrix (no unique solution)', () => {
            // x1 + x2 = 2
            // 2x1 + 2x2 = 4  (same equation, linearly dependent)
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [1, 1, 2]);
            m.insertRowAtIndex(1, [2, 2, 4]);

            const solver = new GaussianEliminationSolver(m);
            expect(() => solver.solve()).toThrow('No unique solution');
        });

        it('should throw an error for an inconsistent system', () => {
            // x1 + x2 = 2
            // x1 + x2 = 5  (contradictory)
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [1, 1, 2]);
            m.insertRowAtIndex(1, [1, 1, 5]);

            const solver = new GaussianEliminationSolver(m);
            expect(() => solver.solve()).toThrow('No unique solution');
        });

        it('should not modify the input matrix', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            // Store original values
            const original0 = m.getValueAt(0, 0);
            const original1 = m.getValueAt(1, 1);

            const solver = new GaussianEliminationSolver(m);
            solver.solve();

            // Original matrix should be unchanged
            expect(m.getValueAt(0, 0)).toBe(original0);
            expect(m.getValueAt(1, 1)).toBe(original1);
        });
    });

    // --- getSolution ---

    describe('getSolution', () => {
        it('should return the last column values as the solution', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [1, 0, 7]);
            m.insertRowAtIndex(1, [0, 1, 3]);

            const solver = new GaussianEliminationSolver(m);
            const solution = solver.getSolution();

            expect(solution).toEqual([7, 3]);
        });

        it('should return the solution after solve', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            const solver = new GaussianEliminationSolver(m);
            solver.solve();
            const solution = solver.getSolution();

            expect(solution[0]).toBeCloseTo(2);
            expect(solution[1]).toBeCloseTo(1);
        });
    });

    // --- Operation History ---

    describe('operation history', () => {
        it('should record operations during elimination', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            const solver = new GaussianEliminationSolver(m);
            solver.solve();

            const history = solver.getOperationHistory();
            expect(history.length).toBeGreaterThan(0);

            // Verify each operation has a valid type
            history.forEach(op => {
                expect(['swap', 'scale', 'add']).toContain(op.type);
            });
        });

        it('should provide access to the solved matrix', () => {
            const m = new Matrix(2, 3);
            m.insertRowAtIndex(0, [4, 1, 9]);
            m.insertRowAtIndex(1, [1, -1, 1]);

            const solver = new GaussianEliminationSolver(m);
            solver.solve();

            const solvedMatrix = solver.getSolvedMatrix();
            expect(solvedMatrix).toBeDefined();
            expect(solvedMatrix.getNoRows()).toBe(2);
            expect(solvedMatrix.getNoCols()).toBe(3);
        });
    });

    // --- 3x3 system with undo/redo simulation ---

    describe('3x3 system solving', () => {
        it('should solve a 3x3 system correctly', () => {
            // 2x1 + x2 - x3 = 1
            // x1 + 3x2 + 2x3 = 13
            // x1 + x2 + x3 = 6
            const m = new Matrix(3, 4);
            m.insertRowAtIndex(0, [2, 1, -1, 1]);
            m.insertRowAtIndex(1, [1, 3, 2, 13]);
            m.insertRowAtIndex(2, [1, 1, 1, 6]);

            const solver = new GaussianEliminationSolver(m);
            const solution = solver.solve();

            expect(solution[0]).toBeCloseTo(1);
            expect(solution[1]).toBeCloseTo(2);
            expect(solution[2]).toBeCloseTo(3);
        });
    });
});
