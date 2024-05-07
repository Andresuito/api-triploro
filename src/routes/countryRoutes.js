const express = require("express");
const router = express.Router();
const requiresToken = require("../middleware/requiresToken");
const countryController = require("../controllers/countryController");

router.get("/all", requiresToken, countryController.getAllCountries);
router.get("/:name", countryController.getCountryByName);

module.exports = router;
