export default function resolveRelationQueries({ relations, query, queryHandler }) {
  return new Promise((resolve, reject) => {
    const promises = Object.entries(relations).reduce((promises, [relationkey, relationModel]) => {
      if (query[relationkey]) {
        const { table, joinMap } = relationModel;
        const { name } = table;
        const childProps = joinMap.map(([parentProp, childProp]) => childProp);
        const parentProps = joinMap.map(([parentProp, childProp]) => parentProp);
        const promise = table.select(childProps, query[relationkey], { mode: 'array', distinct: true })
          .then(childTable => {
            if(joinMap.length === 1) {
              return {
                [parentProps[0]]: childTable.getCol(childProps[0]),
              };
            } else {
              throw Error('need to implement multi key relaional joins');
            }
          });
        promises.push(promise);
      }
      return promises;
    }, []);

    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });
}