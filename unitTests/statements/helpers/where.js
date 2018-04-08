/* global it, describe */
import { expect } from 'chai';
import where from '@/statements/helpers/where';

export default function() {
  describe('statemetns/helpers/where', () => {
    it('should be a function', () => {
      expect(where).to.be.a('function');
    });
  });
}