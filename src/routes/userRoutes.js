const express = require("express");
const { registerUser, getUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/:user", getUser);
router.put("/:user", updateUser);
router.delete("/:user", deleteUser);

module.exports = router;
