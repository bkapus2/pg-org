import getOneToManyRelations from './core/getOneToManyRelations';
import mergeOneToManyRelations from './core/mergeOneToManyRelations';
import joinEntities from './core/joinEntities';

const pickTypeHandler = {
  'one-to-many': getOneToManyRelations,
  default: function() {
    throw Error('Unsupported relation type');
  },
};

const mergeTypeHandler = {
  'one-to-many': mergeOneToManyRelations,
};

export default function insertRelations({ relations, entities }) {
  return function(rootEntities) {
    return new Promise((resolve, reject) => {
      const promises = Object.entries(relations).map(([relationKey, relationModel]) => {
        const { joinMap, type, table } = relationModel;
        const relatedEntities = pickTypeHandler[type](entities, relationKey);
        // not sure if this is necessary here
        if (relatedEntities.length !== rootEntities.length) {
          throw Error('entity roots does not match the number of input entities');
        }
        const childEntities = joinEntities(rootEntities, joinMap, relatedEntities);
        return table.insert(childEntities)
          .then(childEntities => mergeTypeHandler[type](rootEntities, relationKey, joinMap, childEntities));
      });
      return Promise.all(promises).then(() => resolve(rootEntities)).catch(reject);
    });
  };
}