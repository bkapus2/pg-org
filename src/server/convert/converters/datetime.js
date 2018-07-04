export default function integer(value) {
  if (value instanceof Date) {
    return '\'' + value.toLocaleString() + '\'';
  } else {
    throw Error('\'value\' is not a datetime');
  }
}