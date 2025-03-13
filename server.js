require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const userRoutes = require("./src/routes/userRoutes");
const { errorHandler, notFoundHandler, malformedJsonHandler } = require("./src/util/errorHandler");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(malformedJsonHandler); // Captura JSON mal formateados
app.use(notFoundHandler); // Captura rutas inexistentes
app.use(errorHandler); // Maneja errores generales

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4000;

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
