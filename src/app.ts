import { Matrix } from "./matrix";
import { Solver } from "./solver";

/**
 * Demo entry point for the Matrix project.
 *
 * This file builds an augmented matrix for a small linear system and applies
 * elementary row operations (swap, scale, add) to perform Gaussian elimination.
 * The final matrix form is then used to read the solution values.
 */
class Program {
    
    static main(): void {
        // - SOLVER (parse and solve from string) -
        console.log("\n========================================");
        console.log("=== Solver: parse & solve from text ===");
        console.log("========================================\n");

        const solver = new Solver();

        // 2x2 system
        const problem2x2 = "4x1 + x2 = 9; x1 - x2 = 1";
        console.log(`Problem: ${problem2x2}`);
        const result2x2 = solver.solveAlgebra(problem2x2);
        console.log("Solution:", result2x2);

        // 3x3 system with descriptive variable names
        const problem3x3 = "2a + b - c = 1; a + 3b + 2c = 13; a + b + c = 6";
        console.log(`\nProblem: ${problem3x3}`);
        const result3x3 = solver.solveAlgebra(problem3x3);
        console.log("Solution:", result3x3);

        // System with descriptive variable names
        const priceProblem = "2price + tax = 25; price - tax = 5";
        console.log(`\nProblem: ${priceProblem}`);
        const priceResult = solver.solveAlgebra(priceProblem);
        console.log("Solution:", priceResult);
        // - END SOLVER -
    }

    /**
     * Runs a manual matrix workflow demo using direct row operations.
     *
     * Demonstrates:
     * - building an augmented matrix
     * - solving via Gaussian elimination
     * - reading solution values
     * - inspecting operation history
     * - undoing and redoing all operations
     *
     * @returns void
     */
    private static test1() {
        const matrix = new Matrix(2, 3);

        // - SOLVE SYSTEM OF EQUATIONS -
        console.log("Problem is:");
        console.log("4x1 + x2 = 9");
        console.log("x1 - x2 = 1\n");

        matrix.insertRowAtIndex(0, [4, 1, 9]);
        matrix.insertRowAtIndex(1, [1, -1, 1]);

        console.log("Initial matrix:");
        matrix.renderMatrix();

        // Solve using Gaussian elimination
        matrix.gaussianElimination();

        console.log("\nSolved matrix (RREF):");
        matrix.renderMatrix();

        const solution = matrix.getSolution();
        console.log(`\nSolution is: [${solution}] (x1 = ${solution[0]}, x2 = ${solution[1]})`);

        // Show recorded operations
        console.log("\nOperations performed:");
        matrix.getOperationHistory().forEach((op, i) => {
            switch (op.type) {
                case 'swap':
                    console.log(`  ${i + 1}. Swap row ${op.row1} with row ${op.row2}`);
                    break;
                case 'scale':
                    console.log(`  ${i + 1}. Scale row ${op.row} by ${op.factor}`);
                    break;
                case 'add':
                    console.log(`  ${i + 1}. Add ${op.factor} × row ${op.sourceRow} to row ${op.targetRow}`);
                    break;
            }
        });
        // - END SOLVE SYSTEM OF EQUATIONS -
        // - INVERSE ROW-OPERATIONS (undo all) -
        console.log("\n--- Undo all operations ---");
        matrix.undoAll();

        console.log("Restored original matrix:");
        matrix.renderMatrix();

        // - REDO (re-apply solution) -
        console.log("\n--- Redo all operations ---");
        matrix.redoAll();

        console.log("Re-solved matrix:");
        matrix.renderMatrix();

        const reSolution = matrix.getSolution();
        console.log(`Solution is: [${reSolution}] (x1 = ${reSolution[0]}, x2 = ${reSolution[1]})`);
        // - END INVERSE ROW-OPERATIONS -
     }
}

Program.main();