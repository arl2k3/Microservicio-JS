const userService = require("../services/userService");

const registerUser = async (req, res) => {
  try {
    const { user, email, password, recovery_email } = req.body;

    if (!user || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await userService.getUserByUsername(user);
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const newUser = await userService.createUser(user, email, password, recovery_email);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

module.exports = { registerUser, getUser, updateUser, deleteUser };
