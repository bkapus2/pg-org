'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var whereResolver = _interopDefault(require('@/server/whereResolver'));
require('@/server/core/statements/updateStatement');

class ResultsTable {
  constructor({ name, columns, rows }) {
    this.name = name;
    this.columns = columns;
    this.rows = rows;
  }

  getCol(name) {
    const index = this.columns.indexOf(name);
    if (index === -1) {
      throw Error('column name does not exist');
    }
    const colValues = [];
    for (var row of this.rows) {
      colValues.push(row[index]);
    }
    return colValues;
  }

  toObjects() {
    const columns = this.columns;
    const columnsLen = columns.length;
    const objects = [];
    for (var row of this.rows) {
      var object = {};
      for (var iCol = 0; iCol < columnsLen; iCol++) {
        var prop = columns[iCol];
        object[prop] = row[iCol];
      }
      objects.push(object);
    }
    return objects;
  }

  get rowCount() {
    return this.rows.length;
  }
}

function updateModel(userDefinedModel, relatedTables) {
  const {
    name,
    tableName,
    properties: userDefinedProperties,
    relations: userDefinedRelations = {},
  } = userDefinedModel;

  const relations = Object.entries(userDefinedRelations)
    .reduce((relations, [relationName, relationModel]) => {
      const { join } = relationModel;
      const table = relatedTables[relationName];
      if (!table) {
        throw Error(`related table '${relationName}' not passed to '${name}' model initializer`);
      }
      const joinMap = Object.entries(join);
      relations[relationName] = Object.assign({}, relationModel, {
        table,
        joinMap, 
      });
      return relations;
    }, {});

  const columnProperties = Object.entries(userDefinedProperties)
    .map(([prop, {column}]) => [column, prop]);

  const columnPropHash = columnProperties.reduce((hash, [col, prop]) => {
    hash[col] = prop;
    return hash;
  }, {});

  const propColumnHash = columnProperties.reduce((hash, [col, prop]) => {
    hash[prop] = col;
    return hash;
  }, {});

  function objectMap({ rows, fields }) {
    console.time('array to object map');
    const props = fields.map(field => columnPropHash[field.name]);
    const entities = [];
    for (var row of rows) {
      var entity = {};
      for (var propIndex in props) {
        var prop = props[propIndex];
        entity[prop] = row[propIndex];
      }
      entities.push(entity);
    }
    console.timeEnd('array to object map');
    return entities;
  }

  function arrayMap({ rows, fields }) {
    return new ResultsTable({
      name,
      columns: fields.map(({name}) => columnPropHash[name]),
      rows,
    });
  }

  function mapPropsToColumns(props) {
    return props.map(prop => {
      const col = propColumnHash[prop];
      if (!col) {
        throw Error(`Property '${prop}' does not exist for ${name}`);
      }
      return col;
    });
  }

  return {
    name,
    tableName,
    properties: userDefinedProperties,
    relations,
    objectMap,
    arrayMap,
    mapPropsToColumns,
  };
}

function getInsertProps(propModels) {
  const props = [];
  for (var prop in propModels) {
    var propModel = propModels[prop];
    if (!propModel.primaryKey) {
      props.push(prop);
    }
  }
  return props;
}

function isNullOrUndefined(value) {
  return value === null || value === undefined;
}

function text(value, model) {
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

function integer(value, model) {
  if (isNullOrUndefined(value)) {
    if (model.defaultValue) {
      return model.defaultValue;
    } else {
      return 'NULL';
    }
  } else {
    if (Number.isInteger(value)) {
      return value;
    } else {
      throw Error('\'value\' is not a number');
    }
  }
}

const converters = {
  text,
  integer,
  default() {
    throw Error('unsupported type');
  },
};

function getInsertValues(propModels, props, entities) {
  var rows = [];
  for (var entity of entities) {
    var row = [];
    for (var prop of props) {
      var propModel = propModels[prop];
      row.push(converters[propModel.type](entity[prop], propModel));
    }
    rows.push(row);
  }
  return rows;
}

function getInsertColumns(propModels, props) {
  const columns = [];
  for (var prop of props) {
    columns.push(propModels[prop].column);
  }
  return columns;
}

function getReturnProps(properties) {
  const returnProps = Object.values(properties).map(({column}) => column);
  return returnProps;
}

function insertProperties({ model, entities, queryHandler }) {
  if (!entities.length) {
    return Promise.resolve([]);
  }
  const { tableName, properties: propModels, objectMap } = model;
  return new Promise((resolve, reject) => {
    const insertProps = getInsertProps(propModels);
    const insertValues = getInsertValues(propModels, insertProps, entities);
    const insertColumns = getInsertColumns(propModels, insertProps);
    const returnColumns = getReturnProps(propModels);
    const text = `
      INSERT INTO ${tableName} (${insertColumns.join(', ')})
      VALUES ${insertValues.map(row => '(' + row.join(', ') + ')').join(', ')}
      RETURNING ${returnColumns.join(', ')};`;
    console.log(text);
    queryHandler({ text, rowMode: 'array' })
      .then(objectMap)
      .then(resolve)
      .catch(reject);
  });
}

function getEntityOneToManyRelations(entities, key) {
  const relationsArray = [];
  for (var entity of entities) {
    relationsArray.push(entity[key] || []);
  }
  return relationsArray;
}

function mergeOneToManyRelations(parentEntities, key, joinMap, childEntities) {
  const childEntitiesClone = childEntities.slice();

  function canJoin(parentEntity, childEntity) {
    for (var [parentProp, childProp] of joinMap) {
      if (parentEntity[parentProp] !== childEntity[childProp]) {
        return false;
      }
    }
    return true;
  }

  var childEntity = childEntitiesClone.shift();
  for (var parentEntity of parentEntities) {
    const children = parentEntity[key] = [];
    while (childEntity && canJoin(parentEntity, childEntity)) {
      children.push(childEntity);
      childEntity = childEntitiesClone.shift();
    }
  }

  return parentEntities;
}

function joinEntities(parentEntities, joinMap, relatedEntities) {
  const updatedEntities = [];
  const length = parentEntities.length;
  for (var i = 0; i < length; i++) {
    const parentEntity = parentEntities[i];
    const childEntities = relatedEntities[i]; 

    const join = {};
    for (var [rootProp, childProp] of joinMap) {
      join[childProp] = parentEntity[rootProp];
    }

    for (var childEntity of childEntities) {
      updatedEntities.push(Object.assign({}, childEntity, join));
    }
  }

  return updatedEntities;
}

const pickTypeHandler = {
  'one-to-many': getEntityOneToManyRelations,
  default: function() {
    throw Error('Unsupported relation type');
  },
};

const mergeTypeHandler = {
  'one-to-many': mergeOneToManyRelations,
};

function insertRelations({ relations, entities }) {
  return function(rootEntities) {
    return new Promise((resolve, reject) => {
      const promises = Object.entries(relations).map(([relationKey, relationModel]) => {
        const { joinMap, type, table } = relationModel;
        const relatedEntities = pickTypeHandler[type](entities, relationKey);
        // not sure if this is necessary here
        if (relatedEntities.length !== rootEntities.length) {
          throw Error('entity roots does not match the number of input entities');
        }
        const childEntities = joinEntities(rootEntities, joinMap, relatedEntities);
        return table.insert(childEntities)
          .then(childEntities => mergeTypeHandler[type](rootEntities, relationKey, joinMap, childEntities));
      });
      return Promise.all(promises).then(() => resolve(rootEntities)).catch(reject);
    });
  };
}

function insertMany(model, queryHandler) {
  const { relations } = model;
  return function (entities) {
    return new Promise((resolve, reject) => {
      insertProperties({ model, entities, queryHandler })
        .then(insertRelations({ relations, entities }))
        .then(resolve)
        .catch(reject);
    });
  };
}

function mapSelectProps(selectProps, properties) {
  return selectProps.map(prop => properties[prop].column);
}

function getSelectProps(properties) {
  const returnProps = Object.values(properties).map(({column}) => column);
  return returnProps;
}

function parseOptions(options = {}) {
  const {
    mode = 'object',
    distinct = false,
  } = options;
  return {
    mode,
    distinct,
  };
}

function parseSelectArgs({ args, model }) {
  const { properties } = model;
  if (Array.isArray(args[0])) {
    const select = mapSelectProps(args[0], properties);
    const where = args[1];
    const options = parseOptions(args[2]);
    return [select, where, options];
  } else {
    const select = getSelectProps(properties);
    const where = args[0];
    const options = parseOptions(args[1]);
    return [select, where, options];
  }
}

// import whereStatement from './../core/statements/whereStatement';

function selectProperties({ query, model, queryHandler, selectProps, options }) {
  const { mode, distinct } = options;
  const { tableName, objectMap, arrayMap } = model;
  return new Promise((resolve, reject) => {
    whereResolver(model, query)
      .then((where) => {
        const text = `
          SELECT${distinct ? ' DISTINCT' : '' } ${selectProps.join(', ')}
          FROM ${tableName}
          ${ where ? 'WHERE ' + where : '' };`;
    
        function mapResults(results) {
          if (mode === 'object') {
            return objectMap(results);
          } else {
            return arrayMap(results);
          }
        }
    
        return queryHandler({ text, rowMode: 'array' })
          .then(mapResults)
          .then(resolve);
      })
      .catch(reject);
  });
}

// import joinTable from '@/utils/joinTables';

function oneToManySingleKeyJoin({ parents, relationKey, relationModel }) {
  const { joinMap, table } = relationModel;
  const [parentKey, childKey] = joinMap[0];
  const ids = parents.map(entity => entity[parentKey]);
  return table.select({ [childKey]: { $in:ids }})
    .then(children => {
      console.time(relationKey +' join time');
      const hash = {};

      parents.forEach(parent => {
        parent[relationKey] = [];
        hash[parent[parentKey]] = parent;
      });

      children.forEach(child => {
        hash[child[childKey]][relationKey].push(child);
      });

      // joinTable({
      //   parents,
      //   children,
      //   joinMap,
      //   joinRows(parent, child) {
      //     // parent[relationKey].push(child);
      //   }
      // });

      console.timeEnd(relationKey + ' join time');
    });
}

function selectRelations({ model, parents }) {
  if (parents.length === 0) {
    return Promise.resolve(parents);
  }
  return new Promise((resolve, reject) => {
    const { relations } = model;
    const promises = Object.entries(relations).map(([relationKey, relationModel]) => {
      const { type, joinMap } = relationModel;
      if (type === 'one-to-many') {
        if (joinMap.length === 1) {
          return oneToManySingleKeyJoin({ parents, relationKey, relationModel });
        } else {
          throw Error('todo: implement multi key joins');
        }
      } else {
        throw Error('Unsupported relation type');
      }
    });

    Promise.all(promises)
      .then(() => resolve(parents))
      .catch(reject);
  });
}

function selectMany(model, queryHandler) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const [ selectProps, where, options ] = parseSelectArgs({ args, model });
      selectProperties({ selectProps, query: where, model, queryHandler, options })
        .then(rootEntities => selectRelations({ model, parents: rootEntities }))
        .then(resolve)
        .catch(reject);
    });
  };
}

function updateMany(model) {
  return function (where, update, queryHandler) {
    return new Promise((resolve, reject) => {
      whereResolver(model, where)
        .then(console.log)
        .then(resolve)
        .catch(reject);
    });
  };
}

function deleteMany() {
  return function () {
    return new Promise(() => {
      
    });
  };
}

function table(_model, queryHandler, relatedTables = {}) {
  const model = updateModel(_model, relatedTables);
  return Object.freeze({
    get name() { return model.name; },
    insert: insertMany(model, queryHandler),
    select: selectMany(model, queryHandler),
    update: updateMany(model, queryHandler),
    delete: deleteMany(model, queryHandler),
  });
}

module.exports = table;