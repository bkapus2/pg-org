import required from '@/utils/required';

export default function select(params) {
  const {
    columns=required('columns'),
  } = params;
  return `RETURNING\n\t${columns.join(',\n\t')}`;
}