import getWhereStatement from './core/getWhereStatement';

export default function selectProperties({ query, model, queryHandler, selectProps, options }) {
  const { mode, distinct } = options;
  const { tableName, properties: propModels, objectMap, arrayMap } = model;
  return new Promise((resolve, reject) => {
    const where = getWhereStatement(query, propModels);
    const text = `
      SELECT${distinct ? ' DISTINCT' : '' } ${selectProps.join(', ')}
      FROM ${tableName}
      ${ where ? 'WHERE ' + where : '' };`;
    // console.log(text);

    function mapResults(results) {
      if (mode === 'object') {
        return objectMap(results);
      } else {
        return arrayMap(results);
      }
    }

    queryHandler({ text, rowMode: 'array' })
      .then(mapResults)
      .then(resolve)
      .catch(reject);
  });
}