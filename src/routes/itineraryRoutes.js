const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const itineraryController = require("../controllers/ItineraryController");

router.post("/create", requiresToken, itineraryController.createItinerary);

module.exports = router;
