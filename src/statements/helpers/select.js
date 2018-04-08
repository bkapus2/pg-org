import required from '@/utils/required';

export default function select(params) {
  const {
    table=required('table'),
    columns=required('columns'),
  } = params;
  return `SELECT ${columns.join(', ')} FROM ${table}`;
}