import Table from './../classes/Table';

export default function(userDefinedModel, relatedCollections) {
  const {
    name,
    tableName,
    properties: userDefinedProperties,
    relations: userDefinedRelations = {},
  } = userDefinedModel;

  const relations = Object.entries(userDefinedRelations)
    .reduce((relations, [relationName, relationModel]) => {
      const { join } = relationModel;
      const collection = relatedCollections[relationName];
      if (!collection) {
        throw Error(`related collection '${relationName}' not passed to '${name}' model initializer`);
      }
      const joinMap = Object.entries(join);
      relations[relationName] = Object.assign({}, relationModel, {
        collection,
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
    return new Table({
      name,
      columns: fields.map(({name}) => columnPropHash[name]),
      rows,
    });
  }

  return {
    name,
    tableName,
    properties: userDefinedProperties,
    relations,
    objectMap,
    arrayMap,
  };
}