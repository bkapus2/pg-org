function relationsReducer() {
  relations.relationName
}

export default function(userDefinedModel, relatedTables) {
  const {
    name,
    table,
    properties: userDefinedProperties,
    relations: userDefinedRelations = {}
  } = userDefinedModel;

  const relations = Object.entries(userDefinedRelations)
    .reduce((relations, [relationName, relationModel]) => {
      const { join } = relationModel;
      const table = relatedTables[relationName];
      if (!table) {
        throw Error(`related table '${relationName}' not passed to '${name}' model initializer`)
      }
      const joinMap = Object.entries(join);
      relations[relationName] = Object.assign({}, relationModel, { table, joinMap });
      return relations;
    }, {});

  const columnProperties = Object.entries(userDefinedProperties)
    .map(([prop, {column}]) => [column, prop]);

  function mapTableRows(tableRows) {
    const entities = [];
    for (var tableRow of tableRows) {
      const entity = {};
      for (var [column, prop] of columnProperties) {
        entity[prop] = tableRow[column];
      }
      entities.push(entity);
    }
    return entities;
  }

  return {
    name,
    table,
    properties: userDefinedProperties,
    relations,
    mapTableRows,
  }
}