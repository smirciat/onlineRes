'use strict';

var app = require('../..');
import request from 'supertest';

var newREFRunwayChecklist;

describe('REFRunwayChecklist API:', function() {

  describe('GET /api/REF_RunwayChecklists', function() {
    var REFRunwayChecklists;

    beforeEach(function(done) {
      request(app)
        .get('/api/REF_RunwayChecklists')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          REFRunwayChecklists = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      REFRunwayChecklists.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/REF_RunwayChecklists', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/REF_RunwayChecklists')
        .send({
          name: 'New REFRunwayChecklist',
          info: 'This is the brand new REFRunwayChecklist!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newREFRunwayChecklist = res.body;
          done();
        });
    });

    it('should respond with the newly created REFRunwayChecklist', function() {
      newREFRunwayChecklist.name.should.equal('New REFRunwayChecklist');
      newREFRunwayChecklist.info.should.equal('This is the brand new REFRunwayChecklist!!!');
    });

  });

  describe('GET /api/REF_RunwayChecklists/:id', function() {
    var REFRunwayChecklist;

    beforeEach(function(done) {
      request(app)
        .get('/api/REF_RunwayChecklists/' + newREFRunwayChecklist._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          REFRunwayChecklist = res.body;
          done();
        });
    });

    afterEach(function() {
      REFRunwayChecklist = {};
    });

    it('should respond with the requested REFRunwayChecklist', function() {
      REFRunwayChecklist.name.should.equal('New REFRunwayChecklist');
      REFRunwayChecklist.info.should.equal('This is the brand new REFRunwayChecklist!!!');
    });

  });

  describe('PUT /api/REF_RunwayChecklists/:id', function() {
    var updatedREFRunwayChecklist;

    beforeEach(function(done) {
      request(app)
        .put('/api/REF_RunwayChecklists/' + newREFRunwayChecklist._id)
        .send({
          name: 'Updated REFRunwayChecklist',
          info: 'This is the updated REFRunwayChecklist!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedREFRunwayChecklist = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedREFRunwayChecklist = {};
    });

    it('should respond with the updated REFRunwayChecklist', function() {
      updatedREFRunwayChecklist.name.should.equal('Updated REFRunwayChecklist');
      updatedREFRunwayChecklist.info.should.equal('This is the updated REFRunwayChecklist!!!');
    });

  });

  describe('DELETE /api/REF_RunwayChecklists/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/REF_RunwayChecklists/' + newREFRunwayChecklist._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when REFRunwayChecklist does not exist', function(done) {
      request(app)
        .delete('/api/REF_RunwayChecklists/' + newREFRunwayChecklist._id)
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
