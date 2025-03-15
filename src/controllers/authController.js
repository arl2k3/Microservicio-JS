const userService = require("../services/userService");

const { hashPassword, comparePassword } = require("../util/helper");
const { sendRecoveryEmail } = require("../services/emailService");
const { userSchema, passwordSchema, responseSchema } = require("../util/validationSchema");

const registerUser = async (req, res) => {
  try {
    const { user, email, password, recovery_email } = req.body;

    // Validación con Zod
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        status: 400,
        message: "Invalid data",
        response: validation.error.errors, // Devuelve detalles del error
      });
    }

    // Verificar si el usuario o correo ya existen
    if (await userService.getUserByUsername(user)) {
      return res.status(400).json({
        status: 400,
        message: "Username already in use",
        response: [],
      });
    }

    if (await userService.getUserByEmail(email)) {
      return res.status(400).json({
        status: 400,
        message: "Email already in use",
        response: [],
      });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await hashPassword(password);

    // Crear usuario en la base de datos
    const newUser = await userService.createUser({
      user,
      email,
      password: hashedPassword, // Guardar la contraseña hasheada
      recovery_email: recovery_email || null, // Asegurar que sea opcional
    });

    return res.status(201).json({
      status: 201,
      message: "User created successfully",
      response: { email: newUser.email },
    });

  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      response: [],
    });
  }
};


const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user) return res.status(404).json({
        status: 404,
        message: "User not found",
        response: []
      });
  
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) return res.status(401).json({
        status: 401,
        message: "Invalid password",
        response: []
      });
  
      return res.json({
        status: 200,
        message: "Login successful",
        response: user
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Error logging in",
        response: []
      });
    }
  };
  
  const requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      
      // Buscar usuario por email
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
          response: []
        });
      }
  
      // Generar contraseña temporal
      const tempPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await hashPassword(tempPassword);
  
      // Actualizar la contraseña en la base de datos usando el email
      await userService.updateUser(user.email, { password: hashedPassword });
  
      // Enviar el email de recuperación
      const emailContent = `
        <p>Tu nueva contraseña temporal es: <strong>${tempPassword}</strong></p>
        <p>Por favor, inicia sesión y cambia tu contraseña.</p>
      `;
      await sendRecoveryEmail(email, emailContent);
  
      return res.json({
        status: 200,
        message: "Temporary password sent to email",
        response: []
      });
    } catch (error) {
      console.error("Error in requestPasswordReset:", error);
      return res.status(500).json({
        status: 500,
        message: "Error sending recovery email",
        response: []
      });
    }
  };
  
  
  const resetPassword = async (req, res) => {
    try {
      const { email, currentPassword, newPassword } = req.body;
      
      // Buscar al usuario por su email
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
          response: []
        });
      }
  
      // Verificar si la contraseña actual es válida
      const isValidPassword = await comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: 401,
          message: "Invalid current password",
          response: []
        });
      }
  
      // Hashear la nueva contraseña
      const hashedPassword = await hashPassword(newPassword);
      
      // Actualizar la contraseña del usuario
      await userService.updateUser(user.email, { password: hashedPassword });
  
      return res.json({
        status: 200,
        message: "Password updated successfully",
        response: []
      });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return res.status(500).json({
        status: 500,
        message: "Error resetting password",
        response: []
      });
    }
  };

module.exports = { registerUser, loginUser, requestPasswordReset, resetPassword };