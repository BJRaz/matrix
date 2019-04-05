import { Matrix } from "../matrix";
import { assert } from "chai";

describe('matrix', () => {
    it('getNoRows', () => {
        let m = new Matrix(0,0);
        let result = m.getNoRows();
        chai.assert.equal(result,0);
    });
    it('getNoRows', () => {
        let m = new Matrix(0,0);
        let result = m.getNoCols();
        assert.equal(result,0);
    });
})