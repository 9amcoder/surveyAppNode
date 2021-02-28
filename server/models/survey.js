const mongoose = require("mongoose");

const surveySchema = mongoose.Schema({
  name: String,
  author: String,
  subject: String,
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
