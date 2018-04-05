import updateModel from './updateModel';
import insertMany from './insert';
import selectMany from './select';
import updateMany from './update';

function validateModel(model) {

}

function deleteMany(model) {
  return function () {
    return new Promise((resolve, reject) => {
      
    });
  };
}

export default function table(_model, queryHandler, relatedTables = {}) {
  validateModel(_model);
  const model = updateModel(_model, relatedTables);
  return Object.freeze({
    get name() { return model.name; },
    insert: insertMany(model, queryHandler),
    select: selectMany(model, queryHandler),
    update: updateMany(model, queryHandler),
    delete: deleteMany(model, queryHandler),
  });
}