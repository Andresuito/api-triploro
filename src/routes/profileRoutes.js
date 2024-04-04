const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const profileController = require("../controllers/profileController");
const {
  bodyUpdateUsernameValidator,
  bodyUpdateEmailValidator,
} = require("../middleware/valitadorManager");

router.get("/profile/", requiresToken, profileController.getUserProfile);
router.patch("/username",  requiresToken, bodyUpdateUsernameValidator, profileController.updateUsername);
router.patch("/email", requiresToken, bodyUpdateEmailValidator, profileController.updateEmail);
router.post("/email-password", requiresToken, profileController.emailPassword);
router.delete("/delete-account",  requiresToken,profileController.deleteAccount);

module.exports = router;
