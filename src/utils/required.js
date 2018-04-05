export default function required(propname) {
  throw Error(`${propname} is a required parameter`);
}