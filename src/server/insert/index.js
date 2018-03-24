import insertProperties from './insertProperties';
import insertRelations from './insertRelations';

export default function insertMany(model, queryHandler) {
  const { relations } = model;
  return function (entities) {
    return new Promise((resolve, reject) => {
      insertProperties({ model, entities, queryHandler })
        .then(insertRelations({ relations, entities }))
        .then(resolve)
        .catch(reject);
    });
  }
}