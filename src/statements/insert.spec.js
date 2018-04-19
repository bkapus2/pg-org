/* global it, describe */
import { expect } from 'chai';
import insert from './insert';
import printFilePath from '@/utils/printFilePath';

export default function() {
  describe(printFilePath(__filename), ()=>{
    it('should be a function', () => {
      expect(insert).to.be.a('function');
    });
  });
}