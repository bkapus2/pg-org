// import whereStatement from './../core/statements/whereStatement';
import whereResolver from '@/server/whereResolver';

export default function selectProperties({ query, model, queryHandler, selectProps, options }) {
  const { mode, distinct } = options;
  const { tableName, objectMap, arrayMap } = model;
  return new Promise((resolve, reject) => {
    const where = whereStatement(query, propModels);
    const clauses = [
      `SELECT${distinct ? ' DISTINCT' : '' } ${selectProps.join(', ')} FROM ${tableName}`,
    ];
    where && clauses.push(`${ where ? 'WHERE ' + where : '' }`);
    const text = clauses.join(' ') + ';';

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