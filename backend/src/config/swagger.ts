import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dam Platform',
      version: '1.0.0',
      description: 'API documentation Digital Asset Management (DAM) Platform',
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Assets', description: 'Asset management endpoints' },
      { name: 'Teams', description: 'Team management endpoints' },
      { name: 'Projects', description: 'Project management endpoints' },
      { name: 'Dashboard', description: 'Dashboard endpoints' },
    ],
    servers: [
      {
        url: '/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/docs/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

export const swaggerUiOptions: SwaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
};
