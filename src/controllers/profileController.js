const User = require("../models/User");
const block_username = require("../utils/blacklist/block_username");

const { generateTokenPassword } = require("../utils/generateTokens");
const sendPasswordEmail = require("../utils/sendPasswordEmail");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { password, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (block_username.includes(username)) {
      return res.status(400).json({ error: "invalid_name" });
    }

    console.log(username);

    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    user.username = username || user.username;
    await user.save();

    res.status(200).json({ message: "username_changed_successfully" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "username_already_exists" });
    }
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    user.email = email || user.email;
    await user.save();

    res.status(200).json({ message: "email_changed_successfully" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "email_already_exists" });
    }
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.emailPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const passwordToken = generateTokenPassword(email);

    await sendPasswordEmail(email, passwordToken);

    res.status(200).json({ message: "password_email_sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    await user.destroy();

    res.json({ message: "account_deleted_successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
