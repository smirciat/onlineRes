/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/workorders              ->  index
 * POST    /api/workorders              ->  create
 * GET     /api/workorders/:id          ->  show
 * PUT     /api/workorders/:id          ->  update
 * DELETE  /api/workorders/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var Workorder = sqldb.Workorder;

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

// Gets a list of Workorders
export function index(req, res) {
  Workorder.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Workorder from the DB
export function show(req, res) {
  Workorder.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Workorder in the DB
export function create(req, res) {
  Workorder.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Workorder in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Workorder.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Workorder from the DB
export function destroy(req, res) {
  Workorder.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
