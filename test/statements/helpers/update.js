/* global it, describe */
import { expect } from 'chai';
import update from '@/statements/helpers/update';

export default function() {
  describe('statements/helpers/update', ()=>{
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
      expect(() => update({ values })).to.throw(Error);
    });
        
    it('should require a values parameter', () => {
      expect(() => update({ table })).to.throw(Error);
    });

    it('should return a update statement', () =>{
      const value = update({
        table,
        values,
      });
      expect(value).to.be.equal(`UPDATE table_name SET col_a=1, col_b='a', col_c=NULL, col_d=1.1, col_e='${rightNow}', col_f=DEFAULT`);
    });
  });
}