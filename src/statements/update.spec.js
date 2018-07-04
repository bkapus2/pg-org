/* global it, describe */
import { expect } from 'chai';
import update from './update';
import printFilePath from '../utils/printFilePath';

export default function() {
  describe(printFilePath(__filename), ()=>{
    it('should be a function', () => {
      expect(update).to.be.a('function');
    });
  });
}