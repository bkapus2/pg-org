/* global it, describe */
import { expect } from 'chai';
import select from '@/statements/helpers/select';

export default function() {
  describe('statements/helpers/select', ()=>{
    const table = 'table_name';
    const columns = ['col_a', 'col_b'];

    it('should be a function', () => {
      expect(select).to.be.a('function');
    });
    
    it('should require a table parameter', () => {
      expect(() => select({ columns })).to.throw(Error, '\'table\' is a required parameter');
    });
        
    it('should require a columns parameter', () => {
      expect(() => select({ table })).to.throw(Error, '\'columns\' is a required parameter');
    });

    it('should return a select statement', () => {
      const value = select({
        table,
        columns,
      });
      expect(value).to.be.equal('SELECT\n\tcol_a,\n\tcol_b\nFROM\n\ttable_name');
    });
  });
}