const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  bodyLoginValidator,
  bodyRegisterValidator,
  bodyChangePasswordValidator,
} = require("../middleware/valitadorManager");

router.post("/register", bodyRegisterValidator, authController.register);
router.post("/login", bodyLoginValidator, authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPasswordEmail);
router.post("/resend-code", authController.resendCodeVerification);
router.patch("/change-password", bodyChangePasswordValidator, authController.changePassword);

module.exports = router;
