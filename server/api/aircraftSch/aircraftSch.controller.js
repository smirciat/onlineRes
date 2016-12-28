/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/aircraftSchs              ->  index
 * POST    /api/aircraftSchs              ->  create
 * GET     /api/aircraftSchs/:id          ->  show
 * PUT     /api/aircraftSchs/:id          ->  update
 * DELETE  /api/aircraftSchs/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var AircraftSch = sqldb.AircraftSch;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err);
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

// Gets a list of AircraftSchs
export function index(req, res) {
  AircraftSch.findAll({order:[['Ref','ASC']]})
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single AircraftSch from the DB
export function show(req, res) {
  AircraftSch.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new AircraftSch in the DB
export function create(req, res) {
  AircraftSch.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing AircraftSch in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  AircraftSch.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a AircraftSch from the DB
export function destroy(req, res) {
  AircraftSch.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
