import text from './../../convert/text';
import integer from './../../convert/integer';

const converters = {
  text,
  integer,
  default() {
    throw Error('unsupported type');
  }
}

export default function getInsertValues(propModels, props, entities) {
  var rows = [];
  for (var entity of entities) {
    var row = [];
    for (var prop of props) {
      var propModel = propModels[prop];
      row.push(converters[propModel.type](entity[prop], propModel))
    }
    rows.push(row);
  }
  return rows;
}