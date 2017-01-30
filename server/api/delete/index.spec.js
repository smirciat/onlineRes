'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var deleteCtrlStub = {
  index: 'deleteCtrl.index',
  show: 'deleteCtrl.show',
  create: 'deleteCtrl.create',
  update: 'deleteCtrl.update',
  destroy: 'deleteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var deleteIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './delete.controller': deleteCtrlStub
});

describe('Delete API Router:', function() {

  it('should return an express router instance', function() {
    deleteIndex.should.equal(routerStub);
  });

  describe('GET /api/deletes', function() {

    it('should route to delete.controller.index', function() {
      routerStub.get
        .withArgs('/', 'deleteCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/deletes/:id', function() {

    it('should route to delete.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'deleteCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/deletes', function() {

    it('should route to delete.controller.create', function() {
      routerStub.post
        .withArgs('/', 'deleteCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/deletes/:id', function() {

    it('should route to delete.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'deleteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/deletes/:id', function() {

    it('should route to delete.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'deleteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/deletes/:id', function() {

    it('should route to delete.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'deleteCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
