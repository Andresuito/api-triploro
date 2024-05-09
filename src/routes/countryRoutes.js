const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");

router.get("/all", countryController.getAllCountries);
router.get("/:name", countryController.getCountryByName);

module.exports = router;
