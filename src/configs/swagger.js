const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();


const doc = {
    info: {
        version: '0.0.1', // by default: '1.0.0'
        title: 'Shop API', // by default: 'REST API'
        description: 'Scoping App', // by default: ''
    },
    host: `localhost:${process.env.PORT}`,
    basePath: `/api`,
    schemes: ['http'], // by default: ['http']
    consumes: [], // by default: ['application/json']
    produces: [], // by default: ['application/json']
    tags: [
        {
            name: 'Auth',
            description: 'Authentication',
        },
        {
            name: 'Article',
            description: 'articles',
        },
    ],
    definitions: {},
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Provide your Bearer token like this: Bearer <token>',
        },
    },
    security: [
        {
            apiKeyAuth: [],
        },
    ],
};

const outputFile = './swagger.json';
const routes = ['../routes/index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
