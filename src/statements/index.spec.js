import insertSpec from './insert.spec';
import selectSpec from './select.spec';
import updateSpec from './update.spec';
import deleteSpec from './delete.spec';

export default function() {
  insertSpec();
  selectSpec();
  updateSpec();
  deleteSpec();
}