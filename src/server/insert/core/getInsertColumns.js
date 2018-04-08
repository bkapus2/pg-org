export default function getInsertColumns(propModels, props) {
  const columns = [];
  for (var prop of props) {
    columns.push(propModels[prop].column);
  }
  return columns;
}