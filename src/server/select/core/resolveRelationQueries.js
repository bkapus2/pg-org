export default function resolveRelationQueries({ relations, query, queryHandler }) {
  return new Promise((resolve, reject) => {
    const promises = Object.entries(relations).reduce((promises, [key, model]) => {
      if (query[key]) {
        const { table, joinMap } = model;
        const childProps = joinMap.map(([parentProp, childProp]) => childProp);
        const parentProps = joinMap.map(([parentProp, childProp]) => parentProp);
        const promise = table.select(childProps, query[key], { mode: 'array', distinct: true })
          .then(records => {
            if(joinMap.length === 1) {
              return {
                [parentProps[0]]: records.map(r => r[0]),
              }
            } else {
              throw Error('need to implement multi key relaional joins');
            }
          })
        promises.push(promise);
      }
      return promises;
    }, []);

    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });
}