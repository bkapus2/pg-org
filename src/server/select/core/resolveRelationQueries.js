export default function resolveRelationQueries({ relations, query }) {
  return new Promise((resolve, reject) => {
    const promises = Object.entries(relations).reduce((promises, [relationkey, relationModel]) => {
      if (query[relationkey]) {
        const { table, joinMap } = relationModel;
        const childProps = joinMap.map(entry => entry[1]);
        const parentProps = joinMap.map(entry => entry[0]);
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