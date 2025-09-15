const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const BlacklistedToken = require('../models/blacklistedToken');
const path = require('path');
const generateResetPasswordEmail = require('../templates/generateResetPasswordEmail');
const generateResetSuccessPage = require('../templates/resetPasswordSuccess');
const generateResetErrorPage = require('../templates/resetPasswordError');


const generateSuccessPage = require('../templates/verificationSuccess');
const generateAlreadyVerifiedPage = require('../templates/alreadyVerified');
const generateErrorPage = require('../templates/verificationError');
const generateVerificationEmail = require('../templates/generateVerificationEmail')


// Register New User

const sendEmail = require("../utils/sendEmail")


exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const emailLower = email?.toLowerCase();
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  }

  if (!phone) {
    errors.push({ field: 'phone', message: 'Phone is required' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  //  Check if user with same email or phone already exists
  const userExists = await User.findOne({ $or: [{ email: emailLower }, { phone }] }); //change
  if (userExists) {
    return res.status(400).json({ error: "Email or phone already exists" });
  }


  //  Create new user
  const user = new User({
    name,
    email: emailLower,
    phone,
    password
  });


  //  Save user to DB
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
};


//  Login with Email or Phone
exports.login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  let user;

  //  Check if input is email or phone
  const isEmail = /^\S+@\S+\.\S+$/.test(emailOrPhone);
  if (isEmail) {
    user = await User.findOne({ email: emailOrPhone.toLowerCase() });
  }
  else if (!isNaN(emailOrPhone)) {
    user = await User.findOne({ phone: Number(emailOrPhone) });
  }

  //  User not found
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  //  Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  //  Generate access and refresh tokens
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );



  //  Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();


  //  Set refresh token in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'Strict',
    path: '/'
  });


  //  Return access token
  res.json({ message: "Login successful", accessToken });
};

exports.sendVerificationEmail = async (req, res) => {
  try {
    const { userId } = req.body; // frontend will send this

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_EMAIL_SECRET, { expiresIn: "1d" });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const html = generateVerificationEmail(verifyUrl);
    const logoURL = `${process.env.FRONTEND_URL}/public/assets/logo/logo-dreamhub.png`;


    await sendEmail(
      user.email,
      "Verify Your Email - Dream Hub Africa",
      html
    );

    res.json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verification route 

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).send(generateErrorPage("Invalid or expired token"));

    if (user.isVerified) {
      return res.status(200).send(generateAlreadyVerifiedPage());
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).send(generateSuccessPage());
  } catch (err) {
    res.status(400).send(generateErrorPage("Invalid or expired token"));
  }
};


//  Refresh Access Token
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  //  No refresh token
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    //  Verify refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    //  Find user and match token
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    //  Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    //  Return new token
    res.json({ accessToken: newAccessToken });

  } catch (err) {

    //  Token expired or tampered
    return res.status(403).json({ error: "Token expired or invalid" });
  }
};

exports.forgotPassword = async (req, res) => {

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    const genericMsg =
      "If an account with that email exists, a password reset link has been sent.";

    if (!user) {
      return res.status(200).json({ message: genericMsg });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const FRONTEND_URL = process.env.FRONTEND_URL;
    const resetURL = `${FRONTEND_URL}/reset-password/${rawToken}`;

    const subject = "Reset your password";
    const logoURL = `${process.env.FRONTEND_URL}/public/assets/logo/logo-dreamhub.png`;
    const html = generateResetPasswordEmail(resetURL);

    console.log("ForgotPassword sending email to:", user.email);
    await sendEmail(
      user.email,
      subject,
      html
    );

    return res.status(200).json({ message: genericMsg });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


// POST /auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) return res.status(400).json({ error: "Token is required" });

    if (!password || !confirmPassword) {
      return res.status(400).render("reset-failed", { error: "Password and confirm password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("reset-failed", { error: "Passwords do not match" });
    }



    // Hash incoming token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token (not expired)
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password"); // ensure we can set password

    if (!user) {
      return res.status(400).render("reset-failed", { error: "Invalid or expired reset link" });
    }

    // Set new password
    user.password = password; // pre('save') hook will hash it if you have one

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Invalidate old sessions
    user.passwordChangedAt = new Date();

    await user.save();

    //  Send styled success email
    const subject = "Your password has been reset successfully";
    const html = generateResetSuccessPage();
    const logoURL = `${process.env.FRONTEND_URL}/public/assets/logo/logo-dreamhub.png`;


    await sendEmail(
      user.email,
      subject,
      html
    );

    return res.status(200).render("reset-success");
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).render("reset-failed", { error: "Something went wrong. Please try again." });
  }
};



exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;


  // Always clear the cookie

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/'
  });

  try {


    // Verify and remove refresh token from user
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) {
        user.refreshToken = '';
        await user.save();
      }
    }

    // Blacklist the access token
    if (accessToken) {
      const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET);
      await BlacklistedToken.create({
        token: accessToken,
        expiresAt: new Date(decodedAccess.exp * 1000) // expire in seconds 
      });
    }

    res.status(200).json({ message: 'Logged out successfully' });

  } catch (err) {
    res.status(403).json({ error: 'Invalid token(s)' });
  }
};