'use strict';

var app = require('../..');
import request from 'supertest';

var newAllScheduledFlight;

describe('AllScheduledFlight API:', function() {

  describe('GET /api/allScheduledFlights', function() {
    var allScheduledFlights;

    beforeEach(function(done) {
      request(app)
        .get('/api/allScheduledFlights')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          allScheduledFlights = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      allScheduledFlights.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/allScheduledFlights', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/allScheduledFlights')
        .send({
          name: 'New AllScheduledFlight',
          info: 'This is the brand new allScheduledFlight!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAllScheduledFlight = res.body;
          done();
        });
    });

    it('should respond with the newly created allScheduledFlight', function() {
      newAllScheduledFlight.name.should.equal('New AllScheduledFlight');
      newAllScheduledFlight.info.should.equal('This is the brand new allScheduledFlight!!!');
    });

  });

  describe('GET /api/allScheduledFlights/:id', function() {
    var allScheduledFlight;

    beforeEach(function(done) {
      request(app)
        .get('/api/allScheduledFlights/' + newAllScheduledFlight._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          allScheduledFlight = res.body;
          done();
        });
    });

    afterEach(function() {
      allScheduledFlight = {};
    });

    it('should respond with the requested allScheduledFlight', function() {
      allScheduledFlight.name.should.equal('New AllScheduledFlight');
      allScheduledFlight.info.should.equal('This is the brand new allScheduledFlight!!!');
    });

  });

  describe('PUT /api/allScheduledFlights/:id', function() {
    var updatedAllScheduledFlight;

    beforeEach(function(done) {
      request(app)
        .put('/api/allScheduledFlights/' + newAllScheduledFlight._id)
        .send({
          name: 'Updated AllScheduledFlight',
          info: 'This is the updated allScheduledFlight!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAllScheduledFlight = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAllScheduledFlight = {};
    });

    it('should respond with the updated allScheduledFlight', function() {
      updatedAllScheduledFlight.name.should.equal('Updated AllScheduledFlight');
      updatedAllScheduledFlight.info.should.equal('This is the updated allScheduledFlight!!!');
    });

  });

  describe('DELETE /api/allScheduledFlights/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/allScheduledFlights/' + newAllScheduledFlight._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when allScheduledFlight does not exist', function(done) {
      request(app)
        .delete('/api/allScheduledFlights/' + newAllScheduledFlight._id)
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
