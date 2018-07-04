import required from '../utils/required';

function $or(statements) {
  return statements.map(statement => '( ' + whereSubClause(statement) + ' )').join('\n\tOR ');
}

function $in(key, values) {
  
}

function conditionReducer(conditions, [key, value]) {
  const type = typeof value;
  if (key === '$or') {
    conditions.push($or(value));
  } else if (value === null) {
    conditions.push(`${key} IS NULL`);
  } else if (value === '') {    
    conditions.push(`${key} IS NULL`);
  } else if (type === 'string') {
    conditions.push(`${key} = '${value}'`);
  } else if (type === 'number') {
    conditions.push(`${key} = ${value}`);
  } else if (value instanceof Date) {
    conditions.push(`${key} = '${value}'`);
  } else if (Array.isArray(value)) {
    throw Error('ToDo: array handling');
  } else {
    throw Error(`Cannot create condition for value '${value}' of type '${type}'`);
  }
  return conditions;
}

function reduceConditions(conditions) {
  return Object.entries(conditions).reduce(conditionReducer, []);
}

function whereSubClause(conditions) {
  return reduceConditions(conditions).join('\n\tAND ');
}

export default function where({conditions=required('conditions')}) {
  return `WHERE\n\t${whereSubClause(conditions)}`;
}