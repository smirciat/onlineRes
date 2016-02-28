/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/userAttributes              ->  index
 * POST    /api/userAttributes              ->  create
 * GET     /api/userAttributes/:id          ->  show
 * PUT     /api/userAttributes/:id          ->  update
 * DELETE  /api/userAttributes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var sqldb = require('../../sqldb');
var UserAttribute = sqldb.UserAttribute;

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

// Gets a list of UserAttributes
export function index(req, res) {
  UserAttribute.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single UserAttribute from the DB
export function show(req, res) {
  UserAttribute.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

//get all userAttributes belonging to current user
export function batch(req, res) {
  UserAttribute.findAll({where: {uid:req.params.id}})
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new UserAttribute in the DB
export function create(req, res) {
  UserAttribute.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing UserAttribute in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  UserAttribute.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a UserAttribute from the DB
export function destroy(req, res) {
  UserAttribute.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
