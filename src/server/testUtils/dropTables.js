import getSqlText from './getSqlText';
import executeQuery from './executeQuery';

export default function dropTables() {
  return new Promise((resolve, reject) => {
    getSqlText('dbTeardown.sql')
      .then(text => executeQuery({text}))
      .then(resolve)
      .catch(reject);
  });
}