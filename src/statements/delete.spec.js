/* global it, describe */
import { expect } from 'chai';
import del from './delete';
import printFilePath from '../utils/printFilePath';

export default function() {
  describe(printFilePath(__filename), ()=>{
    it('should be a function', () => {
      expect(del).to.be.a('function');
    });
  });
}