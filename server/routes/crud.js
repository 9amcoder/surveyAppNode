const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const router = express.Router();
let mongoose = require("mongoose");
let passport = require("passport");

const { render } = require("../config/app");

const crudController = require("../controllers/crud");

//Get Route for the Business Contact List -READ Operation
router.get("/list", crudController.displaySurvey);

router.get("/create", crudController.displaySurveyCreateForm);

router.post("/create", crudController.addSurvey);

router.get("/update/:id", crudController.displaySurveyUpdateForm);

router.post("/update/:id", crudController.updateSurvey);

router.get("/delete/:id", crudController.deleteSurvey);

router.get("/list/:surveyId", crudController.displayQuestion);

router.post("/list/:surveyId", crudController.addAnswers);

router.get("/answers/list/:surveyId", crudController.displayAnswers);

module.exports = router;
