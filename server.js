require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const userRoutes = require("./src/routes/userRoutes");
const { errorHandler, notFoundHandler, malformedJsonHandler } = require("./src/util/errorHandler");
const setupSwagger = require("./src/config/swaggerConfig");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
setupSwagger(app, PORT); // Habilitar Swagger
app.use("/api/users", userRoutes);
app.use(malformedJsonHandler); // Captura JSON mal formateados
app.use(notFoundHandler); // Captura rutas inexistentes
app.use(errorHandler); // Maneja errores generales



const server = app.listen(PORT, () => {
  console.log(`Users Service running on port ${PORT}`);
});

// Cerrar Prisma correctamente al detener el servidor
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database disconnected.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
