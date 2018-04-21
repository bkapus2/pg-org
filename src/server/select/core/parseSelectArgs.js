import mapSelectProps from './mapSelectProps';
import getSelectProps from './getSelectProps';

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

export default function parseSelectArgs({ args, model }) {
  const { properties } = model;
  if (Array.isArray(args[0])) {
    const select = mapSelectProps(args[0], properties);
    const where = args[1];
    const options = parseOptions(args[2]);
    return [select, where, options];
  } else {
    const select = getSelectProps(properties);
    const where = args[0];
    const options = parseOptions(args[1]);
    return [select, where, options];
  }
}