/* global it, describe */
import { expect } from 'chai';
import required from '@/utils/required';

export default function() {
  describe('utils/required', () => {
    const param = 'param';

    it('should be a function', () => {
      expect(required).to.be.a('function');
    });

    it('should throw an error', () => {
      expect(() => required(param)).to.throw(Error, `'${param}' is a required parameter`);
    });
  });
}