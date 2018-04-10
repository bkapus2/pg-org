/* global it, describe */
import { expect } from 'chai';
import insertProperties from './insertProperties';

export default function() {
  describe(__dirname.split('src')[1]+'\\insertProperties', () => {
    it('should be a function', () => {
      expect(insertProperties).to.be.a('function');
    });
  });
}