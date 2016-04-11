'use strict';

describe('Service: resPromise', function () {

  // load the service's module
  beforeEach(module('tempApp'));

  // instantiate service
  var resPromise;
  beforeEach(inject(function (_resPromise_) {
    resPromise = _resPromise_;
  }));

  it('should do something', function () {
    expect(!!resPromise).toBe(true);
  });

});
