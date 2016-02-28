'use strict';

var app = require('../..');
import request from 'supertest';

var newUserAttribute;

describe('UserAttribute API:', function() {

  describe('GET /api/userAttributes', function() {
    var userAttributes;

    beforeEach(function(done) {
      request(app)
        .get('/api/userAttributes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userAttributes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      userAttributes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/userAttributes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/userAttributes')
        .send({
          name: 'New UserAttribute',
          info: 'This is the brand new userAttribute!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newUserAttribute = res.body;
          done();
        });
    });

    it('should respond with the newly created userAttribute', function() {
      newUserAttribute.name.should.equal('New UserAttribute');
      newUserAttribute.info.should.equal('This is the brand new userAttribute!!!');
    });

  });

  describe('GET /api/userAttributes/:id', function() {
    var userAttribute;

    beforeEach(function(done) {
      request(app)
        .get('/api/userAttributes/' + newUserAttribute._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userAttribute = res.body;
          done();
        });
    });

    afterEach(function() {
      userAttribute = {};
    });

    it('should respond with the requested userAttribute', function() {
      userAttribute.name.should.equal('New UserAttribute');
      userAttribute.info.should.equal('This is the brand new userAttribute!!!');
    });

  });

  describe('PUT /api/userAttributes/:id', function() {
    var updatedUserAttribute;

    beforeEach(function(done) {
      request(app)
        .put('/api/userAttributes/' + newUserAttribute._id)
        .send({
          name: 'Updated UserAttribute',
          info: 'This is the updated userAttribute!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedUserAttribute = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUserAttribute = {};
    });

    it('should respond with the updated userAttribute', function() {
      updatedUserAttribute.name.should.equal('Updated UserAttribute');
      updatedUserAttribute.info.should.equal('This is the updated userAttribute!!!');
    });

  });

  describe('DELETE /api/userAttributes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/userAttributes/' + newUserAttribute._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when userAttribute does not exist', function(done) {
      request(app)
        .delete('/api/userAttributes/' + newUserAttribute._id)
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
