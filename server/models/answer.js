const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
  questionId: mongoose.Types.ObjectId,
  text: String,
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
