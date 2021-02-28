let express = require("express");
let router = express.Router();

let mongoose = require("mongoose");

//connect to Survey and Question
let Survey = require("../models/survey");
let Question = require("../models/question");
let Answer = require("../models/answer");


//displaying bussiness contacts list view page
module.exports.displaySurvey = (req, res, next) => {
  Survey.find((err, surveyList) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("Survey/list", {
        title: "Survey List",
        SurveyList: surveyList,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
};

//displaying Survey form
module.exports.displaySurveyCreateForm = (req, res, next) => {
  res.render("Survey/edit", {
    title: "Add Survey",
    displayName: req.user ? req.user.displayName : "",
    survey: {},
  });
};

//adding new data to the database and redirecting to the business contacts list view
module.exports.addSurvey = (req, res, next) => {
  let newSurvey = Survey({
    name: req.body.name,
    author: req.body.author,
    subject: req.body.subject,
  });

  Survey.create(newSurvey, (err, Survey) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      for (let i = 0; i < req.body.number; i++) {
        if (req.body.questions[i] != "") {
          addQuestion(Survey._id, req.body.questions[i]);
        }
      }
      res.redirect("/crud/list");
    }
  });
};

//adding new data to the database and redirecting to the business contacts list view
let addQuestion = (surveyId, text) => {
  let newQuestion = Question({
    surveyId: surveyId,
    text: text,
  });

  Question.create(newQuestion, (err, Question) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      return true;
    }
  });
};

//displaying survey update form
module.exports.displaySurveyUpdateForm = (req, res, next) => {
  let id = req.params.id;
  Survey.findById(id, (err, SurveyToEdit) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.render("Survey/edit", {
        title: "Update Survey",
        survey: SurveyToEdit,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
};

//update existing document in database and redirecting to the business contacts list view
module.exports.updateSurvey = (req, res, next) => {
  let id = req.params.id;
  const survey = {
    name: req.body.name,
    author: req.body.author,
    subject: req.body.subject,
  };
  Survey.updateOne({
      _id: id,
    },
    survey,
    (err) => {
      if (err) {
        console.log(err);
        res.end(err);
      } else {
        res.redirect("/crud/list");
      }
    }
  );
};

module.exports.deleteSurvey = (req, res, next) => {
  let id = req.params.id;

  Survey.remove({
      _id: id,
    },
    (err) => {
      if (err) {
        console.log(err);
        res.end(err);
      } else {
        res.redirect("/crud/list");
      }
    }
  );
};

//display questions from survey
module.exports.displayQuestion = (req, res, next) => {
  Question.find({
    surveyId: req.params.surveyId
  }, (err, QuestionList) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("Question/list", {
        title: "Give Survey",
        QuestionList: QuestionList,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
};

//display questions from survey
module.exports.addAnswers = (req, res, next) => {
  for (let [key, value] of Object.entries(req.body)) {
    let newAnswer = Answer({
      questionId: key,
      text: value,
    });

    Answer.create(newAnswer, (err, newAnswer) => {
      if (err) {
        console.log(err);
        return err;
      }
    });
  }
  res.redirect("/crud/list");
};

//display questions from survey
module.exports.displayAnswers = (req, res, next) => {
  let answersList = [];
  Question.find({
    surveyId: req.params.surveyId
  }, (err, QuestionList) => {
    if (err) {
      return console.error(err);
    } else {
      console.log(QuestionList);
      for (let i = 0; i < Object.keys(QuestionList).length; i++) {
        answersArray = [];
        answersList.push({
          questionId: QuestionList[i]["_id"],
          question: QuestionList[i]["text"],
          answers: []
        })
      }
      for (let i = 0; i < Object.keys(answersList).length; i++) {
        Answer.find({
          questionId: answersList[i].questionId
        }, (err, Answers) => {
          if (err) {
            return console.error(err);
          } else {
            let answersArray = new Array();
            for (let i = 0; i < Object.keys(Answers).length; i++) {
              answersArray.push(Answers[i].text);
            }
            answersList[i].answers = answersArray;
          }
        });
      }
      setTimeout(function () {
        res.render("Survey/listAnswers", {
          title: "Survey Answers",
          AnswersList: answersList,
          displayName: req.user ? req.user.displayName : "",
        });
      }, 1000);
    }
  });
};