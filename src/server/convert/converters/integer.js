export default function integer(value, model) {
  if (Number.isInteger(value)) {
    return value;
  } else {
    throw Error('\'value\' is not a number');
  }
}