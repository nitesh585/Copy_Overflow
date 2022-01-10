module.exports = (mongoose) => {
  var questions = mongoose.Schema({
    title: String,
    body: String,
    user_id: String,
    created_at: { type: Date, default: Date.now },
    meta: { votes: { type: Number, default: 0 } },
  });

  return mongoose.model("questions", questions);
};
