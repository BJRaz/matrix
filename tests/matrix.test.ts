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

    it('should render the matrix without errors', () => {
        matrix.insertRowAtIndex(0, [1, 2, 3]);
        matrix.insertRowAtIndex(1, [4, 5, 6]);
        
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        matrix.renderMatrix();
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});

