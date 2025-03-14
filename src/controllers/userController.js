const userService = require("../services/userService");

const { hashPassword, comparePassword } = require("../util/helper");
const { sendRecoveryEmail } = require("../services/emailService");
const { userSchema, passwordSchema } = require("../util/validationSchema");

const registerUser = async (req, res) => {
  try {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

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
    const validation = userSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { password } = req.body;

    if (password) {
      req.body.password = await hashPassword(password);
    }

    const updatedUser = await userService.updateUser(user, req.body);
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
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tempPassword = Math.random().toString(36).slice(-8); // Generar una contrase�a aleatoria
    const hashedPassword = await hashPassword(tempPassword);

    await userService.updateUser(user.user, { password: hashedPassword });

    const emailContent = `
      <p>Tu nueva contrase�a temporal es: <strong>${tempPassword}</strong></p>
      <p>Por favor, inicia sesi�n y cambia tu contrase�a.</p>
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
    const { email, currentPassword, newPassword } = req.body;
    
    // Buscar al usuario por su email
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verificar si la contrase�a actual es v�lida
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Hashear la nueva contrase�a
    const hashedPassword = await hashPassword(newPassword);
    
    // Actualizar la contrase�a del usuario
    await userService.updateUser(user.email, { password: hashedPassword });

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Error resetting password" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = { registerUser, getUser, updateUser, deleteUser, loginUser, requestPasswordReset,resetPassword,getAllUsers };
