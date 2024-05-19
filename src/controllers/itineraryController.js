const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Itinerary = require("../models/Itinerary");
const PersonalItinerary = require("../models/PersonalItinerary");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `uploads/${req.user.id}/${req.params.code}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `cover${ext}`);
  },
});

const upload = multer({ storage: storage });

exports.getAllItinerariesPublic = async (req, res) => {
  try {
    const itineraries = await Itinerary.findAll({
      where: {
        public: 1,
      },
    });
    res.json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.createItinerary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code, city, days, startDate, endDate } = req.body;

    const userItineraries = await PersonalItinerary.count({
      where: { userId },
    });
    if (userItineraries >= 3) {
      return res.status(400).json({ error: "user_has_max_itineraries" });
    }

    const itinerary = await Itinerary.create({
      code,
      city,
      days,
      startDate,
      endDate,
    });

    await PersonalItinerary.create({ userId, itineraryId: itinerary.id });

    res.status(201).json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getAllUserItineraries = async (req, res) => {
  try {
    const userId = req.user.id;

    const personalItineraries = await PersonalItinerary.findAll({
      where: { userId },
    });
    if (!personalItineraries) {
      return res.status(404).json({ error: "itineraries_not_found" });
    }

    const itineraries = await Promise.all(
      personalItineraries.map(async (personalItinerary) => {
        return await Itinerary.findByPk(personalItinerary.itineraryId);
      })
    );

    res.json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getItineraryByCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.params;

    const itinerary = await Itinerary.findOne({ where: { code } });
    if (!itinerary) {
      return res.status(404).json({ error: "itinerary_not_found" });
    }

    const personalItinerary = await PersonalItinerary.findOne({
      where: { userId, itineraryId: itinerary.id },
    });
    if (!personalItinerary) {
      return res.status(403).json({ error: "forbidden" });
    }

    res.json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

const deleteExistingCover = async (req, res, next) => {
  const dir = `uploads/${req.user.id}/${req.params.code}`;
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const basename = path.basename(file, path.extname(file));
      if (basename === "cover") {
        fs.unlinkSync(path.join(dir, file));
      }
    }
  }
  next();
};

exports.updateItineraryImage = [
  deleteExistingCover,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { code } = req.params;

      const itinerary = await Itinerary.findOne({ where: { code } });
      if (!itinerary) {
        return res.status(404).json({ error: "itinerary_not_found" });
      }

      const personalItinerary = await PersonalItinerary.findOne({
        where: { userId, itineraryId: itinerary.id },
      });
      if (!personalItinerary) {
        return res.status(403).json({ error: "forbidden" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "no_file_uploaded" });
      }

      const ext = path.extname(req.file.originalname);
      itinerary.imageUrl = `/uploads/${userId}/${code}/cover${ext}`;
      await itinerary.save();

      res.json(itinerary);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "server_error" });
    }
  },
];

exports.favoriteItinerary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.params;

    const itinerary = await Itinerary.findOne({ where: { code } });
    if (!itinerary) {
      return res.status(404).json({ error: "itinerary_not_found" });
    }

    const personalItinerary = await PersonalItinerary.findOne({
      where: { userId, itineraryId: itinerary.id },
    });
    if (!personalItinerary) {
      return res.status(403).json({ error: "forbidden" });
    }

    itinerary.favorite = !itinerary.favorite;
    await itinerary.save();

    res.json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
