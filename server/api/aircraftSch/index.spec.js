'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var aircraftSchCtrlStub = {
  index: 'aircraftSchCtrl.index',
  show: 'aircraftSchCtrl.show',
  create: 'aircraftSchCtrl.create',
  update: 'aircraftSchCtrl.update',
  destroy: 'aircraftSchCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var aircraftSchIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './aircraftSch.controller': aircraftSchCtrlStub
});

describe('AircraftSch API Router:', function() {

  it('should return an express router instance', function() {
    aircraftSchIndex.should.equal(routerStub);
  });

  describe('GET /api/aircraftSchs', function() {

    it('should route to aircraftSch.controller.index', function() {
      routerStub.get
        .withArgs('/', 'aircraftSchCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/aircraftSchs/:id', function() {

    it('should route to aircraftSch.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'aircraftSchCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/aircraftSchs', function() {

    it('should route to aircraftSch.controller.create', function() {
      routerStub.post
        .withArgs('/', 'aircraftSchCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/aircraftSchs/:id', function() {

    it('should route to aircraftSch.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'aircraftSchCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/aircraftSchs/:id', function() {

    it('should route to aircraftSch.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'aircraftSchCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/aircraftSchs/:id', function() {

    it('should route to aircraftSch.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'aircraftSchCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
