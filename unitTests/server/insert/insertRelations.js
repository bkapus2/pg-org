/* global it, describe */
import { expect } from 'chai';
import insertRelations from '@/server/insert/insertRelations';

export default function() {
  describe('server/insert/insertRelations', () => {
    it('should be a function', () => {
      expect(insertRelations).to.be.a('function');
    });
  });
}