import _integer from './converters/integer';
import _text from './converters/text';
import _date from './converters/date';
import _timestamp from './converters/timestamp';

function addInsertLogic(fn) {
  return function converter(value) {
    if (value === null) {
      return 'NULL';
    } else if (value === undefined) {
      return 'DEFAULT';
    } else {
      fn(value);
    }
  };
}

export const integer = addInsertLogic(_integer);
export const text = addInsertLogic(_text);
export const date = addInsertLogic(_date);
export const timestamp = addInsertLogic(_timestamp);