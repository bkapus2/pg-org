export default function timestamp(value) {
  if (value instanceof Date) {
    return '\'' + value.toLocaleString() + '\'';
  } else {
    throw Error('\'value\' is not a timestamp');
  }
}