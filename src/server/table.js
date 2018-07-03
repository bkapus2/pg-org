import updateModel from './updateModel';
import insertMany from './insert/index';
import selectMany from './select/index';
import updateMany from './update/index';

function deleteMany() {
  return function () {
    return new Promise(() => {
      
    });
  };
}

export default function table(_model, queryHandler, relatedTables = {}) {
  const model = updateModel(_model, relatedTables);
  return Object.freeze({
    get name() { return model.name; },
    insert: insertMany(model, queryHandler),
    select: selectMany(model, queryHandler),
    update: updateMany(model, queryHandler),
    delete: deleteMany(model, queryHandler),
  });
}