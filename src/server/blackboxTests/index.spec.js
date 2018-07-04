/* global describe, before */
import dropTables from '../testUtils/dropTables';
import createTables from '../testUtils/createTables';
import insertSpec from './insert.spec';
import selectSpec from './select.spec';

export default function() {
  describe('Blackbox tests', function() {

    // drop any previously existing tables and recreate them
    before(function() {
      return dropTables()
        .then(createTables);
    });

    insertSpec();
    selectSpec();
  });
}