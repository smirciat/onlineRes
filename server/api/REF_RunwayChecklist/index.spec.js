'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var REFRunwayChecklistCtrlStub = {
  index: 'REFRunwayChecklistCtrl.index',
  show: 'REFRunwayChecklistCtrl.show',
  create: 'REFRunwayChecklistCtrl.create',
  update: 'REFRunwayChecklistCtrl.update',
  destroy: 'REFRunwayChecklistCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var REFRunwayChecklistIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './REF_RunwayChecklist.controller': REFRunwayChecklistCtrlStub
});

describe('REFRunwayChecklist API Router:', function() {

  it('should return an express router instance', function() {
    REFRunwayChecklistIndex.should.equal(routerStub);
  });

  describe('GET /api/REF_RunwayChecklists', function() {

    it('should route to REFRunwayChecklist.controller.index', function() {
      routerStub.get
        .withArgs('/', 'REFRunwayChecklistCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/REF_RunwayChecklists/:id', function() {

    it('should route to REFRunwayChecklist.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'REFRunwayChecklistCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/REF_RunwayChecklists', function() {

    it('should route to REFRunwayChecklist.controller.create', function() {
      routerStub.post
        .withArgs('/', 'REFRunwayChecklistCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/REF_RunwayChecklists/:id', function() {

    it('should route to REFRunwayChecklist.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'REFRunwayChecklistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/REF_RunwayChecklists/:id', function() {

    it('should route to REFRunwayChecklist.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'REFRunwayChecklistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/REF_RunwayChecklists/:id', function() {

    it('should route to REFRunwayChecklist.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'REFRunwayChecklistCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
