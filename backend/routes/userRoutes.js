const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateToken"); // adjust path if needed
const { registerUser , checkUsername ,loginUser,currentUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/check-username", checkUsername);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);


module.exports = router;
