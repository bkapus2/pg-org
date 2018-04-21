import parseSelectArgs from './core/parseSelectArgs';
import selectProperties from './selectProperties';
import selectRelations from './selectRelations';

export default function selectMany(model, queryHandler) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const [ selectProps, where, options ] = parseSelectArgs({ args, model });
      selectProperties({ selectProps, query: where, model, queryHandler, options })
        .then(rootEntities => selectRelations({ model, parents: rootEntities }))
        .then(resolve)
        .catch(reject);
    });
  };
}