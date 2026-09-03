const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "Access Denied",
      });
    }

    const actualToken = token.replace("Bearer ", "");

    const verified = jwt.verify(actualToken, "mysecretkey");

    req.user = verified;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = authMiddleware;