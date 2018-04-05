export default {
  name: 'note',
  tableName: 'notes',
  properties: {
    id: {
      column: 'note_id',
      type: 'integer',
      primaryKey: true,
    },
    userId: {
      column: 'user_id',
      type: 'integer',
    },
    title: {
      column: 'title',
      type: 'text',
    },
    body: {
      column: 'body',
      type: 'text',
    },
  },
};