'use strict';

var app = require('../..');
import request from 'supertest';

var newWorkorder;

describe('Workorder API:', function() {

  describe('GET /api/workorders', function() {
    var workorders;

    beforeEach(function(done) {
      request(app)
        .get('/api/workorders')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          workorders = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      workorders.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/workorders', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/workorders')
        .send({
          name: 'New Workorder',
          info: 'This is the brand new workorder!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newWorkorder = res.body;
          done();
        });
    });

    it('should respond with the newly created workorder', function() {
      newWorkorder.name.should.equal('New Workorder');
      newWorkorder.info.should.equal('This is the brand new workorder!!!');
    });

  });

  describe('GET /api/workorders/:id', function() {
    var workorder;

    beforeEach(function(done) {
      request(app)
        .get('/api/workorders/' + newWorkorder._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          workorder = res.body;
          done();
        });
    });

    afterEach(function() {
      workorder = {};
    });

    it('should respond with the requested workorder', function() {
      workorder.name.should.equal('New Workorder');
      workorder.info.should.equal('This is the brand new workorder!!!');
    });

  });

  describe('PUT /api/workorders/:id', function() {
    var updatedWorkorder;

    beforeEach(function(done) {
      request(app)
        .put('/api/workorders/' + newWorkorder._id)
        .send({
          name: 'Updated Workorder',
          info: 'This is the updated workorder!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedWorkorder = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedWorkorder = {};
    });

    it('should respond with the updated workorder', function() {
      updatedWorkorder.name.should.equal('Updated Workorder');
      updatedWorkorder.info.should.equal('This is the updated workorder!!!');
    });

  });

  describe('DELETE /api/workorders/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/workorders/' + newWorkorder._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when workorder does not exist', function(done) {
      request(app)
        .delete('/api/workorders/' + newWorkorder._id)
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
