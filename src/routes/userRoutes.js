const express = require("express");
const { registerUser, getUser, updateUser, deleteUser, loginUser, requestPasswordReset, resetPassword } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/:user", getUser);
router.put("/:user", updateUser);
router.delete("/:user", deleteUser);
router.post("/login", loginUser);
router.post("/request-password-reset", requestPasswordReset);
router.put("/reset-password/:email", resetPassword);

module.exports = router;
