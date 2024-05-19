const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const itineraryController = require("../controllers/itineraryController");

router.get("/allPublic", itineraryController.getAllItinerariesPublic);
router.post("/create", requiresToken, itineraryController.createItinerary);
router.get("/user/:userId", requiresToken, itineraryController.getAllUserItineraries);
router.get("/:code", requiresToken, itineraryController.getItineraryByCode);
router.patch("/update/image/:code", requiresToken, itineraryController.updateItineraryImage);
router.post("/favorite/:code", requiresToken, itineraryController.favoriteItinerary);

module.exports = router;
