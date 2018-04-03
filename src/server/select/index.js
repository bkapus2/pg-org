import selectProperties from './selectProperties';
import selectRelations from './selectRelations';
import parseSelectArgs from './core/parseSelectArgs';
import resolveRelationQueries from './core/resolveRelationQueries';

export default function selectMany(model, queryHandler) {
  const { relations, name } = model;
  return function (...args) {
    return new Promise((resolve, reject) => {
      const [ selectProps, rootQuery, relationsQuery, options ] = parseSelectArgs({ args, model });
      resolveRelationQueries({ relations, query: relationsQuery, queryHandler })
        .then(queries => {
          queries.push(rootQuery);
          return selectProperties({ selectProps, query: queries, model, queryHandler, options })
        })
        .then(rootEntities => selectRelations({ model, parents: rootEntities }))
        .then(resolve)
        .catch(reject);
    });
  }
}