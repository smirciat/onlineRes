/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/pilotSchs              ->  index
 * POST    /api/pilotSchs              ->  create
 * GET     /api/pilotSchs/:id          ->  show
 * PUT     /api/pilotSchs/:id          ->  update
 * DELETE  /api/pilotSchs/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var PilotSch = sqldb.PilotSch;

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

// Gets a list of PilotSchs
export function index(req, res) {
  PilotSch.findAll({order:[['Ref','ASC']]})
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single PilotSch from the DB
export function show(req, res) {
  PilotSch.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new PilotSch in the DB
export function create(req, res) {
  PilotSch.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing PilotSch in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  PilotSch.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a PilotSch from the DB
export function destroy(req, res) {
  PilotSch.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
