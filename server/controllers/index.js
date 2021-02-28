const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// enable jwt
let jwt = require('jsonwebtoken');
let DB = require('../config/db');

// create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; // alias

/* GET home page. */
module.exports.displayHomePage = (req, res, next) => {
    res.render('index',{title: 'Survey',displayName: req.user ? req.user.displayName : ''});
};

/* GET Route for displaying the Login page */
module.exports.displayLoginPage = (req, res, next) => {
  // check if the user is already logged in
  if(!req.user)
  {
      res.render('auth/login', 
      {
         title: "Login",
         messages: req.flash('loginMessage'),
         displayName: req.user ? req.user.displayName : '' 
      })
  }
  else
  {
      return res.redirect('/');
  }
};

/* POST Route for processing the Login page */
module.exports.processLoginpage = (req,res,next) => {
  passport.authenticate('local',
  (err, user, info) => {
      // server err?
      if(err)
      {
          return next(err);
      }
      // is there a user login error?
      if(!user)
      {
          req.flash('loginMessage', 'Authentication Error');
          return res.redirect('/login');
      }
      req.login(user, (err) => {
          // server error?
          if(err)
          {
              return next(err);
          }

          const payload = 
          {
              id: user._id,
              displayName: user.displayName,
              username: user.username,
              email: user.email
          }

          const authToken = jwt.sign(payload, DB.Secret, {
              expiresIn: 604800 // 1 week
          });

          return res.redirect('/');
      });
  })(req, res, next);
};

/* GET Route for displaying the Register page */
module.exports.displayRegisterPage = (req, res, next) => {
  // check if the user is not already logged in
  if(!req.user)
  {
      res.render('auth/register',
      {
          title: 'Register',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
      });
  }
  else
  {
      return res.redirect('/');
  }
};

/* POST Route for processing the Register page */
module.exports.processRegisterPage = (req, res, next) => {
  // instantiate a user object
  let newUser = new User({
      username: req.body.username,
      //password: req.body.password
      email: req.body.email,
      displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, (err) => {
      if(err)
      {
          console.log("Error: Inserting New User");
          if(err.name == "UserExistsError")
          {
              req.flash(
                  'registerMessage',
                  'Registration Error: User Already Exists!'
              );
              console.log('Error: User Already Exists!')
          }
          return res.render('auth/register',
          {
              title: 'Register',
              messages: req.flash('registerMessage'),
              displayName: req.user ? req.user.displayName : ''
          });
      }
      else
      {

          return passport.authenticate('local')(req, res, () => {
              res.redirect('/')
          });
      }
  });
};

/* GET to perform UserLogout */
module.exports.performLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}
