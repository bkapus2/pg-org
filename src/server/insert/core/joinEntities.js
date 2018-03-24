export default function joinEntities(rootEntities, joinMap, relatedEntities) {
  const updatedEntities = [];
  const length = rootEntities.length;
  for (var i = 0; i < length; i++) {
    const rootEntity = rootEntities[i];
    const childEntities = relatedEntities[i]; 

    const join = {};
    for (var [rootProp, childProp] of joinMap) {
      join[childProp] = rootEntity[rootProp];
    }

    for (var childEntity of childEntities) {
      updatedEntities.push(Object.assign({}, childEntity, join))
    }
  }

  return updatedEntities;
}