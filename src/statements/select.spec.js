/* global it, describe */
import { expect } from 'chai';
import selectStatement from './select';
import normalizeText from '../utils/normalizeText';

export default function() {
  describe(__dirname.split('src\\')[1]+'\\select', ()=>{
    it('should be a function', () => {
      expect(selectStatement).to.be.a('function');
    });

    it('should return a select statement', () => {
      const statement = selectStatement({
        select: ['first_name', 'last_name'],
        from: 'people',
      });

      const actual = normalizeText(statement);
      const expected = normalizeText(`
        SELECT
          first_name,
          last_name
        FROM
          people;
      `);
      expect(actual).to.be.equal(expected);
    });

    it('should return a select statement with a where clause', () => {
      const statement = selectStatement({
        select: ['first_name', 'last_name'],
        from: 'people',
        where: {
          id: 1,
        },
      });

      const actual = normalizeText(statement);
      const expected = normalizeText(`
        SELECT
          first_name,
          last_name
        FROM
          people
        WHERE
          id = 1;
      `);
      expect(actual).to.be.equal(expected);
    });
  });
}