import updateModel from './updateModel';
import insertMany from './insert';
import selectMany from './select';

function validateModel(model) {

}

function updateMany(model) {
  return function () {
    return new Promise((resolve, reject) => {

    });
  }
}

function deleteMany(model) {
  return function () {
    return new Promise((resolve, reject) => {
      
    });
  }
}

export default function table(_model, queryHandler, relatedTables = {}) {
  validateModel(_model);
  const model = updateModel(_model, relatedTables);
  return Object.freeze({
    insert: insertMany(model, queryHandler),
    select: selectMany(model, queryHandler),
    update: updateMany(model, queryHandler),
    delete: deleteMany(model, queryHandler),
  })
}