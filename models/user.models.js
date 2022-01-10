module.exports = (mongoose) => {
  var schema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
  });

  return mongoose.model("user", schema);
};
