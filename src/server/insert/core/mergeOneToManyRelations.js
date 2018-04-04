

export default function mergeOneToManyRelations(parentEntities, key, joinMap, childEntities) {
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