import required from '@/utils/required';
import selectClause from '@/clauses/select';
import whereClause from '@/clauses/where';

export default function select(options) {
  const {
    select=required('select'),
    from=required('from'),
    where,
  } = options;

  const clauses = [selectClause({
    columns: select,
    table: from,
  })];

  if (where) {
    clauses.push(whereClause({ conditions: where }));
  }

  return clauses.join('\n')+';';
}