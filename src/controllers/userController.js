const userService = require("../services/userService");

const { hashPassword } = require("../util/helper");
const { sendRecoveryEmail } = require("../services/emailService");
const crypto = require('crypto');

const registerUser = async (req, res) => {
  try {
    const { user, email, password, recovery_email } = req.body;

    const hashedPassword = await hashPassword(password);

    const newUser = await userService.createUser(user, email, hashedPassword, recovery_email);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
};

const getUser = async (req, res) => {
  try {
    const { user } = req.params;
    const foundUser = await userService.getUserByUsername(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(foundUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user } = req.params;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(user, updateData);
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user } = req.params;
    await userService.deleteUser(user);
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const { comparePassword } = require("../util/helper");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "Invalid password" });

    return res.json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in" });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar usuario en la base de datos
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generar una nueva contraseña temporal
    const tempPassword = crypto.randomBytes(4).toString("hex"); // Genera una contraseña segura de 8 caracteres
    const hashedPassword = await hashPassword(tempPassword); // Hashear la contraseña

    // Guardar la nueva contraseña en la base de datos
    await userService.updateUser(user.id, { password: hashedPassword });

    // Enviar el correo con la nueva contraseña
    const emailContent = `
      <p>Tu nueva contrasena temporal es: <strong>${tempPassword}</strong></p>
      <p>Por favor, inicia sesión y cambia tu contrasena.</p>
    `;
    await sendRecoveryEmail(email, emailContent);

    return res.json({ message: "Temporary password sent to email" });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    return res.status(500).json({ message: "Error sending recovery email" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email } = req.params;  
    const { currentPassword, newPassword } = req.body;  

    // Buscar al usuario por su email
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verificar si la contraseña actual es correcta
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar la contraseña en la base de datos
    await userService.updateUser(user.id, { password: hashedPassword });

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Error resetting password" });
  }
};


module.exports = { registerUser, getUser, updateUser, deleteUser, loginUser, requestPasswordReset,resetPassword  };
