import insert from './insert.spec';
import select from './select.spec';
import update from './update.spec';
import del from './delete.spec';
import where from './where.spec';
import returning from './returning.spec';

export default function() {
  insert();
  select();
  update();
  del();
  where();
  returning();
}