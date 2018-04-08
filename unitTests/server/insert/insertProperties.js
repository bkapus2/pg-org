/* global it, describe */
import { expect } from 'chai';
import insertProperties from '@/server/insert/insertProperties';

export default function() {
  describe('server/insert/insertProperties', () => {
    it('should be a function', () => {
      expect(insertProperties).to.be.a('function');
    });
  });
}