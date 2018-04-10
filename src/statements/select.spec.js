/* global it, describe */
import { expect } from 'chai';
import select from './select';

export default function() {
  describe(__dirname.split('src\\')[1]+'\\select', ()=>{
    it('should be a function', () => {
      expect(select).to.be.a('function');
    });
  });
}