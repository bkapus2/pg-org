import insert from './insert';
import select from './select';
import update from './update';
import del from './delete';
import where from './where';
import returning from './returning';

export default function() {
  insert();
  select();
  update();
  del();
  where();
  returning();
}