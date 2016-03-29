'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var pilotSchCtrlStub = {
  index: 'pilotSchCtrl.index',
  show: 'pilotSchCtrl.show',
  create: 'pilotSchCtrl.create',
  update: 'pilotSchCtrl.update',
  destroy: 'pilotSchCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var pilotSchIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './pilotSch.controller': pilotSchCtrlStub
});

describe('PilotSch API Router:', function() {

  it('should return an express router instance', function() {
    pilotSchIndex.should.equal(routerStub);
  });

  describe('GET /api/pilotSchs', function() {

    it('should route to pilotSch.controller.index', function() {
      routerStub.get
        .withArgs('/', 'pilotSchCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/pilotSchs/:id', function() {

    it('should route to pilotSch.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'pilotSchCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/pilotSchs', function() {

    it('should route to pilotSch.controller.create', function() {
      routerStub.post
        .withArgs('/', 'pilotSchCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/pilotSchs/:id', function() {

    it('should route to pilotSch.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'pilotSchCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/pilotSchs/:id', function() {

    it('should route to pilotSch.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'pilotSchCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/pilotSchs/:id', function() {

    it('should route to pilotSch.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'pilotSchCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
