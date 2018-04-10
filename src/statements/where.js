import required from '@/utils/required';

export default function where(params) {
  const {
    where=required('where'),
  } = params;
  return 'WHERE';
}