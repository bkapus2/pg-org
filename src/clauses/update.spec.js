/* global it, describe */
import { expect } from 'chai';
import update from './update';
import printFilePath from '../utils/printFilePath';

export default function() {
  describe(printFilePath(__filename), ()=>{
    const rightNow = new Date()+'';
    const table = 'table_name';
    const values = {
      col_a: 1,
      col_b: 'a',
      col_c: null,
      col_d: 1.1,
      col_e: rightNow,
      col_f: undefined,
    };

    it('should be a function', () => {
      expect(update).to.be.a('function');
    });
    
    it('should require a table parameter', () => {
      expect(() => update({ values })).to.throw(Error, '\'table\' is a required parameter');
    });
        
    it('should require a values parameter', () => {
      expect(() => update({ table })).to.throw(Error, '\'values\' is a required parameter');
    });

    it('should return a update clause', () =>{
      const value = update({
        table,
        values,
      });
      expect(value).to.be.equal(`UPDATE\n\ttable_name\nSET\n\tcol_a=1,\n\tcol_b='a',\n\tcol_c=NULL,\n\tcol_d=1.1,\n\tcol_e='${rightNow}',\n\tcol_f=DEFAULT`);
    });
  });
}