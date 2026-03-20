import { Solver } from "./solver";
import { GaussianEliminationSolver } from "./solvers/gaussianEliminationSolver";
import { Matrix } from "./matrix";

/**
 * Demo entry point for the Matrix project.
 *
 * Demonstrates parsing and solving systems of linear equations from strings
 * using the Solver with a GaussianEliminationSolver strategy.
 */
class Program {
    
    static main(): void {
        // - SOLVER (parse and solve from string) -
        console.log("\n========================================");
        console.log("=== Solver: parse & solve from text ===");
        console.log("========================================\n");

        const solverFactory = (matrix: Matrix) => new GaussianEliminationSolver(matrix);
        const solver = new Solver(solverFactory);

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

}

Program.main();