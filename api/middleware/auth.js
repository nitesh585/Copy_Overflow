const jwt = require("jsonwebtoken");
const db = require("../models");
const appConfig = require("../config/app.config");
const User = db.users;
/**
 * middleware fuction to authenticate the user that consits
 * of verifying JWT tokens and check for active user_id.
 */
exports.auth = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res
      .status(400)
      .send({ message: "user authentication failed. token not found." });
  }

  try {
    // token verification
    const decoded = jwt.verify(token, appConfig.TOKEN_KEY);

    // verify user_id is active or not
    if (!(await User.findOne({ _id: decoded.user_id }))) {
      return res.status(400).send({ message: "user not found." });
    }

    // if user active then add user_id to request object
    req.body.user_id = decoded.user_id;
  } catch (err) {
    return res
      .status(400)
      .send({ message: "user authentication failed.", error_details: err });
  }

  next();
};
