'use strict';

var app = require('../..');
import request from 'supertest';

var newInventory;

describe('Inventory API:', function() {

  describe('GET /api/inventorys', function() {
    var inventorys;

    beforeEach(function(done) {
      request(app)
        .get('/api/inventorys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          inventorys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      inventorys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/inventorys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/inventorys')
        .send({
          name: 'New Inventory',
          info: 'This is the brand new inventory!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newInventory = res.body;
          done();
        });
    });

    it('should respond with the newly created inventory', function() {
      newInventory.name.should.equal('New Inventory');
      newInventory.info.should.equal('This is the brand new inventory!!!');
    });

  });

  describe('GET /api/inventorys/:id', function() {
    var inventory;

    beforeEach(function(done) {
      request(app)
        .get('/api/inventorys/' + newInventory._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          inventory = res.body;
          done();
        });
    });

    afterEach(function() {
      inventory = {};
    });

    it('should respond with the requested inventory', function() {
      inventory.name.should.equal('New Inventory');
      inventory.info.should.equal('This is the brand new inventory!!!');
    });

  });

  describe('PUT /api/inventorys/:id', function() {
    var updatedInventory;

    beforeEach(function(done) {
      request(app)
        .put('/api/inventorys/' + newInventory._id)
        .send({
          name: 'Updated Inventory',
          info: 'This is the updated inventory!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedInventory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedInventory = {};
    });

    it('should respond with the updated inventory', function() {
      updatedInventory.name.should.equal('Updated Inventory');
      updatedInventory.info.should.equal('This is the updated inventory!!!');
    });

  });

  describe('DELETE /api/inventorys/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/inventorys/' + newInventory._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when inventory does not exist', function(done) {
      request(app)
        .delete('/api/inventorys/' + newInventory._id)
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
