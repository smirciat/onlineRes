/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/reservations              ->  index
 * POST    /api/reservations              ->  create
 * GET     /api/reservations/:id          ->  show
 * PUT     /api/reservations/:id          ->  update
 * DELETE  /api/reservations/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var sequelize = require('sequelize');
var Reservation = sqldb.Reservation;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Reservations
export function index(req, res) {
  var date = new Date(req.query.date); 
  var endDate = new Date(date.getFullYear(),date.getMonth(),date.getDate()+1); 
  Reservation.findAll({attributes:  ["_id","DATE TO FLY", "smfltnum"],where: {"DATE TO FLY":{$gte:date,$lt:endDate} } } )
  //Reservation.findAll({where: {"DATE TO FLY":{$gte:date}}})
    .then(responseWithResult(res))
    .catch(handleError(res));
}

//get all reservations belonging to current user
export function batch(req, res) {
  //Reservation.findAll({where: {smfltnum:'09A',"DATE TO FLY":{$gte:dt,$lte:de} }})
  if (!req.params.id) {
    res.status(500).end();
    return null;
  }
  Reservation.findAll({where: {uid:req.params.id}})
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Reservation in the DB
export function create(req, res) {
  console.log(req.body);
  Reservation.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Reservation in the DB
export function update(req, res) {
  
  if (!req.body.reservation||!req.body.user||parseInt(req.body.reservation.uid,10)!==req.body.user._id) {
    res.status(500).end();
    return null;
  }
  if (req.body.reservation._id) {
    delete req.body.reservation._id;
  }
  Reservation.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body.reservation))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Reservation from the DB
export function destroy(req, res) {
  if (!req.body.reservation||!req.body.user||parseInt(req.body.reservation.uid,10)!==req.body.user._id) {
    res.status(500).end();
    return null;
  }
  Reservation.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}