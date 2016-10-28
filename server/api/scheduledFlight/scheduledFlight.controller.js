/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/scheduledFlights              ->  index
 * POST    /api/scheduledFlights              ->  create
 * GET     /api/scheduledFlights/:id          ->  show
 * PUT     /api/scheduledFlights/:id          ->  update
 * DELETE  /api/scheduledFlights/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var ScheduledFlight = sqldb.ScheduledFlight;

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

// Gets a list of ScheduledFlights
export function index(req, res) {
  var options = {};
  if (req.body&&req.body.date) {
    var date = new Date(req.body.date); 
    options.effectiveDate = {$lte:date};
    options.endDate = {$gte:date};
  }
  ScheduledFlight.findAll({where: options})
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single ScheduledFlight from the DB
export function show(req, res) {
  ScheduledFlight.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new ScheduledFlight in the DB
export function create(req, res) {
  ScheduledFlight.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ScheduledFlight in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ScheduledFlight.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a ScheduledFlight from the DB
export function destroy(req, res) {
  ScheduledFlight.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
