const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const invitationController = require("../controllers/invitationController");

router.get("/itinerary/:userId", requiresToken, invitationController.getItineraryInvitationsAccepted);
router.get("/invites/:userId", requiresToken, invitationController.getInvites);
router.get("/invitations/:itineraryId", requiresToken, invitationController.getInvitations);
router.post("/create", requiresToken, invitationController.createInvitation);
router.post("/accept", requiresToken, invitationController.acceptInvitation);
router.post("/reject", requiresToken, invitationController.rejectInvitation);

module.exports = router;
