'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var scheduledFlightCtrlStub = {
  index: 'scheduledFlightCtrl.index',
  show: 'scheduledFlightCtrl.show',
  create: 'scheduledFlightCtrl.create',
  update: 'scheduledFlightCtrl.update',
  destroy: 'scheduledFlightCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var scheduledFlightIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './scheduledFlight.controller': scheduledFlightCtrlStub
});

describe('ScheduledFlight API Router:', function() {

  it('should return an express router instance', function() {
    scheduledFlightIndex.should.equal(routerStub);
  });

  describe('GET /api/scheduledFlights', function() {

    it('should route to scheduledFlight.controller.index', function() {
      routerStub.get
        .withArgs('/', 'scheduledFlightCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/scheduledFlights/:id', function() {

    it('should route to scheduledFlight.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'scheduledFlightCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/scheduledFlights', function() {

    it('should route to scheduledFlight.controller.create', function() {
      routerStub.post
        .withArgs('/', 'scheduledFlightCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/scheduledFlights/:id', function() {

    it('should route to scheduledFlight.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'scheduledFlightCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/scheduledFlights/:id', function() {

    it('should route to scheduledFlight.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'scheduledFlightCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/scheduledFlights/:id', function() {

    it('should route to scheduledFlight.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'scheduledFlightCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
