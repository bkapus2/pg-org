import required from '../utils/required';

function valueReducer(setters, [column, value]) {
  const type = typeof value;
  if (value === undefined) {
    setters.push(`${column}=DEFAULT`);
  } else if (value === null) {
    setters.push(`${column}=NULL`);
  } else if (value === '') {    
    setters.push(`${column}=NULL`);
  } else if (type === 'string') {
    setters.push(`${column}='${value}'`);
  } else if (type === 'number') {
    setters.push(`${column}=${value}`);
  } else if (value instanceof Date) {
    setters.push(`${column}='${value}'`);
  } else {
    throw Error(`Cannot create setter for value '${value}' of type '${type}'`);
  }
  return setters;
}

function reduceValues(values) {
  return Object.entries(values).reduce(valueReducer, []);
}

export default function UPDATE(params) {
  const {
    table=required('table'),
    values=required('values'),
  } = params;
  return `UPDATE\n\t${table}\nSET\n\t${reduceValues(values).join(',\n\t')}`;
}