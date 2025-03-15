const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const { malformedJsonHandler, notFoundHandler, errorHandler } = require("./src/util/errorHandler");
const setupSwagger = require("./src/config/swaggerConfig");
const path = require("path");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ?? Configurar EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views")); // Asegura que busque en ./src/views

// ?? Servir la vista de login en una ruta específica
app.get("/login", (req, res) => {
  res.render("login"); // Renderiza login.ejs
});

setupSwagger(app, PORT); // Habilitar Swagger
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use(malformedJsonHandler);
app.use(notFoundHandler);
app.use(errorHandler);
//cambiar de lugar


const server = app.listen(PORT, () => {
  console.log(`Users Service running on port ${PORT}`);
});

// Cerrar Prisma correctamente
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database disconnected.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
