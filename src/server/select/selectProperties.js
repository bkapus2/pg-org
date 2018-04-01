import getWhereStatement from './core/getWhereStatement'

export default function selectProperties({ query, model, queryHandler, selectProps, options }) {
  const { mode, distinct } = options;
  const { table, properties: propModels, mapResults } = model;
  return new Promise((resolve, reject) => {
    const where = getWhereStatement(query, propModels);
    const text = `
      SELECT${distinct ? ' DISTINCT' : '' } ${selectProps.join(', ')}
      FROM ${table}
      ${ where ? 'WHERE ' + where : '' };`;
    console.log(text);
    queryHandler({ text, rowMode: 'array' })
      .then(results => mode === 'object' ? mapResults(results) : results.rows)
      .then(resolve)
      .catch(reject);
  });
}