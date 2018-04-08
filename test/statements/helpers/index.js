import insert from './insert';
import select from './select';
import update from './update';
import where from './where';
import returning from './returning';

export default function() {
  insert();
  select();
  update();
  where();
  returning();
}