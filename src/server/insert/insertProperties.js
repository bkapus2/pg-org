import getInsertProps from './core/getInsertProps';
import getInsertValues from './core/getInsertValues';
import getInsertColumns from './core/getInsertColumns';
import getReturnColumns from './../core/getReturnColumns';

export default function insertProperties({ model, entities, queryHandler }) {
  if (!entities.length) {
    return Promise.resolve([]);
  }
  const { table, properties: propModels, mapTableRows } = model;
  return new Promise((resolve, reject) => {
    const insertProps = getInsertProps(propModels);
    const insertValues = getInsertValues(propModels, insertProps, entities);
    const insertColumns = getInsertColumns(propModels, insertProps);
    const returnColumns = getReturnColumns(propModels);
    const query = `
      INSERT INTO ${table} (${insertColumns.join(', ')})
      VALUES ${insertValues.map(row => '(' + row.join(', ') + ')').join(', ')}
      RETURNING ${returnColumns.join(', ')};`
    queryHandler(query)
      .then(result => mapTableRows(result.rows))
      .then(resolve)
      .catch(reject);
  });
}