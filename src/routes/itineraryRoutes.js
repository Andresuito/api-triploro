const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const itineraryController = require("../controllers/itineraryController");

router.get("/allPublic", itineraryController.getAllItinerariesPublic);
router.post("/create", requiresToken, itineraryController.createItinerary);
router.get("/user/:userId", requiresToken, itineraryController.getAllUserItineraries);
router.get("/:code", requiresToken, itineraryController.getItineraryByCode);
router.get("/public/:code", itineraryController.getItineraryByCodePublic);
router.patch("/update/image/:code", requiresToken, itineraryController.updateItineraryImage);
router.get("/favorites/:userId", requiresToken, itineraryController.getFavoriteItineraries);
router.post("/favorite/:code", requiresToken, itineraryController.favoriteItinerary);
router.get("/favorite/:code", requiresToken, itineraryController.checkFavorite);
router.delete("/favorite/:code", requiresToken, itineraryController.deleteFavoriteItinerary);

module.exports = router;
