'use strict';

import {User} from '../../sqldb';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
var sqldb = require('../../sqldb');
var Mail = sqldb.Mail;
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({ 
    host: 'smtp.gmail.com', 
    port: 465, 
    auth: { user: 'smokeybayair@gmail.com', pass: process.env.GMAIL_PASS },
    secure: true
});

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  User.findAll({
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider'
    ],
    order:[['email','ASC']]
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'user');
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

export function email(req, res, next) {
 
   User.findAll({
     attributes: [
       
       'email'
     ]
   })
     .then(user => { // don't ever give out the password or salt
       if (!user) {
         return res.status(401).end();
       }
       res.json(user);
     })
     .catch(err => next(err));
 }

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  User.destroy({where:{_id: req.params.id} })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}


/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

export function adminChangeRole(req, res, next) {
  var userId = req.body.user;
  var newRole = req.body.role;

  User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if (true) {
        user.role = newRole;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

export function adminChangePassword(req, res, next) {
  var userId = req.body.id;
  var mailOptions = req.body.mailOptions;
  var subjectUser = req.body.subjectUser;
  var newPass=Math.random().toString(36).substr(2, 10);

  User.find({
    where: {
      email: subjectUser.email
    }
  })
    .then(user => {
      if (user) {
        user.password = newPass;
        return user.save()
          .then(() => {
            mailOptions.from = '"Smokey Bay Air" <smokeybayair@gmail.com>';
            mailOptions.text = "A password reset has been requested for: " + user.email + ".  Your new password is " + newPass ;// plaintext body
            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  handleError(res);
                  return console.log(error);
              }
              console.log('Message sent: ' + info.response);
              res.status(204).end();
              return info.response;
            });
            
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

export function changeEmail(req, res, next) {
  var userId = req.user._id;
  var email = String(req.body.email);
  console.log(email)
  User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if (user) {
        user.email = email;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;
  console.log('/api/me fired, user id is ' + req.user._id);
  User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

export function email(req, res, next) {

  User.findAll({
    attributes: [
      
      'email'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
