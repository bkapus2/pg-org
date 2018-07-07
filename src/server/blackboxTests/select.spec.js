/* global describe, before, afterEach, it */
import { expect } from 'chai';
import clearTables from '../testUtils/clearTables';
import { users } from '../testUtils/tables';
// import executeQuery from '../testUtils/executeQuery';

async function insertTestRecords() {
  return await users.insert([
    {
      firstName: 'fName:1',
      lastName: 'lName:1',
      emails: [
        {
          address: 'email:1.1',
        },
        {
          address: 'email:1.2',
        },
      ],
      notes: [
        {
          title: 'title:1.1',
          body: 'body:1.1',
        },
      ],
    },
    {
      firstName: 'fName:2',
      lastName: 'lName:2',
      emails: [
        {
          address: 'email:2.1',
        },
      ],
      notes: [
        {
          title: 'title:2.1',
          body: 'body:2.1',
        },
        {
          title: 'title:2.2',
          body: 'body:2.2',
        },
      ],
    },
    {
      firstName: 'fName:3',
      lastName: 'lName:3',
      emails: [
        {
          address: 'email:3.1',
        },
      ],
      notes: [
        {
          title: 'title:3.1',
          body: 'body:3.1',
        },
        {
          title: 'title:3.2',
          body: 'body:3.2',
        },
      ],
    },
  ]);
}

export default function() {
  describe('inserts', function() {
    before(function() {
      return clearTables()
        .then(insertTestRecords);
    });

    it('should be able to match records', async function() {
      const result = await users.select({
        firstName: 'fName:1',
      });

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('firstName');
      expect(result[0].firstName).to.be.equal('fName:1');
    });

    it('should be able to match related records', async function() {
      const result = await users.select({
        emails: {
          address: 'email:1.1',
        },
      });

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('firstName');
      expect(result[0].firstName).to.be.equal('fName:1');
    });

    it('should be able use the $and operator', async function() {
      const result = await users.select({
        $and: [
          { firstName: 'fName:1' },
          { lastName: 'lName:1' },
        ],
      });

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('firstName');
      expect(result[0].firstName).to.be.equal('fName:1');
    });

    it('should be able use the $and operator across relationships', async function() {
      const result = await users.select({
        $and: [
          { emails: { address: 'email:1.1' } },
          { notes: { title: 'title:1.1' } },
        ],
      });

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('firstName');
      expect(result[0].firstName).to.be.equal('fName:1');
    });

    it('should be able use the $or operator', async function() {
      const result = await users.select({
        $or: [
          { firstName: 'fName:1' },
          { lastName: 'lName:2' },
        ],
      });

      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.have.property('firstName');
      expect(result[0].firstName).to.be.equal('fName:1');
      expect(result[1]).to.have.property('lastName');
      expect(result[1].lastName).to.be.equal('lName:2');
    });

    it('should be able use the $or operator across relationships', async function() {
      const result = await users.select({
        $or: [
          { emails: { address: 'email:1.1' } },
          { notes: { title: 'title:2.1' } },
        ],
      });

      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.have.property('firstName');
      expect(result[0].firstName).to.be.equal('fName:1');
      expect(result[1]).to.have.property('lastName');
      expect(result[1].lastName).to.be.equal('lName:2');
    });
  });
}