/* global it, describe */
import { expect } from 'chai';
import del from './delete';

export default function() {
  describe(__dirname.split('src\\')[1]+'\\delete', ()=>{
    const table = 'table_name';

    it('should be a function', () => {
      expect(del).to.be.a('function');
    });
    
    it('should require a table parameter', () => {
      expect(() => del({})).to.throw(Error, '\'table\' is a required parameter');
    });

    it('should return a delete statement', () => {
      const value = del({ table });
      expect(value).to.be.equal(`DELETE FROM ${table}`);
    });
  });
}