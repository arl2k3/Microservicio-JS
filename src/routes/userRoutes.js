const express = require("express");
const { uS, patchUser, getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { userSchema } = require("../util/validationSchema");

const router = express.Router();

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

router.patch("/:user", patchUser);
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

module.exports = router;
