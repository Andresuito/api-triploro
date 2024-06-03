const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const activityController = require("../controllers/activityController");

router.get("/activities/:itineraryId", activityController.getAllActivities);
router.post("/activities", requiresToken, activityController.createActivity);
router.put("/activities/:id", requiresToken, activityController.updateActivity);
router.delete("/activities/:id", requiresToken, activityController.deleteActivity);

module.exports = router;
