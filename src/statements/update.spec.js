/* global it, describe */
import { expect } from 'chai';
import update from './update';

export default function() {
  describe(__dirname.split('src\\')[1]+'\\update', ()=>{
    it('should be a function', () => {
      expect(update).to.be.a('function');
    });
  });
}