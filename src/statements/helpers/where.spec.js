/* global it, describe */
import { expect } from 'chai';
import where from './where';

export default function() {
  describe(__dirname.split('src')[1]+'\\where', () => {
    it('should be a function', () => {
      expect(where).to.be.a('function');
    });
  });
}