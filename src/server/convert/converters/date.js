export default function integer(value) {
  if (value instanceof Date) {
    return '\'' + value.toLocaleDateString() + '\'';
  } else {
    throw Error('\'value\' is not a date');
  }
}