const db = require("../models");

const AnswerDbObj = db.answers;
const Question = db.questions;

/**
 * method to add the answer. Only logged In user is allowed
 * for this operation with signed JWT token.
 */
exports.add_answer = async (req, res) => {
  const { answer, question_id } = req.body;

  // all fields should be filled (answer, question_id)
  if (!(answer && question_id)) {
    return res.status(400).send({
      message: "answer or question_id is missing. all fields are required.",
    });
  }

  //check question is present or not
  try {
    var currQuestion = await Question.findOne({ _id: question_id });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "question not found", error_details: err });
  }

  if (!currQuestion) {
    return res.status(400).send({ message: "question not found" });
  }

  // create answer doc and save into DB
  const answerObj = new AnswerDbObj({
    answer: answer,
    question_id: question_id,
    user_id: currQuestion.user_id,
  });
  answerObj
    .save()
    .then((data) => {
      res.status(200).send({ message: "answer saved!", answer_id: data.id });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "answer not saved.", error_details: err });
    });
};

/**
 * method to get the answer by its id
 */
exports.get_answer = async (req, res) => {
  const answer_id = req.params.id;
  if (!answer_id) {
    return res.status(400).send({ message: "answer id is missing." });
  }

  // find answer in DB with the id
  await AnswerDbObj.findOne({ _id: answer_id })
    .then((currAnswer) => {
      if (!currAnswer) {
        return res.status(400).send({ message: "answer not found" });
      }
      res.status(200).send({ message: "answer found", answer: currAnswer });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "error! while fetching answer", error_details: err });
    });
};

/**
 * method to update the answer. Only logged In user is allowed
 * for this operation with signed JWT token.
 */
exports.update_answer = async (req, res) => {
  const answer_id = req.params.id;
  const { answer, question_id } = req.body;

  // check all fields should be filled (answre, question_id)
  if (!(answer && question_id)) {
    return res.status(400).send({
      message: "answer or question_id is missing. all fields are required.",
    });
  }

  // validate the question, whether it is present or not
  Question.findOne({ _id: question_id })
    .then((data) => {
      if (!data) {
        return res.status(400).send({ message: "question not found" });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .send({ message: "question not found", error_details: err });
    });

  // update the answer
  AnswerDbObj.updateOne({ _id: answer_id }, { $set: { answer: answer } })
    .then((data) => {
      res.status(200).send({ message: "answer updated!", answer_id: data });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "answer not updated.", error_details: err });
    });
};

/**
 * method to upvote the answer. Only logged In user is allowed
 * for this operation with signed JWT token.
 */
exports.upvote = (req, res) => {
  const answer_id = req.params.id;

  if (!answer_id) {
    return res.status(400).send({ message: "answer id not found" });
  }

  // increments the votes of particular answer by 1.
  AnswerDbObj.updateOne({ _id: answer_id }, { $inc: { "meta.votes": 1 } })
    .then((data) => {
      res.status(200).send({ message: "answer upvoted" });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "error, answer not upvoted", error_details: err });
    });
};

/**
 * method to downvote the answer. Only logged In user is allowed
 * for this operation with signed JWT token.
 */
exports.downvote = (req, res) => {
  const answer_id = req.params.id;
  if (!answer_id) {
    return res.status(400).send({ message: "answer id not found" });
  }

  // decrements the votes of particular answer by 1.
  AnswerDbObj.updateOne({ _id: answer_id }, { $inc: { "meta.votes": -1 } })
    .then((data) => {
      res.status(200).send({ message: "answer downvoted" });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "error, answer not downvoted", error_details: err });
    });
};

/**
 * method to delete the answer by id.Only logged In user is allowed
 * for this operation with signed JWT token.
 */
exports.delete_answer = (req, res) => {
  const answer_id = req.params.id;
  if (!answer_id) {
    return res.status(400).send({ message: "answer id not found." });
  }

  // find the delete answer by its id
  AnswerDbObj.findByIdAndDelete(answer_id)
    .then((data) => {
      if (!data) {
        return res.status(400).send({ message: "answer not found" });
      }
      return res.status(200).send({ message: "answer deleted" });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "error, answer not deleted", error_details: err });
    });
};
