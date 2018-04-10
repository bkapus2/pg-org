import updateStatement from './../core/statements/updateStatement';
import updateClause from '@/statements/update';
import whereClause from '@/statements/where';
import returningClause from '@/statements/returning';

function queryText(params) {
  const { table, update: values, where, returnCols } = params;
  return ([
    updateClause({ table, values }),
    whereClause({ where }),
    returningClause({ columns: returnCols }),
  ]).join('\n') + ';';
}

export default function updateMany(model) {
  const { tableName } = model;
  return function () {
    return new Promise((resolve) => {

      resolve(queryText({
        table: tableName,
        update: {
          first_name: 'Brian',
        },
        where: {
          id: 1000,
        },
        returnCols: ['id', 'first_name'],
      }, model));
    });
  };
}