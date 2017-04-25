'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var smCtrlStub = {
  index: 'smCtrl.index',
  show: 'smCtrl.show',
  create: 'smCtrl.create',
  update: 'smCtrl.update',
  destroy: 'smCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var smIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './sm.controller': smCtrlStub
});

describe('Sm API Router:', function() {

  it('should return an express router instance', function() {
    smIndex.should.equal(routerStub);
  });

  describe('GET /api/sms', function() {

    it('should route to sm.controller.index', function() {
      routerStub.get
        .withArgs('/', 'smCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/sms/:id', function() {

    it('should route to sm.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'smCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/sms', function() {

    it('should route to sm.controller.create', function() {
      routerStub.post
        .withArgs('/', 'smCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/sms/:id', function() {

    it('should route to sm.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'smCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/sms/:id', function() {

    it('should route to sm.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'smCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/sms/:id', function() {

    it('should route to sm.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'smCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
