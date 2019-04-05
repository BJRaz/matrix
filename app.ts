import { Matrix } from "./matrix";

// application...

class Program {
    static main() : void {
        var matrix = new Matrix(2,3);
        
        console.log("Problem is:");
        console.log("4x1 + x2 = 9");
        console.log("x1 - x2 = 1\n");

        matrix.insertRowAtIndex(0, [ 4, 1, 9 ]);
        matrix.insertRowAtIndex(1, [ 1, -1, 1]);

        matrix.renderMatrix();

        console.log(" - add row 0 to 1");
        matrix.addToRow(0,1, 1);

        matrix.renderMatrix();

        console.log(" - scale row 0 by 1/5");
        matrix.scaleRow(0,1/5);

        matrix.renderMatrix();

        console.log(" - scale row 1 by -1");
        matrix.scaleRow(1,-1);

        matrix.renderMatrix();

        console.log(" - add row 1 to 0");
        matrix.addToRow(1,0, 1);

        matrix.renderMatrix();

        console.log("Solution is: [" + matrix.getValueAt(0,2) + "," + matrix.getValueAt(1,2) + "] (x1 = 2, x2 = 1)" );

        // inverse row-operations:
        console.log(" - add row 1 to 0, with -1 (inverse)");
        matrix.addToRow(1,0, -1);

        matrix.renderMatrix();

        console.log(" - scale row 1 by -1 (inverse)");
        matrix.scaleRow(1,-1);

        matrix.renderMatrix();

        console.log(" - scale row 0 by 5 (inverse)");
        matrix.scaleRow(0,5);

        matrix.renderMatrix();

        console.log(" - add row 0 to 1 with -1 (inverse)");
        matrix.addToRow(0,1, -1);

        matrix.renderMatrix();


        matrix.swapRows(0, 1);

        // matrix.renderMatrix();

    }
};

Program.main();