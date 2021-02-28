const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const router = express.Router();

const indexController = require('../controllers/index');


/* GET home page. */
router.get('/', indexController.displayHomePage);

/* GET home page. */
router.get('/home', indexController.displayHomePage);

//Get Route for displaying Login page 
router.get('/login',indexController.displayLoginPage);

//Post Route for processing login page
router.post('/login',indexController.processLoginpage);

/* GET Route for displaying the Register page */
router.get('/register',indexController.displayRegisterPage);

/* POST Route for processing the Register page */
router.post('/register',indexController.processRegisterPage);


//Get to perform User Logout 
router.get('/logout',indexController.performLogout);

module.exports = router;
