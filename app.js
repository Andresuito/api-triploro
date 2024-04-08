const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/sequelizeConfig");
const addCountries = require("./scripts/addCountries");
const addCities = require("./scripts/addCities");

/* Models */
const User = require("./src/models/User");
const Country = require("./src/models/Country");
const Destination = require("./src/models/Destinations");
const Itinerary = require("./src/models/Itinerary");
const FavoriteItinerary = require("./src/models/FavoriteItinerary");

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

app.use("/api/v1", require("./src/routes"));

app.use(errorHandler);
app.use(notFoundHandler);

const port = process.env.PORT || 8000;

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Model synchronized with the database");
    addCountries();
    setTimeout(addCities, 2000);
    app.listen(port, () => {
      console.log(`Express server running at http://localhost:${port}/api/v1/`);
    });
  })
  .catch((err) => {
    console.error("Error synchronizing the model with the database:", err);
  });
