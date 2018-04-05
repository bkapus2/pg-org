import updateStatement from './../core/statements/updateStatement';

export default function updateMany(model, queryHandler) {
  const { properties, tableName } = model;
  return function (arg) {
    return new Promise((resolve, reject) => {
      resolve(updateStatement({
        table: tableName,
        update: {
          firstName: 'Brian',
        },
        where: {
          id: 1000,
        },
        returning: ['id', 'firstName'],
      }, properties));
    });
  };
}