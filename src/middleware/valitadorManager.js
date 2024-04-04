const { validationResult } = require("express-validator");
const { body } = require("express-validator");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ error: firstError });
  }

  next();
};

const bodyLoginValidator = [
  body("email", "invalid_email_format").trim().isEmail().normalizeEmail(),
  validateResult,
];

const bodyRegisterValidator = [
  body("email", "invalid_email_format").trim().isEmail().normalizeEmail(),
  body("username", "username_empty").trim().notEmpty(),
  body("password", "password_length").trim().isLength({ min: 6 }),
  validateResult,
];

const bodyUpdateUsernameValidator = [
  body("username", "username_empty").trim().notEmpty(),
  validateResult,
];

const bodyUpdateEmailValidator = [
  body("email", "invalid_email_format").trim().isEmail().normalizeEmail(),
  validateResult,
];

const bodyChangePasswordValidator = [
  body("newPassword", "password_length").trim().isLength({ min: 6 }),
  body("confirmNewPassword", "password_length").trim().isLength({ min: 6 }),
  validateResult,
];

module.exports = {
  validateResult,
  bodyLoginValidator,
  bodyRegisterValidator,
  bodyUpdateUsernameValidator,
  bodyUpdateEmailValidator,
  bodyChangePasswordValidator,
};
