export default {
  name: 'email',
  table: 'emails',
  properties: {
    id: {
      column: 'email_id',
      type: 'integer',
      primaryKey: true,
    },
    userId: {
      column: 'user_id',
      type: 'integer',
    },
    email: {
      column: 'email_address',
      type: 'text',
    },
  },
};