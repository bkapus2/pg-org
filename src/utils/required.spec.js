/* global it, describe */
import { expect } from 'chai';
import required from './required';
import printFilePath from '../utils/printFilePath';

export default function() {
  describe(printFilePath(__filename), () => {
    const param = 'param';

    it('should be a function', () => {
      expect(required).to.be.a('function');
    });

    it('should throw an error', () => {
      expect(() => required(param)).to.throw(Error, `'${param}' is a required parameter`);
    });
  });
}