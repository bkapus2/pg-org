import isNullOrUndefined from './../utils/isNullOrUndefined';

export default function integer(value, model) {
  if (isNullOrUndefined(value)) {
    if (model.defaultValue) {
      return model.defaultValue;
    } else {
      return 'NULL'
    }
  } else {
    if (Number.isInteger(value)) {
      return value;
    } else {
      throw Error('\'value\' is not a number');
    }
  }
}