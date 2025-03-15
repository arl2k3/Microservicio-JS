const { z } = require("zod");


// Esquema de validación de usuario con Zod
const userSchema = z.object({
    user: z.string().min(6, "Username must be at least 6 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(10, "Password must be at least 10 characters"),
  });
  
  // Esquema para cambiar contraseña
  const passwordSchema = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 10 characters"),
    newPassword: z.string().min(10, "New password must be at least 10 characters"),
  });

module.exports = { userSchema, passwordSchema };