const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const countryRoutes = require("./countryRoutes");
const destinationRoutes = require("./destinationRoutes");
const itineraryRoutes = require("./itineraryRoutes");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Status Ok" });
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/country", countryRoutes);
router.use("/destination", destinationRoutes);
router.use("/itinerary", itineraryRoutes);

module.exports = router;
