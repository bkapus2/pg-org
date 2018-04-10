import required from '@/utils/required';

function rowValueMapper(value) {
  const type = typeof value;
  if (value === undefined) {
    return 'DEFAULT';
  } else if (value === null) {
    return 'NULL';
  } else if (value === '') {    
    return 'NULL';
  } else if (type === 'string') {
    return `'${value}'`;
  } else if (type === 'number') {
    return value;
  } else if (value instanceof Date) {
    return `'${value}'`;
  } else {
    throw Error(`Cannot create setter for value '${value}' of type '${type}'`);
  }
}

function rowMapper(row) {
  return row.map(rowValueMapper);
}

function mapRows(rows) {
  return rows.map(row => `(${rowMapper(row).join(', ')})`);
}

export default function UPDATE(params) {
  const {
    table=required('table'),
    columns=required('columns'),
    rows=required('rows'),
  } = params;
  return `INSERT INTO ${table} (${columns.join(', ')})\nVALUES\n\t${mapRows(rows).join(',\n\t')}`;
}