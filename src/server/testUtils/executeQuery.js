import { Pool } from 'pg';
import dbParams from '../../../dbParams';

const pool = new Pool(dbParams);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default async function executeQuery(query) {
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    console.log(query.text);
    return result;
  } finally {
    client.release();
  }
} 