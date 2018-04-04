import mapSelectProps from './mapSelectProps';
import getSelectProps from './getSelectProps';
import splitQuery from './splitQuery';

function parseOptions(options = {}) {
  const {
    mode = 'object',
    distinct = false,
  } = options;
  return {
    mode,
    distinct,
  };
}

export default function parseSelectArgs({ args, model, }) {
  const { properties, relations, } = model;
  if (Array.isArray(args[0])) {
    const select = mapSelectProps(args[0], properties);
    const [rootQuery, relationsQuery,] = splitQuery(args[1], model);
    const options = parseOptions(args[2]);
    return [select, rootQuery, relationsQuery, options,];
  } else {
    const select = getSelectProps(properties);
    const [rootQuery, relationsQuery,] = splitQuery(args[0], model);
    const options = parseOptions(args[1]);
    return [select, rootQuery, relationsQuery, options,];
  }
}