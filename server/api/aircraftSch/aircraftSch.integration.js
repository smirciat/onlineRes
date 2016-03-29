'use strict';

var app = require('../..');
import request from 'supertest';

var newAircraftSch;

describe('AircraftSch API:', function() {

  describe('GET /api/aircraftSchs', function() {
    var aircraftSchs;

    beforeEach(function(done) {
      request(app)
        .get('/api/aircraftSchs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          aircraftSchs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      aircraftSchs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/aircraftSchs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/aircraftSchs')
        .send({
          name: 'New AircraftSch',
          info: 'This is the brand new aircraftSch!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAircraftSch = res.body;
          done();
        });
    });

    it('should respond with the newly created aircraftSch', function() {
      newAircraftSch.name.should.equal('New AircraftSch');
      newAircraftSch.info.should.equal('This is the brand new aircraftSch!!!');
    });

  });

  describe('GET /api/aircraftSchs/:id', function() {
    var aircraftSch;

    beforeEach(function(done) {
      request(app)
        .get('/api/aircraftSchs/' + newAircraftSch._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          aircraftSch = res.body;
          done();
        });
    });

    afterEach(function() {
      aircraftSch = {};
    });

    it('should respond with the requested aircraftSch', function() {
      aircraftSch.name.should.equal('New AircraftSch');
      aircraftSch.info.should.equal('This is the brand new aircraftSch!!!');
    });

  });

  describe('PUT /api/aircraftSchs/:id', function() {
    var updatedAircraftSch;

    beforeEach(function(done) {
      request(app)
        .put('/api/aircraftSchs/' + newAircraftSch._id)
        .send({
          name: 'Updated AircraftSch',
          info: 'This is the updated aircraftSch!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAircraftSch = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAircraftSch = {};
    });

    it('should respond with the updated aircraftSch', function() {
      updatedAircraftSch.name.should.equal('Updated AircraftSch');
      updatedAircraftSch.info.should.equal('This is the updated aircraftSch!!!');
    });

  });

  describe('DELETE /api/aircraftSchs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/aircraftSchs/' + newAircraftSch._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when aircraftSch does not exist', function(done) {
      request(app)
        .delete('/api/aircraftSchs/' + newAircraftSch._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
