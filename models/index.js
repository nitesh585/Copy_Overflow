const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./user.models")(mongoose);
db.questions = require("./question.models")(mongoose);
db.answers = require("./answer.models")(mongoose);

module.exports = db;
