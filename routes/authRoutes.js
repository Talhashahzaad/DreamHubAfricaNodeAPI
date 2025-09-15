const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/userModel")

// custom modules
const { validationResult } = require("express-validator");
const { registerValidator, loginValidator, resetPasswordValidator } = require("../middleware/validators");
const { register, login, logout, refreshToken, verifyEmail, sendVerificationEmail } = require('../controllers/authController');
const authController = require("../controllers/authController");


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  next()
};


// Register new user 
router.post('/register', registerValidator, handleValidationErrors, register);

// Login existing user 
router.post('/login', loginValidator, handleValidationErrors, login);

// Generate new access token for valid refresh token 
router.post('/refresh-token', refreshToken);

// Verification route 

router.get("/verify-email/:token", verifyEmail, async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).send("Invalid verification link.");

    // Update verification status
    user.isVerified = true;
    await user.save();

    // Redirect or respond
    res.send(" Email verified successfully!");

  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid or expired link.");
  }
});

router.post("/send-verification-email", sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);

// Forgot password routes 
router.post("/forgot-password", authController.forgotPassword);


router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token before searching in DB (same as you saved in forgotPassword)
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.render("reset-failed", { error: "Invalid or expired password reset link." });
    }

    // Render reset form with token + email
    res.render("reset-password", {
      token,
      email: user.email,
      errors: [],
      frontendUrl: process.env.FRONTEND_URL
    });

  } catch (err) {
    console.error("Error rendering reset-password page:", err);
    res.render("reset-failed", { error: "Something went wrong. Try again." });
  }
});

// Handle Reset Password form submission
router.post("/reset-password/:token", resetPasswordValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    // If validation fails → re-render with error
    return res.status(400).render("reset-password", {
      token: req.params.token,
      email: req.body.email || "",
      errors: errors.array()
    });
  }
  next();
}, authController.resetPassword);


// Logout route 
router.post('/logout', logout);



module.exports = router;