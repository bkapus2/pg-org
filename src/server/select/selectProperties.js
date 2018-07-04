// import whereStatement from './../core/statements/whereStatement';
import whereResolver from '../whereResolver';

export default function selectProperties({ query, model, queryHandler, selectProps, options }) {
  const { mode, distinct } = options;
  const { tableName, objectMap, arrayMap } = model;
  return new Promise((resolve, reject) => {
    whereResolver(model, query)
      .then((where) => {
        const text = `
          SELECT${distinct ? ' DISTINCT' : '' } ${selectProps.join(', ')}
          FROM ${tableName}
          ${ where ? 'WHERE ' + where : '' };`;
    
        function mapResults(results) {
          if (mode === 'object') {
            return objectMap(results);
          } else {
            return arrayMap(results);
          }
        }
    
        return queryHandler({ text, rowMode: 'array' })
          .then(mapResults)
          .then(resolve);
      })
      .catch(reject);
  });
}