import { Scanner, Parser, Solver, TokenType } from "../src/solver";

describe('Scanner', () => {
    it('should tokenize a simple equation', () => {
        const scanner = new Scanner("4x1 + x2 = 9");
        const tokens = scanner.tokenize();

        expect(tokens[0]).toEqual({ type: TokenType.NUMBER, value: '4' });
        expect(tokens[1]).toEqual({ type: TokenType.VARIABLE, value: 'x1' });
        expect(tokens[2]).toEqual({ type: TokenType.PLUS, value: '+' });
        expect(tokens[3]).toEqual({ type: TokenType.VARIABLE, value: 'x2' });
        expect(tokens[4]).toEqual({ type: TokenType.EQUALS, value: '=' });
        expect(tokens[5]).toEqual({ type: TokenType.NUMBER, value: '9' });
        expect(tokens[6]).toEqual({ type: TokenType.EOF, value: '' });
    });

    it('should tokenize multiple equations separated by semicolons', () => {
        const scanner = new Scanner("x + y = 5; 2x - y = 1");
        const tokens = scanner.tokenize();

        const types = tokens.map(t => t.type);
        expect(types).toContain(TokenType.SEMICOLON);
        expect(types[types.length - 1]).toBe(TokenType.EOF);
    });

    it('should handle decimal numbers', () => {
        const scanner = new Scanner("3.5x = 7");
        const tokens = scanner.tokenize();

        expect(tokens[0]).toEqual({ type: TokenType.NUMBER, value: '3.5' });
        expect(tokens[1]).toEqual({ type: TokenType.VARIABLE, value: 'x' });
    });

    it('should handle minus sign', () => {
        const scanner = new Scanner("x1 - x2 = 1");
        const tokens = scanner.tokenize();

        expect(tokens[1]).toEqual({ type: TokenType.MINUS, value: '-' });
    });

    it('should handle multi-character variable names', () => {
        const scanner = new Scanner("price + tax = 100");
        const tokens = scanner.tokenize();

        expect(tokens[0]).toEqual({ type: TokenType.VARIABLE, value: 'price' });
        expect(tokens[2]).toEqual({ type: TokenType.VARIABLE, value: 'tax' });
    });

    it('should throw on unexpected characters', () => {
        const scanner = new Scanner("x & y = 1");
        expect(() => scanner.tokenize()).toThrow("Unexpected character '&'");
    });
});

describe('Parser', () => {
    it('should parse a simple equation', () => {
        const tokens = new Scanner("4x1 + x2 = 9").tokenize();
        const equations = new Parser(tokens).parse();

        expect(equations).toHaveLength(1);
        expect(equations[0].constant).toBe(9);
        expect(equations[0].terms).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coefficient: 4, variable: 'x1' }),
                expect.objectContaining({ coefficient: 1, variable: 'x2' }),
            ])
        );
    });

    it('should parse multiple equations', () => {
        const tokens = new Scanner("4x1 + x2 = 9; x1 - x2 = 1").tokenize();
        const equations = new Parser(tokens).parse();

        expect(equations).toHaveLength(2);
        expect(equations[0].constant).toBe(9);
        expect(equations[1].constant).toBe(1);
    });

    it('should handle leading negative sign', () => {
        const tokens = new Scanner("-2x + y = 3").tokenize();
        const equations = new Parser(tokens).parse();

        expect(equations[0].terms).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coefficient: -2, variable: 'x' }),
                expect.objectContaining({ coefficient: 1, variable: 'y' }),
            ])
        );
    });

    it('should handle variables on the right-hand side', () => {
        // 2x = y + 4  →  2x - y = 4
        const tokens = new Scanner("2x = y + 4").tokenize();
        const equations = new Parser(tokens).parse();

        expect(equations[0].terms).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coefficient: 2, variable: 'x' }),
                expect.objectContaining({ coefficient: -1, variable: 'y' }),
            ])
        );
        expect(equations[0].constant).toBe(4);
    });

    it('should handle constants on the left-hand side', () => {
        // x + 3 = 10  →  x = 7
        const tokens = new Scanner("x + 3 = 10").tokenize();
        const equations = new Parser(tokens).parse();

        expect(equations[0].terms).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coefficient: 1, variable: 'x' }),
            ])
        );
        expect(equations[0].constant).toBe(7); // 10 - 3
    });

    it('should handle trailing semicolon', () => {
        const tokens = new Scanner("x = 5;").tokenize();
        const equations = new Parser(tokens).parse();

        expect(equations).toHaveLength(1);
    });

    it('should throw on missing equals sign', () => {
        const tokens = new Scanner("x + y").tokenize();
        expect(() => new Parser(tokens).parse()).toThrow("Expected '='");
    });
});

describe('Solver', () => {
    let solver: Solver;

    beforeEach(() => {
        solver = new Solver();
    });

    it('should solve a 2x2 system (x1, x2)', () => {
        const result = solver.solveAlgebra("4x1 + x2 = 9; x1 - x2 = 1");

        expect(result.x1).toBeCloseTo(2);
        expect(result.x2).toBeCloseTo(1);
    });

    it('should solve a 2x2 system with single-char variables', () => {
        const result = solver.solveAlgebra("x + y = 5; x - y = 1");

        expect(result.x).toBeCloseTo(3);
        expect(result.y).toBeCloseTo(2);
    });

    it('should solve a 3x3 system', () => {
        const result = solver.solveAlgebra("2a + b - c = 1; a + 3b + 2c = 13; a + b + c = 6");

        expect(result.a).toBeCloseTo(1);
        expect(result.b).toBeCloseTo(2);
        expect(result.c).toBeCloseTo(3);
    });

    it('should handle descriptive variable names', () => {
        const result = solver.solveAlgebra("2price + tax = 25; price - tax = 5");

        expect(result.price).toBeCloseTo(10);
        expect(result.tax).toBeCloseTo(5);
    });

    it('should handle decimal coefficients', () => {
        const result = solver.solveAlgebra("0.5x + y = 4; x + 0.5y = 5");

        expect(result.x).toBeCloseTo(4);
        expect(result.y).toBeCloseTo(2);
    });

    it('should handle negative coefficients', () => {
        const result = solver.solveAlgebra("-2x + y = -3; x + 3y = 5");

        expect(result.x).toBeCloseTo(2);
        expect(result.y).toBeCloseTo(1);
    });

    it('should handle variables on both sides of the equation', () => {
        // 2x = y + 4; x + y = 5  →  2x - y = 4; x + y = 5
        const result = solver.solveAlgebra("2x = y + 4; x + y = 5");

        expect(result.x).toBeCloseTo(3);
        expect(result.y).toBeCloseTo(2);
    });

    it('should handle constants on the left-hand side', () => {
        // x + 3 = 10; y - 2 = 3  →  x = 7; y = 5
        const result = solver.solveAlgebra("x + 3 = 10; y - 2 = 3");

        expect(result.x).toBeCloseTo(7);
        expect(result.y).toBeCloseTo(5);
    });

    it('should solve a single equation with one variable', () => {
        const result = solver.solveAlgebra("3x = 12");

        expect(result.x).toBeCloseTo(4);
    });

    it('should return a Record<string, number>', () => {
        const result = solver.solveAlgebra("x + y = 3; x - y = 1");

        expect(typeof result).toBe('object');
        expect(Object.keys(result).sort()).toEqual(['x', 'y']);
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
    });

    // --- Error cases ---

    it('should throw on mismatched equation/variable count', () => {
        // 1 equation, 2 variables
        expect(() => solver.solveAlgebra("x + y = 5")).toThrow('equation(s) and 2 variable(s)');
    });

    it('should throw on singular system (no unique solution)', () => {
        // Linearly dependent equations
        expect(() => solver.solveAlgebra("x + y = 2; 2x + 2y = 4")).toThrow('No unique solution');
    });

    it('should throw on inconsistent system', () => {
        expect(() => solver.solveAlgebra("x + y = 2; x + y = 5")).toThrow('No unique solution');
    });

    it('should throw on invalid characters in input', () => {
        expect(() => solver.solveAlgebra("x & y = 5")).toThrow("Unexpected character");
    });

    it('should throw on missing equals sign', () => {
        expect(() => solver.solveAlgebra("x + y")).toThrow("Expected '='");
    });
});
