import select from './select';
import update from './update';
import where from './where';
import returning from './returning';

export default function() {
  select();
  update();
  where();
  returning();
}