export default function text(value) {
  if (typeof value === 'string') {
    return '\'' + value.replace('\'','\'\'') + '\'';
  } else {
    throw Error('\'value\' is not a string');
  }
}