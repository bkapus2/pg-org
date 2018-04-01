export default function selectRelations({ relations, select }) {
  return function(parentEntities) {
    return new Promise((resolve, reject) => {
      const promises = Object.entries(relations).map(([relationKey, relationModel]) => {
        
      });
      return Promise.all(promises).then(() => resolve(parentEntities)).catch(reject);
    });
  }
}