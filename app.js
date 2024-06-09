const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/sequelizeConfig");
const addUsers = require("./scripts/addFakeUsers.js");
const addCountries = require("./scripts/addCountries");
const addCities = require("./scripts/addCities");
const addTags = require("./scripts/addTags");
const addTagsToDestinations = require("./scripts/addTagsToDestinations.js");
const createFakeItineraries = require("./scripts/addItineraries.js");

// Importar modelos
const User = require("./src/models/User");
const Itinerary = require("./src/models/Itinerary");
const Invitation = require("./src/models/Invitation");
const Friendship = require("./src/models/Friendship");
const Country = require("./src/models/Country");
const Destination = require("./src/models/Destinations");
const FavoriteItinerary = require("./src/models/FavoriteItinerary");
const PersonalItinerary = require("./src/models/PersonalItinerary");
const Tag = require("./src/models/Tag");

const {
  errorHandler,
  notFoundHandler,
} = require("./src/middleware/errorHandler");

dotenv.config();
const app = express();

app.use(morgan("dev"));

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? process.env.CORS_ORIGIN
      : process.env.CORS_ORIGIN_PROD,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/img", express.static("img"));
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", require("./src/routes"));

User.hasMany(Invitation, { foreignKey: "userId", as: "invitations" });
Invitation.belongsTo(User, { foreignKey: "userId", as: "inviter" });

Itinerary.hasMany(Invitation, { foreignKey: "itineraryId", as: "invitations" });
Invitation.belongsTo(Itinerary, { foreignKey: "itineraryId", as: "itinerary" });

Itinerary.belongsToMany(Tag, { through: "ItineraryTag" });
Tag.belongsToMany(Itinerary, { through: "ItineraryTag" });

Itinerary.hasMany(FavoriteItinerary, {
  foreignKey: "code",
  sourceKey: "code",
  as: "favoriteItineraries",
});
FavoriteItinerary.belongsTo(Itinerary, {
  foreignKey: "code",
  targetKey: "code",
  as: "itinerary",
});

Itinerary.hasMany(PersonalItinerary, {
  foreignKey: "itineraryId",
  as: "personalItineraries",
});
PersonalItinerary.belongsTo(Itinerary, { foreignKey: "itineraryId" });

User.belongsToMany(User, {
  as: "friends",
  through: "Friendship",
  foreignKey: "userId",
  otherKey: "friendId",
});

User.hasMany(FavoriteItinerary, { foreignKey: "userId" });
User.hasMany(PersonalItinerary, { foreignKey: "userId" });

app.use(errorHandler);
app.use(notFoundHandler);

const port = process.env.PORT || 8000;

sequelize
  .sync()
  .then(() => {
    console.log("Model synchronized with the database");
    addUsers();
    addCountries();
    setTimeout(addCities, 2000);
    setTimeout(addTags, 2000);
    setTimeout(addTagsToDestinations, 3000);
    setTimeout(createFakeItineraries, 3000);
    app.listen(port, () => {
      console.log(`Express server running at http://localhost:${port}/api/v1/`);
    });
  })
  .catch((err) => {
    console.error("Error synchronizing the model with the database:", err);
  });
