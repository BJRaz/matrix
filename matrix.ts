export class Matrix {
    
    matrice : number[][];

    constructor(protected rows: number, protected cols: number) {
        this.matrice = [[]];
        this.init();
    }

    private init(): void {
        for(var i=0;i<this.rows;i++){
            this.matrice[i] = new Array(this.cols);
        }
        for(var i=0;i<this.rows;i++){
            for(var j=0;j<this.cols;j++)
                this.matrice[i][j] = 0;
        }
    }

    public insertRowAtIndex(rowindex: number, row:number[]) : void {
        this.matrice[rowindex] = row;
    } 

    public addToRow(row1:number, row2:number, c:number) {
        // add to row1, the values at row2 multiplied by c
        for(var i=0;i<this.cols;i++)
            this.matrice[row1][i] += (c * this.matrice[row2][i]);
    }

    public scaleRow(row: number, c:number) {
        if(c == 0) throw new Error('c must not be 0');
        if(row >= this.rows || row < 0) throw new Error('rows is not within range...');
        for(var i=0;i<this.cols;i++)
            this.matrice[row][i] = (c * this.matrice[row][i]);
    }

    public swapRows(row1:number, row2:number) {
        var temp = this.matrice[row1];
        this.matrice[row1] = this.matrice[row2];
        this.matrice[row2] = temp;
    }

    public renderMatrix() : void {
        var str = [];
        for(var i=0;i<this.rows;i++){
            str[str.length] = "[" + i + "] [ ";
            for(var j=0;j<this.cols;j++)
                str[str.length] = (this.matrice[i][j]) + " ";
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
        return this.matrice[row][col];
    }
}