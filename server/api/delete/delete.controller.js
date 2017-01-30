/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/deletes              ->  index
 * POST    /api/deletes              ->  create
 * GET     /api/deletes/:id          ->  show
 * PUT     /api/deletes/:id          ->  update
 * DELETE  /api/deletes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var Delete = sqldb.Delete;

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

// Gets a list of Deletes
export function index(req, res) {
  Delete.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Delete from the DB
export function show(req, res) {
  Delete.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Delete in the DB
export function create(req, res) {
  Delete.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Delete in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Delete.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Delete from the DB
export function destroy(req, res) {
  Delete.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
