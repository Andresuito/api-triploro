const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const friendshipController = require("../controllers/friendshipController");

router.get("/users", requiresToken, friendshipController.searchUsersByUsername);
router.get("/friends/:id", requiresToken, friendshipController.getFriends);
router.get("/is-friend/:id", requiresToken, friendshipController.isFriend);
router.post("/friend-request", requiresToken, friendshipController.sendFriendRequest);

module.exports = router;
