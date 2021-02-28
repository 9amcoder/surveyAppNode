const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  surveyId: mongoose.Types.ObjectId,
  text: String,
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
