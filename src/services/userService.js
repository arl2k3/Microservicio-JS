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
    throw new Error("Error finding user");
  }
};

const updateUser = async (email, updateData) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { email }, // Cambia de `user` a `email` para la búsqueda
      data: updateData,
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
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

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const getAllUsers = async () => {
  try {
    return await prisma.user.findMany(); 
  } catch (error) {
    console.error("Error fetching users from DB:", error);
    throw new Error("Error fetching users");
  }
};

module.exports = { createUser, getUserByUsername, updateUser, deleteUser, getUserByEmail,getAllUsers };
