'use strict';

var app = require('../..');
import request from 'supertest';

var newTravelCode;

describe('TravelCode API:', function() {

  describe('GET /api/travelCodes', function() {
    var travelCodes;

    beforeEach(function(done) {
      request(app)
        .get('/api/travelCodes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          travelCodes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      travelCodes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/travelCodes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/travelCodes')
        .send({
          name: 'New TravelCode',
          info: 'This is the brand new travelCode!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTravelCode = res.body;
          done();
        });
    });

    it('should respond with the newly created travelCode', function() {
      newTravelCode.name.should.equal('New TravelCode');
      newTravelCode.info.should.equal('This is the brand new travelCode!!!');
    });

  });

  describe('GET /api/travelCodes/:id', function() {
    var travelCode;

    beforeEach(function(done) {
      request(app)
        .get('/api/travelCodes/' + newTravelCode._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          travelCode = res.body;
          done();
        });
    });

    afterEach(function() {
      travelCode = {};
    });

    it('should respond with the requested travelCode', function() {
      travelCode.name.should.equal('New TravelCode');
      travelCode.info.should.equal('This is the brand new travelCode!!!');
    });

  });

  describe('PUT /api/travelCodes/:id', function() {
    var updatedTravelCode;

    beforeEach(function(done) {
      request(app)
        .put('/api/travelCodes/' + newTravelCode._id)
        .send({
          name: 'Updated TravelCode',
          info: 'This is the updated travelCode!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTravelCode = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTravelCode = {};
    });

    it('should respond with the updated travelCode', function() {
      updatedTravelCode.name.should.equal('Updated TravelCode');
      updatedTravelCode.info.should.equal('This is the updated travelCode!!!');
    });

  });

  describe('DELETE /api/travelCodes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/travelCodes/' + newTravelCode._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when travelCode does not exist', function(done) {
      request(app)
        .delete('/api/travelCodes/' + newTravelCode._id)
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
