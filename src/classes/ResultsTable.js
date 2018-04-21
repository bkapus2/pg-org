export default class ResultsTable {
  constructor({ name, columns, rows }) {
    this.name = name;
    this.columns = columns;
    this.rows = rows;
  }

  getCol(name) {
    const index = this.columns.indexOf(name);
    if (index === -1) {
      throw Error('column name does not exist');
    }
    const colValues = [];
    for (var row of this.rows) {
      colValues.push(row[index]);
    }
    return colValues;
  }

  toObjects() {
    const columns = this.columns;
    const columnsLen = columns.length;
    const objects = [];
    for (var row of this.rows) {
      var object = {};
      for (var iCol = 0; iCol < columnsLen; iCol++) {
        var prop = columns[iCol];
        object[prop] = row[iCol];
      }
      objects.push(object);
    }
    return objects;
  }

  get rowCount() {
    return this.rows.length;
  }
}