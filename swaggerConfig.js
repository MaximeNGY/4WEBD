import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Concerts & Tickets",
      version: "1.0.0",
      description: "Documentation concernant les requêtes API REST de ticketing Concert",
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [{ bearerAuth: [] }],
    servers: [
      { url: "http://localhost:5000", description: "Serveur local" }
    ],
  },
  apis: ["./routes/*.js"], // On scanne les fichiers de routes
};

const swaggerSpec = swaggerJsdoc(options);

export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
