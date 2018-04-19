/* global it, describe */
import { expect } from 'chai';
import insertRelations from './insertRelations';
import printFilePath from '@/utils/printFilePath';

export default function() {
  describe(printFilePath(__filename), () => {
    it('should be a function', () => {
      expect(insertRelations).to.be.a('function');
    });
  });
}