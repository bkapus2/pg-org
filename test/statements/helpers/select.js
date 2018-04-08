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
      expect(() => select({ columns })).to.throw(Error);
    });
        
    it('should require a values parameter', () => {
      expect(() => select({ table })).to.throw(Error);
    });

    it('should return a select statement', () => {
      const value = select({
        table,
        columns,
      });
      expect(value).to.be.equal('SELECT col_a, col_b FROM table_name');
    });
  });
}