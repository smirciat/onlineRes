/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/flights              ->  index
 * POST    /api/flights              ->  create
 * GET     /api/flights/:id          ->  show
 * PUT     /api/flights/:id          ->  update
 * DELETE  /api/flights/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var Flight = sqldb.Flight;

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

// Gets a list of Flights
export function index(req, res) {
  Flight.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Flight from the DB
export function show(req, res) {
  Flight.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

//get all reservations for the specified day and flight time
export function oneD(req, res) {
  var options = {};
  if (req.body.date) {
    
    var date = new Date(req.body.date); 
    var endDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59); 
    options['DATE'] = {
      $lt: endDate,
      $gte: date 
    };
  }
  else {
    res.status(500).end();
    return null;
  }
  if (req.body.smfltnum){
    var smfltnum2 = req.body.smfltnum.substring(0,2) + 'B';
    if (req.body.smfltnum.toUpperCase().substring(2)==='B') smfltnum2 = req.body.smfltnum.substring(0,2) + 'A';
    options['$or'] = [{SmFltNum:req.body.smfltnum},{SmFltNum:smfltnum2}];
  }
  Flight.findAll({where: options } )
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Flight in the DB
export function create(req, res) {
  console.log(req.body);
  Flight.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Flight in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Flight.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Flight from the DB
export function destroy(req, res) {
  Flight.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
