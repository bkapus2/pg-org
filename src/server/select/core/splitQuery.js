import operators from './../../core/operators';
const operatorNames = Object.keys(operators);

export default function splitQuery(query, model) {
  const { properties, relations } = model;

  const rootQuery = {};
  const relationsQuery = {};

  for (var key in query) {
    if (properties[key]) {
      rootQuery[key] = query[key];      
    } else if (relations[key]) {
      relationsQuery[key] = query[key];
    } else if (operatorNames.includes(key)) {
      // what do
    } else {
      throw Error(`Unknown property or relation '${key}'.`);
    }
  }

  return [rootQuery, relationsQuery];
}