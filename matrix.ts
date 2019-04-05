export class Matrix {
    
    totalMatrix : number[][];   // actually m * (n+1) matrix
                                // m = rows, n = cols

    constructor(protected rows: number, protected cols: number) {
        this.totalMatrix = [[]];
        this.init();
    }

    private init(): void {
        for(let i=0;i<this.rows;i++){
            this.totalMatrix[i] = new Array(this.cols);
            for(let j=0;j<this.cols;j++)
                this.totalMatrix[i][j] = 0;
        }
    }

    public insertRowAtIndex(rowindex: number, row:number[]) : void {
        this.totalMatrix[rowindex] = row;
    } 

    public addToRow(row1:number, row2:number, c:number) : void {
        // add to row1, the values at row2 multiplied by c
        for(var i=0;i<this.cols;i++)
            this.totalMatrix[row1][i] += (c * this.totalMatrix[row2][i]);
    }

    public scaleRow(row: number, c:number) : void {
        if(c == 0) throw new Error('c must not be 0');
        if(row >= this.rows || row < 0) throw new Error('rows is not within range...');
        for(var i=0;i<this.cols;i++)
            this.totalMatrix[row][i] = (c * this.totalMatrix[row][i]);
    }

    public swapRows(row1:number, row2:number) {
        var temp = this.totalMatrix[row1];
        this.totalMatrix[row1] = this.totalMatrix[row2];
        this.totalMatrix[row2] = temp;
    }

    public renderMatrix() : void {
        var str = [];
        for(var i=0;i<this.rows;i++){
            str[str.length] = "[" + i + "] [ ";
            for(var j=0;j<this.cols;j++)
                str[str.length] = (this.totalMatrix[i][j]) + " ";
            str[str.length] = " ]\n";
        }
        console.log(str.join(''));
    }

    public getNoRows() {
        return this.rows;
    }

    public getNoCols() {
        return this.cols;
    }

    public getValueAt(row:number, col:number) {
        return this.totalMatrix[row][col];
    }
}