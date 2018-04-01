export default function getSelectProps(properties) {
  const returnProps = Object.values(properties).map(({column}) => column);
  return returnProps;
}