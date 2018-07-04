/* global describe, before, afterEach, it */
import { expect } from 'chai';
import clearTables from '../testUtils/clearTables';
import { emails } from '../testUtils/tables';
// import executeQuery from '../testUtils/executeQuery';

export default function() {
  describe('inserts', function() {
    before(clearTables);
    afterEach(clearTables);

    it('should return the values that are passed to it', async function() {
      const result = await emails.insert([
        {
          email: 'brian.kupi@gmail.com',
        },
      ]);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('email');
      expect(result[0].email).to.be.equal('brian.kupi@gmail.com');
      expect(result[0]).to.have.property('id');
      expect(result[0].id).to.be.a('number');
    });
  });
}