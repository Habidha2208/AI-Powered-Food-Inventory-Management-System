
const express = require("express");
const router = express.Router();

const { registerUser,loginUser } = require("../controllers/userController");

// Register API
router.post("/register", registerUser);
router.post("/login", loginUser);
module.exports = router;