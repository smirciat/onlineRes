'use strict';

var app = require('../..');
import request from 'supertest';

var newDiscrepancy;

describe('Discrepancy API:', function() {

  describe('GET /api/discrepancys', function() {
    var discrepancys;

    beforeEach(function(done) {
      request(app)
        .get('/api/discrepancys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          discrepancys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      discrepancys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/discrepancys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/discrepancys')
        .send({
          name: 'New Discrepancy',
          info: 'This is the brand new discrepancy!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDiscrepancy = res.body;
          done();
        });
    });

    it('should respond with the newly created discrepancy', function() {
      newDiscrepancy.name.should.equal('New Discrepancy');
      newDiscrepancy.info.should.equal('This is the brand new discrepancy!!!');
    });

  });

  describe('GET /api/discrepancys/:id', function() {
    var discrepancy;

    beforeEach(function(done) {
      request(app)
        .get('/api/discrepancys/' + newDiscrepancy._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          discrepancy = res.body;
          done();
        });
    });

    afterEach(function() {
      discrepancy = {};
    });

    it('should respond with the requested discrepancy', function() {
      discrepancy.name.should.equal('New Discrepancy');
      discrepancy.info.should.equal('This is the brand new discrepancy!!!');
    });

  });

  describe('PUT /api/discrepancys/:id', function() {
    var updatedDiscrepancy;

    beforeEach(function(done) {
      request(app)
        .put('/api/discrepancys/' + newDiscrepancy._id)
        .send({
          name: 'Updated Discrepancy',
          info: 'This is the updated discrepancy!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDiscrepancy = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDiscrepancy = {};
    });

    it('should respond with the updated discrepancy', function() {
      updatedDiscrepancy.name.should.equal('Updated Discrepancy');
      updatedDiscrepancy.info.should.equal('This is the updated discrepancy!!!');
    });

  });

  describe('DELETE /api/discrepancys/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/discrepancys/' + newDiscrepancy._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when discrepancy does not exist', function(done) {
      request(app)
        .delete('/api/discrepancys/' + newDiscrepancy._id)
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
