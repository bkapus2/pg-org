/* global it, describe */
import normalizeText from '@/utils/normalizeText';
import { expect } from 'chai';
import whereClause from './where';
import printFilePath from '@/utils/printFilePath';

export default function() {
  describe(printFilePath(__filename), () => {
    it('should be a function', () => {
      expect(whereClause).to.be.a('function');
    });
    
    it('should should handle simple where statements', () => {
      const conditions = {
        first_name: 'Brian',
        last_name: null,
      };
      const clause = whereClause({ conditions });
      const actual = normalizeText(clause);
      const expected = normalizeText(`
        WHERE
          first_name = 'Brian'
          AND last_name IS NULL
      `);
      expect(expected).to.be.equal(actual);
    });
    
    it('should should handle the $or operator', () => {
      const conditions = {
        $or: [
          {
            first_name: 'Brian',
          },
          {
            last_name: null,
          },
        ],
      };
      const clause = whereClause({ conditions });
      const actual = normalizeText(clause);
      const expected = normalizeText(`
          WHERE
            ( first_name = 'Brian' )
            OR ( last_name IS NULL )
        `);
      expect(actual).to.be.equal(expected);
    });
    
    // it('should should handle the $areIn operator', () => {
    //   const conditions = {
    //     $areIn: [
    //       {
    //         keys: ['first_name','last_name'],

    //       },
    //       {
    //         last_name: null,
    //       },
    //     ],
    //   };
    //   const clause = whereClause({ conditions });
    //   const actual = normalizeText(clause);
    //   const expected = normalizeText(`
    //       WHERE
    //         ( first_name = 'Brian' )
    //         OR ( last_name IS NULL )
    //     `);
    //   expect(expected).to.be.equal(actual);
    // });
  });
}