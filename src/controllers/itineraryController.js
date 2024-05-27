const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Itinerary = require("../models/Itinerary");
const PersonalItinerary = require("../models/PersonalItinerary");
const FavoriteItinerary = require("../models/FavoriteItinerary");

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
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

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

    const itinerary = await Itinerary.findOne({
      where: { code },
      include: [
        {
          model: PersonalItinerary,
          as: "personalItineraries",
          where: { userId },
          required: false,
        },
      ],
    });

    if (!itinerary) {
      return res.status(404).json({ error: "itinerary_not_found" });
    }

    const isOwner =
      itinerary.personalItineraries && itinerary.personalItineraries.length > 0;

    if (!isOwner) {
      return res.status(403).json({ error: "forbidden" });
    }

    res.json({
      ...itinerary.toJSON(),
      isOwner,
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
      where: { code },
    });

    if (!itinerary) {
      return res.status(404).json({ error: "itinerary_not_found" });
    }

    let isOwner = false;
    if (itinerary.public) {
      const fullItinerary = await Itinerary.findOne({
        where: { code },
        include: [{ all: true }],
      });
      return res.json({
        ...fullItinerary.toJSON(),
        isOwner,
      });
    }

    if (req.user) {
      const userId = req.user.id;
      const personalItinerary = await PersonalItinerary.findOne({
        where: { userId, itineraryId: itinerary.id },
      });

      isOwner = !!personalItinerary;
    }

    const fullItinerary = await Itinerary.findOne({
      where: { code },
      include: [{ all: true }],
    });

    res.json({
      ...fullItinerary.toJSON(),
      isOwner,
    });
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

    console.log(userId);

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
