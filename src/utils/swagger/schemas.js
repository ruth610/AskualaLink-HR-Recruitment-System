export const schemas = {
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
        format: 'password',
      },
    },
  },

  CreateUser: {
    type: 'object',
    required: ['fullName', 'email', 'password'],
    properties: {
      fullName: {
        type: 'string',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
        format: 'password',
      },
      role: {
        type: 'string',
        enum: ['ADMIN', 'HR', 'STAFF'],
      },
    },
  },
};
