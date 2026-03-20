import { Matrix } from "./matrix";
import { Scanner, Parser } from "./parser";
import { LinearSystemSolver } from "./solvers/interfaces";

// --- Solver ---

/**
 * The result of solving a system of equations: a map from variable name to its value.
 *
 * @example
 * { x1: 2, x2: 1 }
 */
export type Solution = Record<string, number>;

/**
 * Solves systems of linear equations expressed as human-readable strings.
 *
 * Accepts a LinearSystemSolver strategy factory that clients provide.
 * Uses a Scanner to tokenize the input, a Parser to build structured equations,
 * and the injected solver to find the solution.
 *
 * @example
 * const solverFactory = (matrix: Matrix) => new GaussianEliminationSolver(matrix);
 * const solver = new Solver(solverFactory);
 * const result = solver.solveAlgebra("4x1 + x2 = 9; x1 - x2 = 1");
 * // result: { x1: 2, x2: 1 }
 */
export class Solver {
    /**
     * Creates a new Solver with a required solving strategy factory.
     * @param solverFactory A function that creates a LinearSystemSolver from a Matrix.
     */
    constructor(private solverFactory: (matrix: Matrix) => LinearSystemSolver) {}

    /**
     * Parses and solves a system of linear equations given as a string.
     *
     * Equations are separated by semicolons. Variables can use any name
     * starting with a letter (e.g. `x1`, `y`, `foo`, `price`).
     *
     * @param input A string containing semicolon-separated linear equations
     * @returns A Solution (Record<string, number>) mapping each variable to its value
     * @throws Error if the input cannot be parsed, the system is under/over-determined,
     *         or the system has no unique solution
     *
     * @example
     * const solver = new Solver((m) => new GaussianEliminationSolver(m));
     * solver.solveAlgebra("4x1 + x2 = 9; x1 - x2 = 1");
     * // → { x1: 2, x2: 1 }
     */
    public solveAlgebra(input: string): Solution {
        // 1. Scan & 2. Parse
        const scanner = new Scanner(input);
        const parser = new Parser(scanner);
        const equations = parser.parse();

        if (equations.length === 0) {
            throw new Error('No equations provided.');
        }

        // 3. Collect all unique variable names in order of first appearance
        const variableOrder: string[] = [];
        const variableSet: Set<string> = new Set();

        for (const eq of equations) {
            for (const term of eq.terms) {
                if (term.variable && !variableSet.has(term.variable)) {
                    variableSet.add(term.variable);
                    variableOrder.push(term.variable);
                }
            }
        }

        const numVars = variableOrder.length;
        const numEqs = equations.length;

        if (numEqs !== numVars) {
            throw new Error(
                `The system has ${numEqs} equation(s) and ${numVars} variable(s). ` +
                `A unique solution requires the same number of equations and variables.`
            );
        }

        // 4. Build augmented matrix [coefficients | constants]
        const matrix = new Matrix(numEqs, numVars + 1);

        for (let i = 0; i < numEqs; i++) {
            const row: number[] = new Array(numVars + 1).fill(0);

            for (const term of equations[i].terms) {
                if (term.variable) {
                    const colIndex = variableOrder.indexOf(term.variable);
                    row[colIndex] += term.coefficient;
                }
            }

            row[numVars] = equations[i].constant;
            matrix.insertRowAtIndex(i, row);
        }

        // 5. Solve using the configured solver strategy
        const numericalSolver = this.solverFactory(matrix);
        const solutionValues = numericalSolver.solve();

        // 6. Extract solution and map to variable names
        const solution: Solution = {};

        for (let i = 0; i < numVars; i++) {
            solution[variableOrder[i]] = solutionValues[i];
        }

        return solution;
    }
}
