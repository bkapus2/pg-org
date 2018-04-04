import { Pool, } from 'pg';
import emailModel from './models/email';
import noteModel from './models/note';
import userModel from './models/user';
import table from './server/table';
import dbParams from '../dbParams.json';

const pool = new Pool(dbParams);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
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
const notes = table(noteModel, sendQuery);
const users = table(userModel, sendQuery, { emails, notes, });

// const createUser = () => users.insert([
//   {
//     firstName: 'Brian',
//     lastName: 'Kapustka',
//     username: 'brian.kapustka',
//     emails: [
//       {
//         email: 'brian.kupi@gmail.com',
//       },
//     ],
//     notes: [
//       {
//         title: 'note test - title',
//         body: 'note test - body',
//       },
//     ],
//   },
// ])

// for (var i = 0; i < 2000; i++) {
//   createUser();
// } 

// users.insert([
//   {
//     firstName: 'Brian',
//     lastName: 'Kapustka',
//     username: 'brian.kapustka',
//     emails: [
//       {
//         email: 'brian.kupi@gmail.com',
//       },
//     ],
//     notes: [
//       {
//         title: 'Created user',
//         body: 'creating some test records',
//       },
//     ],
//   },
//   {
//     firstName: 'Another',
//     lastName: 'User',
//     username: 'another.user',
//     emails: [
//       {
//         email: 'another.user@gmail.com',
//       },
//       {
//         email: 'another.user@yahoo.com',
//       },
//     ],
//     notes: [
//       {
//         title: 'Created user',
//         body: 'creating some test records',
//       },
//     ],
//   },
// ]).then(value => {
//   console.log(JSON.stringify(value, null, '  '))
// }).catch(console.error);

console.time('select time');
users.select({})
  .then(value => {
    console.log(JSON.stringify(value, null, '  '));
    console.timeEnd('select time');
  })
  .catch(console.error);

// console.time('select time');
// users.select({
//   // id: [1000, 1001, 1002],
//   firstName: ['Brian']
// }).then(value => {
//   console.log(value.length);
//   // console.log(JSON.stringify(value, null, '  '));
//   console.timeEnd('select time');
// }).catch(console.error);