const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const friendshipController = require("../controllers/friendshipController");

router.get("/users", requiresToken, friendshipController.searchUsersByUsername);
router.get("/friends/:id", requiresToken, friendshipController.getFriends);
router.get("/is-friend/:id", requiresToken, friendshipController.isFriend);
router.post("/send-request/:id", requiresToken, friendshipController.sendFriendRequest);
router.get("/pending-requests/:id", requiresToken, friendshipController.getPendingRequests);
router.post("/accept-request/:id", requiresToken, friendshipController.acceptFriendRequest);
router.post("/reject-request/:id", requiresToken, friendshipController.rejectFriendRequest);
router.delete("/delete-friend/:id", requiresToken, friendshipController.deleteFriend);

module.exports = router;
