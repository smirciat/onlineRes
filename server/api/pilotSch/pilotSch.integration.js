'use strict';

var app = require('../..');
import request from 'supertest';

var newPilotSch;

describe('PilotSch API:', function() {

  describe('GET /api/pilotSchs', function() {
    var pilotSchs;

    beforeEach(function(done) {
      request(app)
        .get('/api/pilotSchs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          pilotSchs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      pilotSchs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/pilotSchs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/pilotSchs')
        .send({
          name: 'New PilotSch',
          info: 'This is the brand new pilotSch!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPilotSch = res.body;
          done();
        });
    });

    it('should respond with the newly created pilotSch', function() {
      newPilotSch.name.should.equal('New PilotSch');
      newPilotSch.info.should.equal('This is the brand new pilotSch!!!');
    });

  });

  describe('GET /api/pilotSchs/:id', function() {
    var pilotSch;

    beforeEach(function(done) {
      request(app)
        .get('/api/pilotSchs/' + newPilotSch._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          pilotSch = res.body;
          done();
        });
    });

    afterEach(function() {
      pilotSch = {};
    });

    it('should respond with the requested pilotSch', function() {
      pilotSch.name.should.equal('New PilotSch');
      pilotSch.info.should.equal('This is the brand new pilotSch!!!');
    });

  });

  describe('PUT /api/pilotSchs/:id', function() {
    var updatedPilotSch;

    beforeEach(function(done) {
      request(app)
        .put('/api/pilotSchs/' + newPilotSch._id)
        .send({
          name: 'Updated PilotSch',
          info: 'This is the updated pilotSch!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPilotSch = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPilotSch = {};
    });

    it('should respond with the updated pilotSch', function() {
      updatedPilotSch.name.should.equal('Updated PilotSch');
      updatedPilotSch.info.should.equal('This is the updated pilotSch!!!');
    });

  });

  describe('DELETE /api/pilotSchs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/pilotSchs/' + newPilotSch._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pilotSch does not exist', function(done) {
      request(app)
        .delete('/api/pilotSchs/' + newPilotSch._id)
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
