const jwt = require("jsonwebtoken");

const requiresToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "missing_token" });
    }

    token = token.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "invalid_token" });
      }
      const { userId } = decoded;
      req.user = { id: userId };

      next();
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "invalid_token" });
  }
};

module.exports = requiresToken;
