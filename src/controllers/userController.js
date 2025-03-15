const userService = require("../services/userService");

const { hashPassword, comparePassword } = require("../util/helper");
const { sendRecoveryEmail } = require("../services/emailService");
const { userSchema, passwordSchema, responseSchema } = require("../util/validationSchema");

const getUser = async (req, res) => {
  try {
    const { user } = req.params;
    const foundUser = await userService.getUserByUsername(user);
    if (!foundUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        response: []
      });
    }
    return res.json({
      status: 200,
      message: "User found successfully",
      response: foundUser
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      response: []
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user } = req.params;
    const validation = userSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        status: 400,
        message: "Invalid data",
        
      });
    }

    const { password } = req.body;

    if (password) {
      req.body.password = await hashPassword(password);
    }

    const updatedUser = await userService.updateUser(user, req.body);

    return res.json({
      status: 200,
      message: "User updated successfully",
      response: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      response: []
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user } = req.params;
    await userService.deleteUser(user);
    return res.json({
      status: 200,
      message: "User deleted successfully",
      response: []
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      response: []
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No users found",
        response: []
      });
    }

    return res.json({
      status: 200,
      message: "Users fetched successfully",
      response: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      response: []
    });
  }
};

const patchUser = async (req, res) => {
  try {
    const { user } = req.params;
    const validation = userSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        status: 400,
        message: "Invalid data",
        
      });
    }

    const updatedUser = await userService.patchUser(user, req.body);

    return res.json({
      status: 200,
      message: "User patched successfully",
      response: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      response: []
    });
  }
};



module.exports = {  getUser, updateUser, deleteUser,getAllUsers,patchUser };
