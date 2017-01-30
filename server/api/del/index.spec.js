'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var delCtrlStub = {
  index: 'delCtrl.index',
  show: 'delCtrl.show',
  create: 'delCtrl.create',
  update: 'delCtrl.update',
  destroy: 'delCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var delIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './del.controller': delCtrlStub
});

describe('Del API Router:', function() {

  it('should return an express router instance', function() {
    delIndex.should.equal(routerStub);
  });

  describe('GET /api/dels', function() {

    it('should route to del.controller.index', function() {
      routerStub.get
        .withArgs('/', 'delCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/dels/:id', function() {

    it('should route to del.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'delCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/dels', function() {

    it('should route to del.controller.create', function() {
      routerStub.post
        .withArgs('/', 'delCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/dels/:id', function() {

    it('should route to del.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'delCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/dels/:id', function() {

    it('should route to del.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'delCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/dels/:id', function() {

    it('should route to del.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'delCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
