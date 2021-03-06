import {
  text, integer, date, timestamp,
} from '../convert/queryTypes';

const typeHandlers = {
  text(arg, propModel) {
    const { column } = propModel;
    if (arg === null) {
      return `${ column } IS NULL`;
    } else if (Array.isArray(arg)) {
      if (arg.includes(null)) {
        throw Error('Cannot use null');
      }
      return `${ column } IN(${arg.map(text).join(', ')})`;
    } else {
      return `${ column } = ${ text(arg) }`;
    }
  },
  integer(arg, propModel) {
    const { column } = propModel;
    if (arg === null) {
      return `${ column } IS NULL`;
    } else if (Array.isArray(arg)) {
      if (arg.includes(null)) {
        throw Error('Cannot use null');
      }
      return `${ column } IN(${arg.map(integer).join(', ')})`;
    } else {
      return `${ column } = ${ integer(arg) }`;
    }
  },
  date(arg, propModel) {
    const { column } = propModel;
    if (arg === null) {
      return `${ column } IS NULL`;
    } else if (Array.isArray(arg)) {
      if (arg.includes(null)) {
        throw Error('Cannot use null');
      }
      return `${ column } IN(${arg.map(date).join(', ')})`;
    } else {
      return `${ column } = ${ date(arg) }`;
    }
  },
  timestamp(arg, propModel) {
    const { column } = propModel;
    if (arg === null) {
      return `${ column } IS NULL`;
    } else if (Array.isArray(arg)) {
      if (arg.includes(null)) {
        throw Error('Cannot use null');
      }
      return `${ column } IN(${arg.map(timestamp).join(', ')})`;
    } else {
      return `${ column } = ${ timestamp(arg) }`;
    }
  },
};

function notEmpty(item) {
  return Boolean(Object.keys(item).length);
}

function queryMapper(properties) {
  return function mapper(query) {
    const subqueries = [];
    for (var key in query) {
      const arg = query[key];
      const propModel = properties[key];
      if (!propModel) {
        throw Error(`Property ${key} does not exist.`);
      }
      subqueries.push(typeHandlers[propModel.type](arg, propModel));
    }
    return '(' + subqueries.join(' AND ') + ')';
  };
}

export default function getWhereStatement(queries, properties) {
  return queries
    .filter(notEmpty)
    .map(queryMapper(properties))
    .join(' AND ');
}