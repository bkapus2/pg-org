import required from '@/utils/required';

export default function select(params) {
  const { table = required('table') } = params;
  return `DELETE FROM ${table}`;
}