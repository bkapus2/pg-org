import getHasher from './hasher';

const JOIN_STRING = '.';

function joinMapper(joinMapItem) {
  return [joinMapItem[0], joinMapItem[1], getHasher({ omit: [JOIN_STRING] })];
}

export default function joinTables(options) {
  const {
    parents,
    children,
    joinMap,
    joinRows,
  } = options;

  const joins = joinMap.map(joinMapper);
  const parentHash = new Map();

  console.time('creating hashes');
  for (var parent of parents) {
    const hashedValues = [];
    for (var join of joins) {
      const parentKey = join[0];
      const hasher = join[2];
      hashedValues.push(hasher(parent[parentKey]));
    }
    const hashKey = hashedValues.join(JOIN_STRING);
    if (parentHash.has(hashKey)) {
      throw Error('parents are not unique');
    }
    parentHash.set(hashKey, parent);
  }
  console.timeEnd('creating hashes');

  console.time('linking rows');
  for (var child of children) {
    const hashedValues = [];
    for (var join of joins) {
      const childKey = join[1];
      const hasher = join[2];
      hashedValues.push(hasher(child[childKey]));
    }
    const hashKey = hashedValues.join(JOIN_STRING);
    const parent = parentHash.get(hashKey);
    joinRows(parent, child);
  }
  console.timeEnd('linking rows');
}