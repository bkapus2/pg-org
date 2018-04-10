/* global it, describe */
import { expect } from 'chai';
import del from './delete';

export default function() {
  describe(__dirname.split('src\\')[1]+'\\delete', ()=>{
    it('should be a function', () => {
      expect(del).to.be.a('function');
    });
  });
}