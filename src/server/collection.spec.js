import collection from './collection';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
chai.use(spies);

import userModel from './../models/user.js';
import emailModel from './../models/email.js';

describe('collection', function() {
  
  it('should be a function', function() {
    expect(collection).to.be.a('function');
  });

  const queryHandler = value => new Promise((resolve, reject) => {
    console.log(value);
    resolve([]);
  });
  const emails = collection(emailModel, queryHandler);
  const users = collection(userModel, queryHandler, { emails: emails });
  console.log(emails);
  const spy = chai.spy();

  it('should return an object', function() {
    expect(emails).to.be.an('object');
  });

  describe('#insert', function() {
    it('should be a function', function() {
      expect(emails.insert).to.be.a('function');
    });
    it('should be a function', function() {
      users.insert([
        {
          firstName: 'Brian',
          lastName: 'Kapustka',
          username: 'brian.kapustka',
          favoriteNumber: 3,
          emails: [
            {
              email: 'brian.kupi@gmail.com',
            },
            {
              email: 'brian.kupi@yahoo.com',
            },
          ],
        },
        {
          firstName: 'Another',
          lastName: 'User',
          username: 'another.user',
          emails: [
            {
              email: 'another.user@gmail.com',
            },
            {
              email: 'another.user@yahoo.com',
            },
          ],
        },
      ]).catch(console.error);
      // expect(emails.insert([{}])).to.be.a('function');
    });
  });

  describe('#select', function() {
    it('should be a function', function() {
      expect(emails.select).to.be.a('function');
    });
  });

  describe('#update', function() {
    it('should be a function', function() {
      expect(emails.update).to.be.a('function');
    });
  });

  describe('#delete', function() {
    it('should be a function', function() {
      expect(emails.delete).to.be.a('function');
    });
  });
});