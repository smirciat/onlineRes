'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var workorderCtrlStub = {
  index: 'workorderCtrl.index',
  show: 'workorderCtrl.show',
  create: 'workorderCtrl.create',
  update: 'workorderCtrl.update',
  destroy: 'workorderCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var workorderIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './workorder.controller': workorderCtrlStub
});

describe('Workorder API Router:', function() {

  it('should return an express router instance', function() {
    workorderIndex.should.equal(routerStub);
  });

  describe('GET /api/workorders', function() {

    it('should route to workorder.controller.index', function() {
      routerStub.get
        .withArgs('/', 'workorderCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/workorders/:id', function() {

    it('should route to workorder.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'workorderCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/workorders', function() {

    it('should route to workorder.controller.create', function() {
      routerStub.post
        .withArgs('/', 'workorderCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/workorders/:id', function() {

    it('should route to workorder.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'workorderCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/workorders/:id', function() {

    it('should route to workorder.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'workorderCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/workorders/:id', function() {

    it('should route to workorder.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'workorderCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
