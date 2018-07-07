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
      birthday: new Date('1970/01/01'),
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
          dateEntered: new Date('2017/01/01'),
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
  describe('<collection> #select', function() {
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

    it('should be able use the $and operator across one-to-many relationships', async function() {
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

    it('should be able use the $or operator across one-to-many relationships', async function() {
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

    it('should be able use the $lt operator', async function() {
      const result1 = await users.select({
        birthday: { $lt: new Date('1970/01/02') },
      });
      expect(result1).to.have.lengthOf(1);
      expect(result1[0]).to.have.property('firstName');
      expect(result1[0].firstName).to.be.equal('fName:2');
      
      const result2 = await users.select({
        birthday: { $lt: new Date('1970/01/01') },
      });
      expect(result2).to.have.lengthOf(0);
      
      const result3 = await users.select({
        birthday: { $lt: new Date('1969/12/31') },
      });
      expect(result3).to.have.lengthOf(0);
    });

    it('should be able use the $lt operator across one-to-many relationships', async function() {
      const result1 = await users.select({
        notes: { dateEntered: { $lt: new Date('2017/01/02') } },
      });
      expect(result1).to.have.lengthOf(1);
      expect(result1[0]).to.have.property('firstName');
      expect(result1[0].firstName).to.be.equal('fName:2');

      const result2 = await users.select({
        notes: { dateEntered: { $lt: new Date('2017/01/01') } },
      });
      expect(result2).to.have.lengthOf(0);

      const result3 = await users.select({
        notes: { dateEntered: { $lt: new Date('2016/12/31') } },
      });
      expect(result3).to.have.lengthOf(0);
    });

    it('should be able use the $gt operator', async function() {
      const result1 = await users.select({
        birthday: { $gt: new Date('1969/12/31') },
      });
      expect(result1).to.have.lengthOf(1);
      expect(result1[0]).to.have.property('firstName');
      expect(result1[0].firstName).to.be.equal('fName:2');
      
      const result2 = await users.select({
        birthday: { $gt: new Date('1970/01/01') },
      });
      expect(result2).to.have.lengthOf(0);
      
      const result3 = await users.select({
        birthday: { $gt: new Date('1970/01/02') },
      });
      expect(result3).to.have.lengthOf(0);
    });

    it('should be able use the $gt operator across one-to-many relationships', async function() {
      const result1 = await users.select({
        notes: { dateEntered: { $gt: new Date('2016/12/31') } },
      });
      expect(result1).to.have.lengthOf(1);
      expect(result1[0]).to.have.property('firstName');
      expect(result1[0].firstName).to.be.equal('fName:2');

      const result2 = await users.select({
        notes: { dateEntered: { $gt: new Date('2017/01/01') } },
      });
      expect(result2).to.have.lengthOf(0);

      const result3 = await users.select({
        notes: { dateEntered: { $gt: new Date('2017/01/02') } },
      });
      expect(result3).to.have.lengthOf(0);
    });

    // it('should be able use the $size aggregator', async function() {
    //   console.log('\n\n\n\n');
    //   const result1 = await users.select({
    //     emails: { $size: { $gt: 1 } }, // todo how to aggregate based on relational where, or just based on size
    //   });
    //   console.log(result1);
    //   // expect(result1).to.have.lengthOf(1);
    //   // expect(result1[0]).to.have.property('firstName');
    //   // expect(result1[0].firstName).to.be.equal('fName:2');
      
    //   // const result2 = await users.select({
    //   //   birthday: { $gt: new Date('1970/01/01') },
    //   // });
    //   // expect(result2).to.have.lengthOf(0);
      
    //   // const result3 = await users.select({
    //   //   birthday: { $gt: new Date('1970/01/02') },
    //   // });
    //   // expect(result3).to.have.lengthOf(0);
    // });
  });
}

({
  emails: {
    $size: {
      $gt: 1,
    },
  },
})