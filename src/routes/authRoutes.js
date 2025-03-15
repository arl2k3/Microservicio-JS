const express = require("express");
const { registerUser, loginUser, requestPasswordReset, resetPassword } = require("../controllers/authController");
const {  } = require("../util/validationSchema");

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
 *         description: Datos inv�lidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesi�n de usuario
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
 *         description: Inicio de sesi�n exitoso
 *       401:
 *         description: Credenciales inv�lidas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/request-password-reset:
 *   post:
 *     summary: Solicitar un restablecimiento de contrase�a
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
 *         description: Se envi� una nueva contrase�a temporal al correo
 *       400:
 *         description: Email inv�lido
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
 *     summary: Restablecer la contrase�a de un usuario
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
 *         description: Contrase�a restablecida exitosamente
 *       400:
 *         description: Datos inv�lidos
 *       401:
 *         description: Contrase�a actual incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/reset-password/:email", resetPassword);

module.exports = router;