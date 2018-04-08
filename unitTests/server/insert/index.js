// import insert from '@/server/insert';
import insertProperties from './insertProperties';
import insertRelations from './insertRelations';

export default function() {
  insertProperties();
  insertRelations();
}