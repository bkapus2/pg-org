/* global describe, before, afterEach, it */
import { expect } from 'chai';
import clearTables from '../testUtils/clearTables';
import { users, emails } from '../testUtils/tables';
// import executeQuery from '../testUtils/executeQuery';

export default function() {
  describe('<collection> #insert', function() {
    before(clearTables);
    afterEach(clearTables);

    it('should return the values that are passed to it', async function() {
      const result = await emails.insert([
        {
          address: 'brian.kupi@gmail.com',
        },
      ]);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('address');
      expect(result[0].address).to.be.equal('brian.kupi@gmail.com');
    });

    it('should allow complex insertes (related records)', async function() {
      const result = await users.insert([
        {
          firstName: 'Brian',
          lastName: 'Kapustka',
          emails: [
            {
              address: 'brian.kupi@gmail.com',
            },
          ],
          notes: [
            {
              title: 'title',
              body: 'body',
            },
          ],
        },
      ]);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('firstName');
      expect(result[0].firstName).to.be.equal('Brian');

      expect(result[0]).to.have.property('lastName');
      expect(result[0].lastName).to.be.equal('Kapustka');

      expect(result[0]).to.have.property('emails');
      expect(result[0].emails).to.have.lengthOf(1);
      expect(result[0].emails[0]).to.have.property('address');
      expect(result[0].emails[0].address).to.be.equal('brian.kupi@gmail.com');
      expect(result[0].emails[0].userId).to.be.equal(result[0].id);

      expect(result[0]).to.have.property('notes');
      expect(result[0].notes).to.have.lengthOf(1);
      expect(result[0].notes[0]).to.have.property('title');
      expect(result[0].notes[0].title).to.be.equal('title');
      expect(result[0].notes[0]).to.have.property('body');
      expect(result[0].notes[0].body).to.be.equal('body');
      expect(result[0].notes[0].userId).to.be.equal(result[0].id);
    })
  });
}