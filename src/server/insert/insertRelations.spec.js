/* global it, describe */
import { expect } from 'chai';
import insertRelations from './insertRelations';

export default function() {
  describe(__dirname.split('src')[1]+'\\insertRelations', () => {
    it('should be a function', () => {
      expect(insertRelations).to.be.a('function');
    });
  });
}