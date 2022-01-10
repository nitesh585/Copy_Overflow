const { auth } = require("../middleware/auth");

module.exports = (app) => {
  const question = require("../controllers/question.controllers");
  const router = require("express").Router();

  router.post("/ask_question", auth, question.ask_question);

  router.get("/:id/answers", question.answers);
  router.get("/:id", question.get_question);

  router.patch("/:id", auth, question.update_question);
  router.patch("/:id/upvote", auth, question.upvote);
  router.patch("/:id/downvote", auth, question.downvote);

  router.delete("/:id", auth, question.delete_question);

  app.use("/question", router);
};
