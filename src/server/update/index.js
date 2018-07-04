// import updateStatement from '../core/statements/updateStatement';
import whereResolver from '../whereResolver';

export default function updateMany(model) {
  const { tableName } = model;
  return function (where, update, queryHandler) {
    return new Promise((resolve, reject) => {
      whereResolver(model, where)
        .then(console.log)
        .then(resolve)
        .catch(reject);
    });
  };
}