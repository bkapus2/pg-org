export default function getReturnProps(properties) {
  const returnProps = Object.values(properties).map(({column,}) => column);
  return returnProps;
}