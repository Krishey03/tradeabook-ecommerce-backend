const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware,
    getUserProfile,
    updateUserProfile
} = require("../../controllers/auth/auth-controller");
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Use requireAuth instead of authMiddleware
router.get("/check-auth", requireAuth, (req, res) => {
    const user = req.user;
    const token = req.cookies.token;
    res.status(200).json({
        success: true,
        message: "User authenticated!",
        user,
        token: token
    });
});

router.get("/profile", requireAuth, getUserProfile);
router.put("/profile", requireAuth, updateUserProfile);

module.exports = router;