export default function integer(value) {
  if (Number.isInteger(value)) {
    return value;
  } else {
    throw Error('\'value\' is not a number');
  }
}