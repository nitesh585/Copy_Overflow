const db = require("../models");

const QuestionDbObj = db.questions;
const AnswerDbObj = db.answers;

/**
 * method returns object which contains title and body on the basis
 * of their presence. If any one of them is null then don't include
 * in object (fields that has to be set)
 *
 * @param {String} title  title of question
 * @param {String} body   question description
 * @returns object of title and body with their values
 */
function getFieldsToBeSet(title, body) {
  if (title && body) {
    return { title: title, body: body };
  }
  if (title) {
    return { title: title };
  }

  return { body: body };
}

/**
 * method to add question. only logged in users are allowed
 * to do this operation using JWT signed token.
 */
exports.ask_question = async (req, res) => {
  const { title, body, user_id } = req.body;
  // all fields should be filled (title and body)
  if (!(title && body)) {
    return res
      .status(400)
      .send({ message: "title or body is misssing. all fields are required." });
  }
  // create question doc and save to DB
  const question = new QuestionDbObj({
    title: title,
    body: body,
    user_id: user_id,
  });

  question
    .save()
    .then((data) => {
      res.status(200).send({
        messsage: "question posted successfully",
        question_id: data.id,
      });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: err || "Internal Error. question not added." });
    });
};

/**
 * method to get all the answers of particular question
 * by its ID.
 */
exports.answers = (req, res) => {
  const question_id = req.params.id;

  if (!question_id) {
    return res.status(400).send("question not found");
  }

  // find by ID and fetch only _id, answer, created_at and votes
  AnswerDbObj.find(
    { question_id: question_id },
    "_id answer created_at meta.votes"
  )
    .then((data) => {
      return res
        .status(200)
        .send({ question_id: question_id, count: data.length, answers: data });
    })
    .catch((err) => {
      return res
        .status(400)
        .send({ messgae: "answer not fetched", error_details: err });
    });
};

/**
 * method to update the question. only logged in users are allowed
 * to do this operation using JWT signed token.
 */
exports.update_question = (req, res) => {
  const { title, body } = req.body;
  const question_id = req.params.id;
  // check title or body and question_id must be given
  if (!(title || body)) {
    return res
      .status(400)
      .send({ message: "title or body is misssing. all fields are required." });
  }
  if (!question_id) {
    return res.status(400).send({ message: "question id not found" });
  }

  const query = getFieldsToBeSet(title, body);
  QuestionDbObj.updateOne({ _id: question_id }, { $set: query })
    .then((data) => {
      res.status(200).send({
        messsage: "question updated successfully",
        question_id: data.id,
      });
    })
    .catch((err) => {
      send({ message: err || "Internal Error. question not updated." });
    });
};

/**
 * method to get question by its ID
 */
exports.get_question = (req, res) => {
  const question_id = req.params.id;

  if (!question_id) {
    return res.status(400).send({ message: "question id not found." });
  }

  // find and return the question by proper exception handling
  QuestionDbObj.find({ _id: question_id })
    .then((data) => {
      if (!data) {
        return res.status(400).send({ message: "question not found" });
      }
      res.status(200).send({ message: "question found.", question: data });
    })
    .catch((err) => {
      return res
        .status(400)
        .send({ message: "erorr in fetching question", error_details: err });
    });
};

/**
 * method to delete question. only logged in users are allowed
 * to do this operation using JWT signed token.
 */
exports.delete_question = (req, res) => {
  const question_id = req.params.id;
  if (!question_id) {
    return res.status(400).send({ message: "question id not found." });
  }
  QuestionDbObj.findByIdAndDelete(question_id)
    .then((data) => {
      if (!data) {
        return res.status(400).send({ message: "question not found" });
      }
      AnswerDbObj.deleteMany({ question_id: question_id })
        .then((data) => {
          res.status(200).send({ message: "question deleted" });
        })
        .catch((err) => {
          res.status(400).send({
            message: "error, question not deleted",
            error_details: err,
          });
        });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "error, question not deleted", error_details: err });
    });
};

/**
 * method to upvote the answer. Only logged In user is allowed
 * for this operation with signed JWT token.
 */
exports.upvote = (req, res) => {
  const question_id = req.params.id;
  if (!question_id) {
    return res.status(400).send({ message: "question id not found" });
  }

  // increments the votes of particular answer by 1.
  QuestionDbObj.updateOne({ _id: question_id }, { $inc: { "meta.votes": 1 } })
    .then((data) => {
      res.status(200).send({ message: "question upvoted" });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "error, question not upvoted", error_details: err });
    });
};

/**
 * method to downvote the answer. Only logged In user is allowed
 * for this operation with signed JWT token.
 */
exports.downvote = (req, res) => {
  const question_id = req.params.id;
  if (!question_id) {
    return res.status(400).send({ message: "question id not found" });
  }

  // decrements the votes of particular answer by 1.
  QuestionDbObj.updateOne({ _id: question_id }, { $inc: { "meta.votes": -1 } })
    .then((data) => {
      res.status(200).send({ message: "question downvoted" });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "error, question not downvoted", error_details: err });
    });
};
