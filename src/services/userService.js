const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async (user, email, password, recovery_email) => {
  try {
    return await prisma.user.create({
      data: { user, email, password, recovery_email },
    });
  } catch (error) {
    throw new Error("Error creating user");
  }
};

const getUserByUsername = async (user) => {
  try {
    return await prisma.user.findUnique({
      where: { user },
    });
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

const updateUser = async (user, data) => {
  try {
    return await prisma.user.update({
      where: { user },
      data,
    });
  } catch (error) {
    throw new Error("Error updating user");
  }
};

const deleteUser = async (user) => {
  try {
    return await prisma.user.delete({
      where: { user },
    });
  } catch (error) {
    throw new Error("Error deleting user");
  }
};

module.exports = { createUser, getUserByUsername, updateUser, deleteUser };
