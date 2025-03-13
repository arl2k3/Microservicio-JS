const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuarios",
      version: "1.0.0",
      description: "Documentación de la API de gestión de usuarios con autenticación",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Rutas donde están los endpoints
};

const swaggerSpecs = swaggerJSDoc(options);

const setupSwagger = (app, PORT) => {
  // Ruta para servir el JSON de Swagger
  app.get("/api-docs-json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecs);
  });

  // Ruta para la interfaz de Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  console.log(`Swagger UI disponible en: http://localhost:${PORT}/api/users/api-docs`);
};

module.exports = setupSwagger;
