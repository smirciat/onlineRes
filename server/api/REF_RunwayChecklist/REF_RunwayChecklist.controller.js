/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/REF_RunwayChecklists              ->  index
 * POST    /api/REF_RunwayChecklists              ->  create
 * GET     /api/REF_RunwayChecklists/:id          ->  show
 * PUT     /api/REF_RunwayChecklists/:id          ->  update
 * DELETE  /api/REF_RunwayChecklists/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var REFRunwayChecklist = sqldb.REFRunwayChecklist;

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

// Gets a list of REFRunwayChecklists
export function index(req, res) {
  REFRunwayChecklist.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single REFRunwayChecklist from the DB
export function show(req, res) {
  REFRunwayChecklist.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new REFRunwayChecklist in the DB
export function create(req, res) {
  REFRunwayChecklist.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing REFRunwayChecklist in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  REFRunwayChecklist.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a REFRunwayChecklist from the DB
export function destroy(req, res) {
  REFRunwayChecklist.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
