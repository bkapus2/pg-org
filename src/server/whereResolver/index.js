import text from '@/server/convert/text';
import integer from '@/server/convert/integer';

const typeConverters = {
  text,
  integer,
};

const typeHandlers = {
  text(model, prop, value) {
    const { properties } = model;
    const propModel = properties[prop];
    if (value === null) {
      const { column } = propModel;
      return `${ column } IS NULL`;
    } else if (typeof value === 'object') { 
      return resolveComparisonOperators(model, prop, value);
    } else {
      const { column } = propModel;
      return `${ column } = ${ text(value) }`;
    }
  },
  integer(model, prop, value) {
    const { properties } = model;
    const propModel = properties[prop];
    if (value === null) {
      const { column } = propModel;
      return `${ column } IS NULL`;
    } else if (typeof value === 'object') { 
      return resolveComparisonOperators(model, prop, value);
    } else {
      const { column } = propModel;
      return `${ column } = ${ integer(value) }`;
    }
  },
};

function resolveComparisonOperators(model, prop, value) {
  return Object.entries(value).map(([operator, value]) => {
    if (!(operator in comparisonOperators)) {
      throw Error(`'${operator}' is not a valid operator for '${prop}'`);
    }
    return comparisonOperators[operator](model, prop, value);
  }).join(' AND ');
}

const comparableTypes = ['integer'];
function canCompare(type) {
  return comparableTypes.includes(type);
}

const comparisonOperators = {
  $equals(model, prop, value) {
    const { column, type } = model.properties[prop];
    if (value === null) {
      return `${column} IS NULL`;
    } else {
      const converter = typeConverters[type];
      return `${column} = ${converter(value)}`;
    }
  },

  $greaterThan(model, prop, value) {
    const { column, type } = model.properties[prop];
    if (!canCompare(type)) {
      throw Error(`cannot use $greaterThan on type '${type}'`);
    }
    const convert = typeConverters[type];
    return `${column} > ${convert(value)}`;
  },

  $greaterThanOrEqual(model, prop, value) {
    const { column, type } = model.properties[prop];
    if (!canCompare(type)) {
      throw Error(`cannot use $greaterThanOrEqual on type '${type}'`);
    }
    const convert = typeConverters[type];
    return `${column} >= ${convert(value)}`;
  },

  $in(model, prop, values) {
    if (!Array.isArray(values)) {
      throw Error(`expected array for ${prop} $in operator`);
    }
    const notNullValues = values.filter(val => val !== null && val !== '');
    const containsNull = values.length !== notNullValues.length;
    const { column, type } = model.properties[prop];
    const typeConverter = typeConverters[type];
    if (containsNull) {
      return `( ${column} IS NULL OR ${column} IN (${notNullValues.map(typeConverter).join(',')}) )`;
    } else {
      return `${column} IN (${notNullValues.map(typeConverter).join(',')})`;
    }
  },

  $lessThan(model, prop, value) {
    const { column, type } = model.properties[prop];
    if (!canCompare(type)) {
      throw Error(`cannot use $lessThan on type '${type}'`);
    }
    const convert = typeConverters[type];
    return `${column} < ${convert(value)}`;
  },

  $lessThanOrEqual(model, prop, value) {
    const { column, type } = model.properties[prop];
    if (!canCompare(type)) {
      throw Error(`cannot use $lessThanOrEqual on type '${type}'`);
    }
    const convert = typeConverters[type];
    return `${column} <= ${convert(value)}`;
  },

  $notEquals(model, prop, value) {
    const { column, type } = model.properties[prop];
    if (value === null) {
      return `${column} IS NOT NULL`;
    } else {
      const converter = typeConverters[type];
      return `${column} != ${converter(value)}`;
    }
  },

  $notIn(model, prop, values) {
    if (!Array.isArray(values)) {
      throw Error(`expected array for ${prop} $notIn operator`);
    }
    const notNullValues = values.filter(val => val !== null);
    const containsNull = values.length !== notNullValues.length;
    const { column, type } = model.properties[prop];
    const typeConverter = typeConverters[type];
    if (containsNull) {
      return `( ${column} IS NOT NULL AND ${column} NOT IN (${notNullValues.map(typeConverter).join(',')}) )`;
    } else {
      return `${column} NOT IN (${notNullValues.map(typeConverter).join(',')})`;
    }
  },
};

const booleanOperators = {
  $or(model, queries) {
    return new Promise((resolve, reject) => {
      Promise.all(queries.map(query => resolveWhere(model, query)))
        .then(queryTexts => queryTexts.map(text => `( ${text} )`).join(' OR '))
        .then(query => `( ${query} )`)
        .then(resolve)
        .catch(reject);
    });
  },
};

function mapResults(model, relationProp) {
  const { relations } = model;
  const { joinMap } = relations[relationProp]; // todo: use joinMap
  return function(results) {
    if (results.rowCount === 0) {
      return 'FALSE';
    } else if (joinMap.length === 1) {
      const [[parentProp, childProp]] = joinMap;
      return resolveWhere(model, { [parentProp]: { $in: results.getCol(childProp) } });
    } else {

    }
  };
}

function resolveWhere(model, where) {
  const { properties, relations } = model;
  return new Promise((resolve, reject) => {
    const queryPartPromises = [];
    Object.entries(where).forEach(([key, value]) => {
      if (key in booleanOperators) {
        queryPartPromises.push(booleanOperators[key](model, value));
      }
      
      else if (key in properties) {
        const propModel = properties[key];
        queryPartPromises.push(typeHandlers[propModel.type](model, key, value));
      }
      
      else if (key in relations) {
        const { table, join } = relations[key];
        const selectProps = Object.values(join);
        const queryPartPromise = table.select(selectProps, value, { mode: 'array' })
          .then(mapResults(model, key));
        queryPartPromises.push(queryPartPromise);
      }
      
      else {
        throw Error(`Cannot resolve where for key '${key}'`);
      }
    });
    return Promise.all(queryPartPromises)
      .then(queryParts => queryParts.join(' AND '))
      .then(resolve)
      .catch(reject);
  });
}

export default function getWhereStatement(model, where) {
  return new Promise((resolve, reject) => {
    return resolveWhere(model, where)
      .then(resolve)
      .catch(reject);
  });
}