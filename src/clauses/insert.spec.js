/* global it, describe */
import { expect } from 'chai';
import insert from './insert';
import printFilePath from '@/utils/printFilePath';

export default function() {
  describe(printFilePath(__filename), ()=>{
    const rightNow = new Date()+'';
    const table = 'table_name';
    const columns = ['col_a', 'col_b', 'col_c', 'col_d', 'col_e', 'col_f'];
    const rows = [[1, 'a', null, 1.1, rightNow, undefined]];

    it('should be a function', () => {
      expect(insert).to.be.a('function');
    });
    
    it('should require a table parameter', () => {
      expect(() => insert({ columns, rows })).to.throw(Error, '\'table\' is a required parameter');
    });
    
    it('should require a columns parameter', () => {
      expect(() => insert({ table, rows })).to.throw(Error, '\'columns\' is a required parameter');
    });

    it('should require a rows parameter', () => {
      expect(() => insert({ table, columns })).to.throw(Error, '\'rows\' is a required parameter');
    });

    it('should return a insert clause', () => {
      const value = insert({
        table,
        columns,
        rows,
      });
      expect(value).to.be.equal(`INSERT INTO table_name (col_a, col_b, col_c, col_d, col_e, col_f)\nVALUES\n\t(1, 'a', NULL, 1.1, '${rightNow}', DEFAULT)`);
    });
  });
}