const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const itineraryController = require("../controllers/itineraryController");

router.post("/create", requiresToken, itineraryController.createItinerary);
router.get("/user/:userId", requiresToken, itineraryController.getAllUserItineraries);
router.get("/:code", requiresToken, itineraryController.getItineraryByCode);
router.patch("/update/image/:code", requiresToken, itineraryController.updateItineraryImage);

module.exports = router;
