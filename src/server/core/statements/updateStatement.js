import required from './../../../utils/required';
import getWhereStatement from './whereStatement';
import text from '../convert/text';
import integer from '../convert/integer';
import date from '../convert/date';
import datetime from '../convert/datetime';

const isEmpty = obj => Object.keys(obj).length === 0;

const typeHandlers = {
  text,
  integer,
  date,
  datetime,
};

function getSetters(update, properties) {
  const setters = Object.entries(update).reduce((setters, [key, value]) => {
    const propModel = properties[key];
    if (!propModel) {
      throw Error(`Unknown property ${key}`);
    }
    const { column, type } = propModel;
    const convert = typeHandlers[type];
    if (!convert) {
      throw Error(`Cannot update type '${type}'`);
    }
    setters.push(`${column}=${typeHandlers[type](value)}`);
    return setters;
  },[]);
  return setters;
}

export default function updateStatement(params, model) {
  const {
    update = required('update'),
    table = required('table'),
    where = null,
    returning = null,
  } = params;

  if (isEmpty(update)) {
    throw Error('Nothing to update');
  }

  const { properties, mapPropsToColumns } = model;

  const statementParts = [];
  statementParts.push(`UPDATE ${table}`);

  const setters = getSetters(update, properties);
  statementParts.push(`SET ${setters.join(', ')}`);

  if (where) {
    statementParts.push(`WHERE ${getWhereStatement([where], properties)}`);
  }

  if (returning) {
    const returnColumns = mapPropsToColumns(returning);
    statementParts.push(`RETURNING ${returnColumns.join(', ')}`);
  }

  return statementParts.join('\n')+';';
}