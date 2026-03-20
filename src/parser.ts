// --- Token Types ---

/**
 * Represents the type of a lexical token produced by the scanner.
 */
export enum TokenType {
    NUMBER = 'NUMBER',
    VARIABLE = 'VARIABLE',
    PLUS = 'PLUS',
    MINUS = 'MINUS',
    EQUALS = 'EQUALS',
    SEMICOLON = 'SEMICOLON',
    EOF = 'EOF',
}

/**
 * A single lexical token with its type and string value.
 */
export interface Token {
    type: TokenType;
    value: string;
}

// --- Scanner ---

/**
 * Tokenizes an equation string into a stream of tokens, one at a time.
 *
 * Handles:
 * - Numbers (integers and decimals, e.g. `42`, `3.14`)
 * - Variable names (starting with a letter, e.g. `x1`, `foo`, `y`)
 * - Operators: `+`, `-`, `=`
 * - Semicolons as equation separators
 * - Whitespace (skipped)
 *
 * @example
 * const scanner = new Scanner("4x1 + x2 = 9");
 * let token = scanner.nextToken(); // { type: NUMBER, value: '4' }
 */
export class Scanner {
    private pos: number = 0;

    constructor(private readonly input: string) {}

    /**
     * Returns the next token from the input, advancing the stream.
     * Returns an EOF token once the end of input is reached.
     * @returns The next Token
     * @throws Error if an unexpected character is encountered
     */
    public nextToken(): Token {
        // Skip whitespace
        while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
            this.pos++;
        }

        if (this.pos >= this.input.length) {
            return { type: TokenType.EOF, value: '' };
        }

        const ch = this.input[this.pos];

        // Number (integer or decimal)
        if (/[0-9]/.test(ch) || (ch === '.' && this.pos + 1 < this.input.length && /[0-9]/.test(this.input[this.pos + 1]))) {
            return this.readNumber();
        }

        // Variable (starts with a letter)
        if (/[a-zA-Z]/.test(ch)) {
            return this.readVariable();
        }

        // Operators and delimiters
        this.pos++;
        switch (ch) {
            case '+': return { type: TokenType.PLUS, value: '+' };
            case '-': return { type: TokenType.MINUS, value: '-' };
            case '=': return { type: TokenType.EQUALS, value: '=' };
            case ';': return { type: TokenType.SEMICOLON, value: ';' };
        }

        throw new Error(`Unexpected character '${ch}' at position ${this.pos - 1}.`);
    }

    /**
     * Reads a number token (integer or decimal).
     */
    private readNumber(): Token {
        const start = this.pos;
        while (this.pos < this.input.length && /[0-9.]/.test(this.input[this.pos])) {
            this.pos++;
        }
        return { type: TokenType.NUMBER, value: this.input.slice(start, this.pos) };
    }

    /**
     * Reads a variable name token (letter followed by letters or digits).
     */
    private readVariable(): Token {
        const start = this.pos;
        while (this.pos < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.pos])) {
            this.pos++;
        }
        return { type: TokenType.VARIABLE, value: this.input.slice(start, this.pos) };
    }
}

// --- Parser ---

/**
 * Represents a single term in an equation, e.g. `4x1` → { coefficient: 4, variable: "x1" }
 * or a constant `9` → { coefficient: 9, variable: null }.
 */
export interface Term {
    coefficient: number;
    variable: string | null;
}

/**
 * Represents a parsed equation with variable terms on the left-hand side
 * and a constant on the right.
 *
 * For example, `4x1 + x2 = 9` → { terms: [{4, "x1"}, {1, "x2"}], constant: 9 }
 */
export interface ParsedEquation {
    terms: Term[];
    constant: number;
}

/**
 * Parses a token stream into structured equations.
 *
 * Grammar (informal):
 *   input     → equation (';' equation)* EOF
 *   equation  → expr '=' expr
 *   expr      → ['+' | '-'] term (('+' | '-') term)*
 *   term      → [NUMBER] VARIABLE | NUMBER
 *
 * All terms with variables are collected on the left-hand side,
 * and all constant terms are collected on the right-hand side.
 *
 * @example
 * const scanner = new Scanner("4x1 + x2 = 9; x1 - x2 = 1");
 * const equations = new Parser(scanner).parse();
 */
export class Parser {
    private current: Token;

    constructor(private readonly scanner: Scanner) {
        this.current = this.scanner.nextToken();
    }

    /**
     * Parses all equations from the token stream.
     * @returns An array of ParsedEquation objects
     * @throws Error on syntax errors
     */
    public parse(): ParsedEquation[] {
        const equations: ParsedEquation[] = [];

        equations.push(this.parseEquation());

        while (this.currentToken().type === TokenType.SEMICOLON) {
            this.advance(); // consume ';'
            // Allow trailing semicolon
            if (this.currentToken().type === TokenType.EOF) {
                break;
            }
            equations.push(this.parseEquation());
        }

        this.expect(TokenType.EOF, 'Expected end of input.');
        return equations;
    }

    /**
     * Parses a single equation: lhs = rhs.
     * Variable terms are collected on the left, constants on the right.
     */
    private parseEquation(): ParsedEquation {
        const lhsTerms = this.parseExpression();

        this.expect(TokenType.EQUALS, "Expected '=' in equation.");
        this.advance();

        const rhsTerms = this.parseExpression();

        // Collect: move variable terms to left side, constants to right side
        const variableTerms: Map<string, number> = new Map();
        let constant = 0;

        // Process LHS terms (positive on left)
        for (const term of lhsTerms) {
            if (term.variable) {
                variableTerms.set(term.variable, (variableTerms.get(term.variable) || 0) + term.coefficient);
            } else {
                constant -= term.coefficient; // move constant to RHS
            }
        }

        // Process RHS terms (negate variables to move to LHS, keep constants on RHS)
        for (const term of rhsTerms) {
            if (term.variable) {
                variableTerms.set(term.variable, (variableTerms.get(term.variable) || 0) - term.coefficient);
            } else {
                constant += term.coefficient;
            }
        }

        const terms: Term[] = [];
        for (const [variable, coefficient] of variableTerms) {
            terms.push({ coefficient, variable });
        }

        return { terms, constant };
    }

    /**
     * Parses an expression: a sequence of terms with `+` or `-` operators.
     * Handles leading sign (e.g. `-x1`).
     */
    private parseExpression(): Term[] {
        const terms: Term[] = [];
        let sign = 1;

        // Handle leading sign
        if (this.currentToken().type === TokenType.PLUS) {
            this.advance();
        } else if (this.currentToken().type === TokenType.MINUS) {
            sign = -1;
            this.advance();
        }

        terms.push(this.applySign(this.parseTerm(), sign));

        while (this.currentToken().type === TokenType.PLUS || this.currentToken().type === TokenType.MINUS) {
            sign = this.currentToken().type === TokenType.PLUS ? 1 : -1;
            this.advance();
            terms.push(this.applySign(this.parseTerm(), sign));
        }

        return terms;
    }

    /**
     * Parses a single term: a coefficient and/or variable.
     *
     * Valid forms:
     * - `3.5x1` → { coefficient: 3.5, variable: "x1" }
     * - `x1`    → { coefficient: 1, variable: "x1" }
     * - `42`    → { coefficient: 42, variable: null }
     */
    private parseTerm(): Term {
        const token = this.currentToken();

        if (token.type === TokenType.NUMBER) {
            const numValue = parseFloat(token.value);
            this.advance();

            // Check if followed immediately by a variable (e.g. `4x1`)
            if (this.currentToken().type === TokenType.VARIABLE) {
                const varName = this.currentToken().value;
                this.advance();
                return { coefficient: numValue, variable: varName };
            }

            // Just a number (constant term)
            return { coefficient: numValue, variable: null };
        }

        if (token.type === TokenType.VARIABLE) {
            const varName = token.value;
            this.advance();
            return { coefficient: 1, variable: varName };
        }

        throw new Error(
            `Unexpected token '${token.value}' (${token.type}). ` +
            `Expected a number or variable.`
        );
    }

    /**
     * Applies a sign multiplier to a term.
     */
    private applySign(term: Term, sign: number): Term {
        return { coefficient: term.coefficient * sign, variable: term.variable };
    }

    /**
     * Returns the current token without advancing.
     */
    private currentToken(): Token {
        return this.current;
    }

    /**
     * Advances to the next token by fetching it from the scanner.
     */
    private advance(): void {
        this.current = this.scanner.nextToken();
    }

    /**
     * Asserts the current token is of the expected type.
     * @throws Error if the token type doesn't match
     */
    private expect(type: TokenType, message: string): void {
        if (this.currentToken().type !== type) {
            throw new Error(message);
        }
    }
}
