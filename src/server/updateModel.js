function relationsReducer() {
  relations.relationName;
}

export default function(userDefinedModel, relatedTables) {
  const {
    name,
    table,
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

  function mapResults({ rows, fields }) {
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

  return {
    name,
    table,
    properties: userDefinedProperties,
    relations,
    mapResults,
  };
}