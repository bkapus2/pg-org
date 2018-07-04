import isNullOrUndefined from './../utils/isNullOrUndefined';

export default function integer(value, model) {
  if (isNullOrUndefined(value)) {
    if (model.defaultValue) {
      return model.defaultValue;
    } else {
      return 'NULL';
    }
  } else {
    if (value instanceof Date) {
      return `'${value.toLocaleDateString()}'`;
    } else {
      throw Error('\'value\' is not a date');
    }
  }
}