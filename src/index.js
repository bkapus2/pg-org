import { Pool } from 'pg';
import emailModel from './models/email';
import userModel from './models/user';
import table from './server/table';
import dbParams from '../dbParams.json';

const pool = new Pool(dbParams);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

async function sendQuery(query) {
  const client = await pool.connect();
  try {
    return await client.query(query);
  } finally {
    client.release();
  }
} 

const emails = table(emailModel, sendQuery);
const users = table(userModel, sendQuery, { emails });

users.insert([
  {
    firstName: 'Brian',
    lastName: 'Kapustka',
    username: 'brian.kapustka',
    favoriteNumber: 3,
    emails: [
      {
        email: 'brian.kupi@gmail.com',
      },
      {
        email: 'brian.kupi@yahoo.com',
      },
    ],
  },
  {
    firstName: 'Another',
    lastName: 'User',
    username: 'another.user',
    emails: [
      {
        email: 'another.user@gmail.com',
      },
      {
        email: 'another.user@yahoo.com',
      },
    ],
  },
]).then(value => {
  console.log(JSON.stringify(value, null, '  '))
}).catch(console.error);