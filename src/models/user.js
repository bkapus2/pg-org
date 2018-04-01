export default {
  table: 'users',
  properties: {
    id: {
      column: 'user_id',
      type: 'integer',
      primaryKey: true,
    },
    firstName: {
      column: 'first_name',
      type: 'text',
    },
    lastName: {
      column: 'last_name',
      type: 'text',
    },
    username: {
      column: 'username',
      type: 'text'
    }
  },
  relations: {
    emails: {
      type: 'one-to-many',
      join: {
        id: 'userId',
      },
      model: 'email',
    },
  },
};
