const multer = require("multer");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

const Itinerary = require("../models/Itinerary");
const PersonalItinerary = require("../models/PersonalItinerary");
const FavoriteItinerary = require("../models/FavoriteItinerary");
const Activity = require("../models/Activity");

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const itineraries = await Itinerary.findAll({
      where: {
        public: 1,
      },
      limit: limit,
      offset: offset,
    });

    res.json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.deleteItinerary = async (req, res) => {
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

    const activities = await Activity.findAll({
      where: { itineraryId: itinerary.id },
    });
    for (let activity of activities) {
      await activity.destroy({ force: true });
    }

    await personalItinerary.destroy({ force: true });
    await itinerary.destroy({ force: true });

    const dir = `uploads/${userId}/${code}`;
    rimraf.sync(dir);

    res.json({ message: "delete_itinerary" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
exports.createItinerary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code, city, days, startDate, endDate, latitude, longitude } =
      req.body;

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
      latitude,
      longitude,
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

    if (!personalItineraries.length) {
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
    const { code } = req.params;
    const userId = req.user ? req.user.id : null;

    const itinerary = await Itinerary.findOne({
      where: { code },
      include: [
        {
          model: PersonalItinerary,
          as: "personalItineraries",
          where: userId ? { userId } : {},
          required: false,
        },
      ],
    });

    if (!itinerary) {
      return res.status(404).json({ error: "itinerary_not_found" });
    }

    const isOwner =
      itinerary.personalItineraries && itinerary.personalItineraries.length > 0;
    const isPublic = itinerary.public;

    if (!isOwner && !isPublic) {
      return res.status(403).json({ error: "forbidden" });
    }

    res.json({
      ...itinerary.toJSON(),
      isOwner,
      isPublic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getItineraryByCodePublic = async (req, res) => {
  try {
    const { code } = req.params;

    const itinerary = await Itinerary.findOne({
      where: { code, public: 1 },
    });

    if (!itinerary) {
      return res.status(404).json({ error: "itinerary_not_found" });
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

exports.getFavoriteItineraries = async (req, res) => {
  try {
    const userId = req.user.id;

    const favoriteItineraries = await FavoriteItinerary.findAll({
      where: { userId },
      include: {
        model: Itinerary,
        as: "itinerary",
        where: { public: 1 },
      },
    });

    const itineraries = favoriteItineraries.map((fav) => fav.itinerary);

    res.json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.favoriteItinerary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.params;

    const itinerary = await Itinerary.findOne({ where: { code } });
    if (!itinerary) {
      return res.status(404).json({ error: "itinerary_not_found" });
    }

    const favoriteItinerary = await FavoriteItinerary.findOne({
      where: { userId, code: itinerary.code },
    });

    if (favoriteItinerary) {
      await favoriteItinerary.destroy();
      return res.json({ message: "Favorite removed" });
    } else {
      await FavoriteItinerary.create({ userId, code: itinerary.code });
      return res.json({ message: "Favorite added" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server_error" });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.params;

    const itinerary = await Itinerary.findOne({ where: { code } });
    if (!itinerary) {
      return res.status(404).json({ error: "itinerary_not_found" });
    }

    const favorite = await FavoriteItinerary.findOne({
      where: { userId, code: itinerary.code },
    });

    return res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server_error" });
  }
};

exports.deleteFavoriteItinerary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.params;

    const itinerary = await Itinerary.findOne({ where: { code } });
    if (!itinerary) {
      return res.status(404).json({ error: "itinerary_not_found" });
    }

    const favoriteItinerary = await FavoriteItinerary.findOne({
      where: { userId, code: itinerary.code },
    });
    if (!favoriteItinerary) {
      return res.status(404).json({ error: "favorite_not_found" });
    }

    await favoriteItinerary.destroy();
    return res.json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server_error" });
  }
};

exports.updateItineraryPublic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.params;
    const { public } = req.body;

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

    itinerary.public = public;
    await itinerary.save();

    res.json({ message: "update_state_itinerary" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
