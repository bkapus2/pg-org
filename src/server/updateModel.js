import ResultsTable from './../classes/ResultsTable';

export default function(userDefinedModel, relatedTables) {
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