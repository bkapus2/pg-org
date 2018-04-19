/* global it, describe */
import { expect } from 'chai';
import insertProperties from './insertProperties';
import printFilePath from '@/utils/printFilePath';

export default function() {
  describe(printFilePath(__filename), () => {
    it('should be a function', () => {
      expect(insertProperties).to.be.a('function');
    });
  });
}