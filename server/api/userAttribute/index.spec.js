'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userAttributeCtrlStub = {
  index: 'userAttributeCtrl.index',
  show: 'userAttributeCtrl.show',
  create: 'userAttributeCtrl.create',
  update: 'userAttributeCtrl.update',
  destroy: 'userAttributeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var userAttributeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './userAttribute.controller': userAttributeCtrlStub
});

describe('UserAttribute API Router:', function() {

  it('should return an express router instance', function() {
    userAttributeIndex.should.equal(routerStub);
  });

  describe('GET /api/userAttributes', function() {

    it('should route to userAttribute.controller.index', function() {
      routerStub.get
        .withArgs('/', 'userAttributeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/userAttributes/:id', function() {

    it('should route to userAttribute.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'userAttributeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/userAttributes', function() {

    it('should route to userAttribute.controller.create', function() {
      routerStub.post
        .withArgs('/', 'userAttributeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/userAttributes/:id', function() {

    it('should route to userAttribute.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'userAttributeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/userAttributes/:id', function() {

    it('should route to userAttribute.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'userAttributeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/userAttributes/:id', function() {

    it('should route to userAttribute.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'userAttributeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
