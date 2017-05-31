'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var allScheduledFlightCtrlStub = {
  index: 'allScheduledFlightCtrl.index',
  show: 'allScheduledFlightCtrl.show',
  create: 'allScheduledFlightCtrl.create',
  update: 'allScheduledFlightCtrl.update',
  destroy: 'allScheduledFlightCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var allScheduledFlightIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './allScheduledFlight.controller': allScheduledFlightCtrlStub
});

describe('AllScheduledFlight API Router:', function() {

  it('should return an express router instance', function() {
    allScheduledFlightIndex.should.equal(routerStub);
  });

  describe('GET /api/allScheduledFlights', function() {

    it('should route to allScheduledFlight.controller.index', function() {
      routerStub.get
        .withArgs('/', 'allScheduledFlightCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/allScheduledFlights/:id', function() {

    it('should route to allScheduledFlight.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'allScheduledFlightCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/allScheduledFlights', function() {

    it('should route to allScheduledFlight.controller.create', function() {
      routerStub.post
        .withArgs('/', 'allScheduledFlightCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/allScheduledFlights/:id', function() {

    it('should route to allScheduledFlight.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'allScheduledFlightCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/allScheduledFlights/:id', function() {

    it('should route to allScheduledFlight.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'allScheduledFlightCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/allScheduledFlights/:id', function() {

    it('should route to allScheduledFlight.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'allScheduledFlightCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
