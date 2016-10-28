'use strict';

var app = require('../..');
import request from 'supertest';

var newScheduledFlight;

describe('ScheduledFlight API:', function() {

  describe('GET /api/scheduledFlights', function() {
    var scheduledFlights;

    beforeEach(function(done) {
      request(app)
        .get('/api/scheduledFlights')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          scheduledFlights = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      scheduledFlights.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/scheduledFlights', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/scheduledFlights')
        .send({
          name: 'New ScheduledFlight',
          info: 'This is the brand new scheduledFlight!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newScheduledFlight = res.body;
          done();
        });
    });

    it('should respond with the newly created scheduledFlight', function() {
      newScheduledFlight.name.should.equal('New ScheduledFlight');
      newScheduledFlight.info.should.equal('This is the brand new scheduledFlight!!!');
    });

  });

  describe('GET /api/scheduledFlights/:id', function() {
    var scheduledFlight;

    beforeEach(function(done) {
      request(app)
        .get('/api/scheduledFlights/' + newScheduledFlight._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          scheduledFlight = res.body;
          done();
        });
    });

    afterEach(function() {
      scheduledFlight = {};
    });

    it('should respond with the requested scheduledFlight', function() {
      scheduledFlight.name.should.equal('New ScheduledFlight');
      scheduledFlight.info.should.equal('This is the brand new scheduledFlight!!!');
    });

  });

  describe('PUT /api/scheduledFlights/:id', function() {
    var updatedScheduledFlight;

    beforeEach(function(done) {
      request(app)
        .put('/api/scheduledFlights/' + newScheduledFlight._id)
        .send({
          name: 'Updated ScheduledFlight',
          info: 'This is the updated scheduledFlight!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedScheduledFlight = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedScheduledFlight = {};
    });

    it('should respond with the updated scheduledFlight', function() {
      updatedScheduledFlight.name.should.equal('Updated ScheduledFlight');
      updatedScheduledFlight.info.should.equal('This is the updated scheduledFlight!!!');
    });

  });

  describe('DELETE /api/scheduledFlights/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/scheduledFlights/' + newScheduledFlight._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when scheduledFlight does not exist', function(done) {
      request(app)
        .delete('/api/scheduledFlights/' + newScheduledFlight._id)
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
