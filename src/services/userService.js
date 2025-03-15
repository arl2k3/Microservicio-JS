const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const { userSchema } = require('../util/validationSchema');
const { OK } = require('zod');
const prisma = new PrismaClient();

async function createUser(userData) {
  const validation = userSchema.safeParse(userData);
  if (!validation.success) {
    throw new Error("Invalid user data: " + JSON.stringify(validation.error.errors));
  }

  try {
    const user = await prisma.user.create({
      data: {
        user: userData.user,
        email: userData.email,
        password: userData.password, // Debe venir ya hasheada
        recovery_email: userData.recovery_email || null,
      },
    });
    return user;
  } catch (error) {
    throw new Error("Error al crear el usuario: " + error.message);
  }
}


// Obtener todos los usuarios
async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    throw new Error('Error al obtener los usuarios: ' + error.message);
  }
}

// Obtener un usuario por email
async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
}

// Actualizar un usuario por email
async function updateUser(email, updatedData) {
  try {
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Si existe, proceder con la actualización
    const user = await prisma.user.update({
      where: { email },
      data: updatedData,
    });

    return user;
  } catch (error) {
    throw new Error("Error al actualizar el usuario: " + error.message);
  }
}




async function patchUser(email, data) {
  try {
    const user = await prisma.user.updateMany({
      where: {
        email: email,
      },
      data: data,
    });
    return OK;
    ;
  } catch (error) {
    throw new Error('Error al actualizar el usuario: ' + error.message);
  }
  
}

// Eliminar un usuario por email
async function deleteUser(email) {
  try {
    const user = await prisma.user.delete({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    throw new Error('Error al eliminar el usuario: ' + error.message);
  }
}

async function getUserByUsername(username) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user: username, // Busca por el campo 'user' (nombre de usuario)
      },
    });
    return user;
  } catch (error) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUserByUsername,
  patchUser
};
