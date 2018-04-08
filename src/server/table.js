import updateModel from './updateModel';
import insertMany from './insert';
import selectMany from './select';
import updateMany from './update';

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