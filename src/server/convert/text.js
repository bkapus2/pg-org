import isNullOrUndefined from './../utils/isNullOrUndefined';

export default function text(value, model) {
  if (isNullOrUndefined(value)) {
    if (model.defaultValue) {
      return model.defaultValue;
    } else {
      return 'NULL';
    }
  } else {
    if (typeof value === 'string') {
      return '\'' + value + '\'';
    } else {
      throw Error('\'value\' is not a string');
    }
  }
}