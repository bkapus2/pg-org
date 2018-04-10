/* global it, describe */
import { expect } from 'chai';
import insert from './insert';

export default function() {
  describe(__dirname.split('src\\')[1]+'\\insert', ()=>{
    it('should be a function', () => {
      expect(insert).to.be.a('function');
    });
  });
}