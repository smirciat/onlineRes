'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var smsNameCtrlStub = {
  index: 'smsNameCtrl.index',
  show: 'smsNameCtrl.show',
  create: 'smsNameCtrl.create',
  update: 'smsNameCtrl.update',
  destroy: 'smsNameCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var smsNameIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './smsName.controller': smsNameCtrlStub
});

describe('SmsName API Router:', function() {

  it('should return an express router instance', function() {
    smsNameIndex.should.equal(routerStub);
  });

  describe('GET /api/smsNames', function() {

    it('should route to smsName.controller.index', function() {
      routerStub.get
        .withArgs('/', 'smsNameCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/smsNames/:id', function() {

    it('should route to smsName.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'smsNameCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/smsNames', function() {

    it('should route to smsName.controller.create', function() {
      routerStub.post
        .withArgs('/', 'smsNameCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/smsNames/:id', function() {

    it('should route to smsName.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'smsNameCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/smsNames/:id', function() {

    it('should route to smsName.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'smsNameCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/smsNames/:id', function() {

    it('should route to smsName.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'smsNameCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
