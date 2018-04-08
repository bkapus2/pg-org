export default function mapSelectProps(selectProps, properties) {
  return selectProps.map(prop => properties[prop].column);
}