const express = require("express");
const { registerUser, getUser, updateUser, deleteUser, loginUser, requestPasswordReset, resetPassword, getAllUsers } = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - email
 *               - password
 *             properties:
 *               user:
 *                 type: string
 *                 example: "Usuario123"
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 example: "SuperSecreto123"
 *               recovery_email:
 *                 type: string
 *                 example: "recovery@example.com"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 example: "SuperSecreto123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/{user}:
 *   get:
 *     summary: Obtener información de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *         example: "Usuario123"
 *     responses:
 *       200:
 *         description: Información del usuario encontrada
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:user", getUser);

/**
 * @swagger
 * /api/users/{user}:
 *   put:
 *     summary: Actualizar información de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newemail@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.put("/:user", updateUser);

/**
 * @swagger
 * /api/users/{user}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:user", deleteUser);

/**
 * @swagger
 * /api/users/request-password-reset:
 *   post:
 *     summary: Solicitar un restablecimiento de contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Se envió una nueva contraseña temporal al correo
 *       400:
 *         description: Email inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post("/request-password-reset", requestPasswordReset);

/**
 * @swagger
 * /api/users/reset-password/{email}:
 *   put:
 *     summary: Restablecer la contraseña de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Contraseña actual incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/reset-password/:email", resetPassword);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user:
 *                     type: string
 *                     example: "Usuario123"
 *                   email:
 *                     type: string
 *                     example: "usuario@example.com"
 *                   recovery_email:
 *                     type: string
 *                     example: "recovery@example.com"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-13T12:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-13T12:00:00Z"
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getAllUsers);

module.exports = router;
