export default function joinEntities(parentEntities, joinMap, relatedEntities) {
  const updatedEntities = [];
  const length = parentEntities.length;
  for (var i = 0; i < length; i++) {
    const parentEntity = parentEntities[i];
    const childEntities = relatedEntities[i]; 

    const join = {};
    for (var [rootProp, childProp,] of joinMap) {
      join[childProp] = parentEntity[rootProp];
    }

    for (var childEntity of childEntities) {
      updatedEntities.push(Object.assign({}, childEntity, join));
    }
  }

  return updatedEntities;
}