import updateStatement from './../core/statements/updateStatement';

export default function updateMany(model) {
  const { tableName } = model;
  return function () {
    return new Promise((resolve) => {
      resolve(updateStatement({
        table: tableName,
        update: {
          id: 1000,
          firstName: 'Brian',
        },
        where: {
          id: 1000,
        },
        returning: ['id', 'firstName'],
      }, model));
    });
  };
}