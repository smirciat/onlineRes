'use strict';

var app = require('../..');
import request from 'supertest';

var newDelete;

describe('Delete API:', function() {

  describe('GET /api/deletes', function() {
    var deletes;

    beforeEach(function(done) {
      request(app)
        .get('/api/deletes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          deletes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      deletes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/deletes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/deletes')
        .send({
          name: 'New Delete',
          info: 'This is the brand new delete!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDelete = res.body;
          done();
        });
    });

    it('should respond with the newly created delete', function() {
      newDelete.name.should.equal('New Delete');
      newDelete.info.should.equal('This is the brand new delete!!!');
    });

  });

  describe('GET /api/deletes/:id', function() {
    var delete;

    beforeEach(function(done) {
      request(app)
        .get('/api/deletes/' + newDelete._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          delete = res.body;
          done();
        });
    });

    afterEach(function() {
      delete = {};
    });

    it('should respond with the requested delete', function() {
      delete.name.should.equal('New Delete');
      delete.info.should.equal('This is the brand new delete!!!');
    });

  });

  describe('PUT /api/deletes/:id', function() {
    var updatedDelete;

    beforeEach(function(done) {
      request(app)
        .put('/api/deletes/' + newDelete._id)
        .send({
          name: 'Updated Delete',
          info: 'This is the updated delete!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDelete = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDelete = {};
    });

    it('should respond with the updated delete', function() {
      updatedDelete.name.should.equal('Updated Delete');
      updatedDelete.info.should.equal('This is the updated delete!!!');
    });

  });

  describe('DELETE /api/deletes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/deletes/' + newDelete._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when delete does not exist', function(done) {
      request(app)
        .delete('/api/deletes/' + newDelete._id)
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
