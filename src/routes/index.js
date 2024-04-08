const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const countryRoutes = require("./countryRoutes");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Status Ok" });
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/country", countryRoutes);

module.exports = router;
