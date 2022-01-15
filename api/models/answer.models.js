module.exports = (mongoose) => {
  var schema = mongoose.Schema({
    answer: String,
    question_id: String,
    user_id: String,
    created_at: { type: Date, default: Date.now },
    meta: { votes: { type: Number, default: 0 } },
  });

  return mongoose.model("answers", schema);
};
