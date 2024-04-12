const User = require("../models/User");
const jwt = require("jsonwebtoken");
const block_username = require("../utils/blacklist/block_username");

const {
  generateToken,
  generateTokenEmail,
  generateTokenPassword,
} = require("../utils/generateTokens");

const sendVerificationEmail = require("../utils/sendVerificationEmail");
const sendPasswordResetEmail = require("../utils/sendPasswordResetEmail");

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    await User.create({ email, username, password });

    if (block_username.includes(username)) {
      return res.status(400).json({ error: "invalid_name" });
    }

    const verificationToken = generateTokenEmail(email);

    await sendVerificationEmail(username, email, verificationToken);

    res.status(201).json({ message: "success" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "email_already_exists" });
    }
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password: loginPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const isPasswordValid = await user.comparePassword(loginPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    if (!user.isActivated) {
      return res.status(403).json({ error: "account_not_activated" });
    }

    const { token, expiresIn } = generateToken(user.id);

    const { password: userPassword, ...userWithoutPassword } = user.toJSON();

    res.json({ user: userWithoutPassword, token, expiresIn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "missing_token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_EMAIL);

    await User.update(
      { isActivated: true },
      { where: { email: decodedToken.email } }
    );

    return res.status(200).json({ message: "email_verified_successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "token_expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "invalid_token" });
    }
    return res.status(400).json({ error: "unknown_error" });
  }
};

exports.forgotPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    const emailToken = generateTokenPassword(email);

    await sendPasswordResetEmail(email, emailToken);

    res.status(200).json({ message: "recovery_email_sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.changePassword = async (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;

  if (!token) {
    return res.status(400).json({ error: "missing_token" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: "passwords_do_not_match" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_PASSWORD);

    const userEmail = decodedToken.email;
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "password_changed_successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
