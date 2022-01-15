const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const appConfig = require("../config/app.config");
const User = db.users;
const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

/**
 * method to register the user.
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // all fields should be filled (email, name, password)
  if (!(name && email && password)) {
    return res.status(400).send({
      message: "name or email or password is missing. all fields are required.",
    });
  }

  // check for email format
  if (!email.match(emailFormat)) {
    return res.status(400).send({
      message: "email is not in correct format.",
    });
  }

  // check user is already present or not
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res
      .status(400)
      .send({ message: "user already exists. please login." });
  }

  //  encrypt the password
  const encryptedPassword = await bcrypt.hash(password, appConfig.SALT_ROUNDS);

  // create user doc and save into DB
  const user = new User({
    name: name,
    email: email.toLowerCase(),
    password: encryptedPassword,
  });

  user
    .save(user)
    .then((data) => {
      res.send({ message: "user registeration done.", user: data });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "unable to register user" });
    });
};

/**
 * method to login the user. Only registered users are allowed
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // all fields should be filled (email, password)
  if (!(email && password)) {
    return res.status(400).send({
      message: "email or password is missing. all fields are required.",
    });
  }

  //  check for email format
  if (!email.match(emailFormat)) {
    return res.status(400).send({
      message: "email is not in correct format.",
    });
  }

  // check user is already present or not
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({ message: "user not found. please register" });
  }

  //  compare encrypted the password and return JWT signed token on success
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ user_id: user.id, email }, appConfig.TOKEN_KEY, {
      expiresIn: appConfig.TOKEN_EXPIRE_TIME,
    });

    return res
      .status(200)
      .json({ message: "user logged in.", user: user, token: token });
  }
  res.status(400).send("invalid credentials.");
};
