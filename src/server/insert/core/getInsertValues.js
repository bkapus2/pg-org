import * as insertTypes from '../../convert/insertTypes';

export default function getInsertValues(propModels, props, entities) {
  var rows = [];
  for (var entity of entities) {
    var row = [];
    for (var prop of props) {
      var propModel = propModels[prop];
      row.push(insertTypes[propModel.type](entity[prop], propModel));
    }
    rows.push(row);
  }
  return rows;
}