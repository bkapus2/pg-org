import joinTable from './../../utils/joinTables';

function oneToManySingleKeyJoin({ parents, relationKey, relationModel }) {
  const { joinMap, table } = relationModel;
  const [parentKey, childKey] = joinMap[0];
  const ids = parents.map(entity => entity[parentKey]);
  return table.select({ [childKey]: ids })
    .then(children => {
      console.time(relationKey +' join time');
      const hash = {};

      parents.forEach(parent => {
        parent[relationKey] = [];
        hash[parent[parentKey]] = parent;
      });

      children.forEach(child => {
        hash[child[childKey]][relationKey].push(child);
      });

      // joinTable({
      //   parents,
      //   children,
      //   joinMap,
      //   joinRows(parent, child) {
      //     // parent[relationKey].push(child);
      //   }
      // });

      console.timeEnd(relationKey + ' join time');
    });
}

export default function selectRelations({ model, parents }) {
  return new Promise((resolve, reject) => {
    const { relations, name } = model;
    const promises = Object.entries(relations).map(([relationKey, relationModel]) => {
      const { type, joinMap } = relationModel;
      if (type === 'one-to-many') {
        if (joinMap.length === 1) {
          return oneToManySingleKeyJoin({ parents, relationKey, relationModel });
        } else {
          throw Error('todo: implement multi key joins');
        }
      } else {
        throw Error('Unsupported relation type');
      }
    });

    Promise.all(promises)
      .then(() => resolve(parents))
      .catch(reject);
  });
}