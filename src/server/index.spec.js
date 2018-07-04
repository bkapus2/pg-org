import insertSpec from './insert/index.spec';
import blackboxSpec from './blackboxTests/index.spec';

export default function() {
  insertSpec();
  blackboxSpec();
}