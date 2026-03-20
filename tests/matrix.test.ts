import { Matrix } from "../src/matrix";

describe('Matrix', () => {
    let matrix: Matrix;

    beforeEach(() => {
        // Initialize a new Matrix before each test
        matrix = new Matrix(3, 3); // 3 rows, 3 columns
    });

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
        matrix.addToRow(0, 1, 2); // row1 = row1 + 2 * row2

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

    // test('should perform various matrix operations and render the correct state', () => {
    //     matrix = new Matrix(2, 3); // 3 rows, 3 columns
    //     // Problem is:
    //     //  4x1 + x2 = 9
    //     //  x1 - x2 = 1
    //     // Initial state should be zeros
    //     expect(matrix.getValueAt(0, 0)).toBe(0);
    //     expect(matrix.getValueAt(0, 1)).toBe(0);
    //     expect(matrix.getValueAt(0, 2)).toBe(0);
    //     expect(matrix.getValueAt(1, 0)).toBe(0);
    //     expect(matrix.getValueAt(1, 1)).toBe(0);
    //     expect(matrix.getValueAt(1, 2)).toBe(0);

    //     // Insert rows
    //     matrix.insertRowAtIndex(0, [4, 1, 9]);
    //     matrix.insertRowAtIndex(1, [1, -1, 1]);

    //     // Check after inserting rows
    //     expect(matrix.getValueAt(0, 0)).toBe(4);
    //     expect(matrix.getValueAt(0, 1)).toBe(1);
    //     expect(matrix.getValueAt(0, 2)).toBe(9);
    //     expect(matrix.getValueAt(1, 0)).toBe(1);
    //     expect(matrix.getValueAt(1, 1)).toBe(-1);
    //     expect(matrix.getValueAt(1, 2)).toBe(1);

    //     // Add row 1 to row 0 with a scaling factor of 1
    //     matrix.addToRow(0, 1, 1); // 0 = 0 + 1*(1, -1, 1)
    //     matrix.renderMatrix();
    //     // Scale row 0 by 1/5   
    //     // After scaling, row 0 should be (1, 0, 2)
    //     matrix.scaleRow(0, 1 / 5);
    //     matrix.renderMatrix();
    //     // Scale row 1 by -1
    //     matrix.scaleRow(1, -1);
    //     matrix.renderMatrix();
    //     // Add row 0 to 1
    //     matrix.addToRow(1, 0, 1);
    //     matrix.renderMatrix();
    //     // Validate solution
    //     expect(matrix.getValueAt(0, 2)).toBe(2); // Solution x1 (originally)
    //     expect(matrix.getValueAt(1, 2)).toBe(1); // Solution x2 (originally)

    //     // Inverse operations
    //     matrix.addToRow(1, 0, -1);
    //     expect(matrix.getValueAt(1, 0)).toBe(-1); // 0 + (-1)
        
    //     matrix.scaleRow(1, -1);
    //     expect(matrix.getValueAt(1, 0)).toBe(1); // -1 * -1

    //     matrix.scaleRow(0, 5);
    //     expect(matrix.getValueAt(0, 0)).toBe(5); // 1 * 5

    //     matrix.addToRow(0, 1, -1);
    //     expect(matrix.getValueAt(0, 0)).toBe(4); // 5 + (-1)
        
    //     // Finally swapping rows
    //     matrix.swapRows(0, 1);
    //     matrix.renderMatrix();
    //     expect(matrix.getValueAt(0, 0)).toBe(4); // Now row 1 should be at row 0
    //     expect(matrix.getValueAt(1, 0)).toBe(1); // Now row 0 should be at row 1
    // });

    test('should perform various matrix operations and render the correct state', () => {
        matrix = new Matrix(2, 3); // 3 rows, 3 columns
        // Problem is:
        //  4x1 + x2 = 9
        //  x1 - x2 = 1
        // Initial state should be zeros
        expect(matrix.getValueAt(0, 0)).toBe(0);
        expect(matrix.getValueAt(0, 1)).toBe(0);
        expect(matrix.getValueAt(0, 2)).toBe(0);
        expect(matrix.getValueAt(1, 0)).toBe(0);
        expect(matrix.getValueAt(1, 1)).toBe(0);
        expect(matrix.getValueAt(1, 2)).toBe(0);

        // Insert rows
        matrix.insertRowAtIndex(0, [4, 1, 9]);
        matrix.insertRowAtIndex(1, [1, -1, 1]);
        
        matrix.renderMatrix();

        // Check after inserting rows
        expect(matrix.getValueAt(0, 0)).toBe(4);
        expect(matrix.getValueAt(0, 1)).toBe(1);
        expect(matrix.getValueAt(0, 2)).toBe(9);
        expect(matrix.getValueAt(1, 0)).toBe(1);
        expect(matrix.getValueAt(1, 1)).toBe(-1);
        expect(matrix.getValueAt(1, 2)).toBe(1);

        // Add row 1 to row 0 with a scaling factor of 1
        matrix.addToRow(0, 1, 1); // 0 = 0 + (-4)*(1, -1, 1) to eliminate x1 from row 0
        matrix.renderMatrix();
        // Scale row 0 by 1/5   
        // After scaling, row 0 should be (1, 0, 2)
        matrix.scaleRow(0, 1 / 5);
        matrix.renderMatrix();
        // Scale row 1 by -1
        matrix.scaleRow(1, -1);
        matrix.renderMatrix();
        // Add row 0 to 1
        matrix.addToRow(1, 0, 1);
        matrix.renderMatrix();
        // Validate solution
        expect(matrix.getValueAt(0, 2)).toBe(2); // Solution x1 (originally)
        expect(matrix.getValueAt(1, 2)).toBe(1); // Solution x2 (originally)

       
    });

//    it('should throw an error for out-of-bounds row access', () => {
//         expect(() => matrix.insertRowAtIndex(3, [1, 2, 3])).toThrow('Row index is out of bounds.');
//         expect(() => matrix.addToRow(1, 0, 2)).toThrow('Row indices must be within range.');
//         expect(() => matrix.scaleRow(-1, 2)).toThrow('Row is not within range.');
//         expect(() => matrix.scaleRow(3, 2)).toThrow('Row is not within range.');
//     });
});
