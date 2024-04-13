const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/destinationController");

router.get("/all", destinationController.getAllDestinations);
router.get("/:name", destinationController.getDestinationsByName);

module.exports = router;
