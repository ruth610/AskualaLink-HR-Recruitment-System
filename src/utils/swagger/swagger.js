import swaggerJSDoc from 'swagger-jsdoc';
import {schemas} from './schemas.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AskualaLink HR Recruitment API',
      version: '1.0.0',
      description: 'Backend API documentation for HR Recruitment System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
    schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
  ],
};

export default swaggerJSDoc(options);
