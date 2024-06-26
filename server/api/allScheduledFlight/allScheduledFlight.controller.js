/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/allScheduledFlights              ->  index
 * POST    /api/allScheduledFlights              ->  create
 * GET     /api/allScheduledFlights/:id          ->  show
 * PUT     /api/allScheduledFlights/:id          ->  update
 * DELETE  /api/allScheduledFlights/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var AllScheduledFlight = sqldb.AllScheduledFlight;

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

// Gets a list of AllScheduledFlights
export function index(req, res) {
  AllScheduledFlight.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single AllScheduledFlight from the DB
export function show(req, res) {
  AllScheduledFlight.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new AllScheduledFlight in the DB
export function create(req, res) {
  AllScheduledFlight.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing AllScheduledFlight in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  AllScheduledFlight.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a AllScheduledFlight from the DB
export function destroy(req, res) {
  AllScheduledFlight.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
