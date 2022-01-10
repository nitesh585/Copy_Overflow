const { auth } = require("../middleware/auth");

module.exports = (app) => {
  const answer = require("../controllers/answers.controller");
  const router = require("express").Router();

  router.post("/add_answer", auth, answer.add_answer);

  router.get("/:id", answer.get_answer);

  router.patch("/:id", answer.update_answer);
  router.patch("/:id/upvote", auth, answer.upvote);
  router.patch("/:id/downvote", auth, answer.downvote);

  router.delete("/:id", auth, answer.delete_answer);

  app.use("/answer", router);
};
