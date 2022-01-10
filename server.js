const express = require("express");
const cors = require("cors");
const appConfig = require("./config/app.config");
const app = express();
var corOptions = {
  origin: "*",
};

app.use(cors(corOptions));
app.use(express.json());

const db = require("./models");
// establish connection to Mongo Atlas
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db ");
  })
  .catch((err) => {
    console.log("cannot connect to db ", err);
    process.exit();
  });

// register all the routes of app
require("./routes/user.routes.js")(app);
require("./routes/question.routes")(app);
require("./routes/answers.routes")(app);

// start the server
app.listen(appConfig.PORT, () => {
  console.log(`server running on PORT:${appConfig.PORT}`);
});
