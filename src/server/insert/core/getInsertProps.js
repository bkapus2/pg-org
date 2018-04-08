export default function getInsertProps(propModels) {
  const props = [];
  for (var prop in propModels) {
    var propModel = propModels[prop];
    if (!propModel.primaryKey) {
      props.push(prop);
    }
  }
  return props;
}