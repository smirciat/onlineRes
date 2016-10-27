'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var discrepancyCtrlStub = {
  index: 'discrepancyCtrl.index',
  show: 'discrepancyCtrl.show',
  create: 'discrepancyCtrl.create',
  update: 'discrepancyCtrl.update',
  destroy: 'discrepancyCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var discrepancyIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './discrepancy.controller': discrepancyCtrlStub
});

describe('Discrepancy API Router:', function() {

  it('should return an express router instance', function() {
    discrepancyIndex.should.equal(routerStub);
  });

  describe('GET /api/discrepancys', function() {

    it('should route to discrepancy.controller.index', function() {
      routerStub.get
        .withArgs('/', 'discrepancyCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/discrepancys/:id', function() {

    it('should route to discrepancy.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'discrepancyCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/discrepancys', function() {

    it('should route to discrepancy.controller.create', function() {
      routerStub.post
        .withArgs('/', 'discrepancyCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/discrepancys/:id', function() {

    it('should route to discrepancy.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'discrepancyCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/discrepancys/:id', function() {

    it('should route to discrepancy.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'discrepancyCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/discrepancys/:id', function() {

    it('should route to discrepancy.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'discrepancyCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
