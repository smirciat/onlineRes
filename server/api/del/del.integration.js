'use strict';

var app = require('../..');
import request from 'supertest';

var newDel;

describe('Del API:', function() {

  describe('GET /api/dels', function() {
    var dels;

    beforeEach(function(done) {
      request(app)
        .get('/api/dels')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          dels = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      dels.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/dels', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/dels')
        .send({
          name: 'New Del',
          info: 'This is the brand new del!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDel = res.body;
          done();
        });
    });

    it('should respond with the newly created del', function() {
      newDel.name.should.equal('New Del');
      newDel.info.should.equal('This is the brand new del!!!');
    });

  });

  describe('GET /api/dels/:id', function() {
    var del;

    beforeEach(function(done) {
      request(app)
        .get('/api/dels/' + newDel._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          del = res.body;
          done();
        });
    });

    afterEach(function() {
      del = {};
    });

    it('should respond with the requested del', function() {
      del.name.should.equal('New Del');
      del.info.should.equal('This is the brand new del!!!');
    });

  });

  describe('PUT /api/dels/:id', function() {
    var updatedDel;

    beforeEach(function(done) {
      request(app)
        .put('/api/dels/' + newDel._id)
        .send({
          name: 'Updated Del',
          info: 'This is the updated del!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDel = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDel = {};
    });

    it('should respond with the updated del', function() {
      updatedDel.name.should.equal('Updated Del');
      updatedDel.info.should.equal('This is the updated del!!!');
    });

  });

  describe('DELETE /api/dels/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/dels/' + newDel._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when del does not exist', function(done) {
      request(app)
        .delete('/api/dels/' + newDel._id)
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
