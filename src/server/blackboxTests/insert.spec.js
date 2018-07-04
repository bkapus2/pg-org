/* global describe, before, afterEach, it */
import { expect } from 'chai';
import clearTables from '../testUtils/clearTables';
import { users, emails } from '../testUtils/tables';
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
    });

    it('should allow complex insertes (related records)', async function() {
      const result = await users.insert([
        {
          firstName: 'Brian',
          lastName: 'Kapustka',
          emails: [
            {
              email: 'brian.kupi@gmail.com',
            },
          ],
        }
      ]);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('firstName');
      expect(result[0].firstName).to.be.equal('Brian');

      expect(result[0]).to.have.property('lastName');
      expect(result[0].lastName).to.be.equal('Kapustka');

      expect(result[0]).to.have.property('emails');
      expect(result[0].emails).to.have.lengthOf(1);
      expect(result[0].emails[0]).to.have.property('email');
      expect(result[0].emails[0].email).to.be.equal('brian.kupi@gmail.com');
      expect(result[0].emails[0].userId).to.be.equal(result[0].id);
    })
  });
}