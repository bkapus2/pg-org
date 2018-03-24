export default function getEntityOneToManyRelations(entities, key) {
  const relationsArray = [];
  for (var entity of entities) {
    relationsArray.push(entity[key] || []);
  }
  return relationsArray;
}