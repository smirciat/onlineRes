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
  Reservation.findAll({where: {uid:req.params.id}})
    .then(responseWithResult(res))
    .catch(handleError(res));
}

//get all reservations for the specified day
export function daily(req, res) {
  var options = {};
  if (req.body.smfltnum) {
    var smfltnum = req.body.smfltnum;
    var smfltnum2 = smfltnum.substring(0,2) + 'A';
    if (smfltnum.substring(2).toUpperCase()==='A') smfltnum2 = smfltnum.substring(0,2) + 'B';
    options['$or'] =  [{smfltnum:smfltnum},{smfltnum:smfltnum2}];
  }
  var date = new Date(req.body.date); 
  var endDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59); 
  options['DATE TO FLY'] = {$gte:date,$lt:endDate};
  //Reservation.findAll({where: {"DATE TO FLY":{$gte:date,$lt:endDate},'$or':[{smfltnum:smfltnum},{smfltnum:smfltnum2}] } } )
  Reservation.findAll({where: options} )
    .then(responseWithResult(res))
    .catch(handleError(res));
}

//get all reservations for the specified day and flight time
export function oneF(req, res) {
  var options = {};
  var order = [['FLIGHT#','ASC'],['Ref#','ASC']];
  if (req.body.date) {
    
    var date = new Date(req.body.date); 
    var endDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59); 
    options['DATE TO FLY'] = {
      $lte: endDate,
      $gte: date 
    };
  }
  else {
    //res.status(500).end();
    //return null;
  }
  if (req.body.hourOfDay){
    //var smfltnum2 = req.body.hourOfDay.substring(0,2) + 'B';
    //if (req.body.hourOfDay.toUpperCase().substring(2)==='B') smfltnum2 = req.body.hourOfDay.substring(0,2) + 'A';
    options['$or'] = [{smfltnum:req.body.hourOfDay+'A'},{smfltnum:req.body.hourOfDay+'B'}];
  }
  else {
    //res.status(500).end();
    //return null;
  }
  
  if (req.body.invoice) {
    order = [['DATE TO FLY','DESC']];
    options['INVOICE#'] = req.body.invoice;
  }
  Reservation.findAll({where: options, order: order} )
    .then(responseWithResult(res))
    .catch(handleError(res));
}

//get all reservations for the specified day and flight time
export function name(req, res) {
  var options = {};
  console.log(req.body);
  
  if (req.body.first){
    //var date = new Date(req.body.date); 
    //date.setDate(date.getDate()-365)
    //var startDate = (date.getMonth()+1) + '/' + (date.getDate()) + '/' + date.getFullYear();
    if (req.body.last)
      var str = 'SELECT * FROM "Reservations" WHERE (LEVENSHTEIN(LOWER("FIRST"), \'' + req.body.first.toLowerCase()  + '\') < 2 ' +
          'AND LEVENSHTEIN(LOWER("LAST"), \'' + req.body.last.toLowerCase()  + '\') < 2) ' +
          'OR (dmetaphone("FIRST") =  dmetaphone(\'' + req.body.first + '\') AND ' +
          'dmetaphone("LAST") =  dmetaphone(\'' + req.body.last + '\')) ' +
          'OR (LOWER("FIRST") IN (SELECT nickname from nicknames WHERE name_id IN (SELECT name_id FROM nicknames WHERE ' +
          'nickname = \'' + req.body.first.toLowerCase() + '\')) AND dmetaphone("LAST") =  dmetaphone(\'' + req.body.last + '\')) ' +
          'ORDER BY "DATE TO FLY" DESC  LIMIT 100';
    else str = 'SELECT * FROM "Reservations" WHERE LEVENSHTEIN(LOWER("FIRST"), \'' + req.body.first.toLowerCase()  + '\') < 2 ' +
          'OR dmetaphone("FIRST") =  dmetaphone(\'' + req.body.first + '\') ' +
          'OR LOWER("FIRST") IN (SELECT nickname from nicknames WHERE name_id IN (SELECT name_id FROM nicknames WHERE ' +
          'nickname = \'' + req.body.first.toLowerCase() + '\')) ' +
          'ORDER BY "DATE TO FLY" DESC  LIMIT 100'; 
  }
  else {
    res.status(500).end();
    return null;
  }
  sqldb.sequelize.query(str, { raw:true, type: sequelize.QueryTypes.SELECT})
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Reservation from the DB
export function show(req, res) {
  Reservation.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
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

// Updates an existing Reservation in the DB (superuser)
export function superUpdate(req, res) {
  
  if (req.body._id) {
    delete req.body._id;
  }
  Reservation.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
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

export function superDestroy(req, res) {

  Reservation.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}