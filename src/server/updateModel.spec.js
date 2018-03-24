import updateModel from './updateModel';
import chai, { expect } from 'chai';
import userModel from './../models/user';
import emailModel from './../models/email';

describe('updateModel', function() {
  it('should be a function', function() {
    expect(updateModel).to.be.a('function');
  });

  describe('return value', function() {
    it('should return an object', function() {
      expect(updateModel(emailModel)).to.be.an('object');
    });
  });

  describe('error conditions', function() {
    it('should throw an error when missing a table relation used in a model', function() {
      expect(() => updateModel(userModel, {})).to.throw(Error);
    });
  });
});