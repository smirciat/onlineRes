'use strict';

describe('Service: visibilityApiService', function () {

  // load the service's module
  beforeEach(module('tempApp'));

  // instantiate service
  var visibilityApiService;
  beforeEach(inject(function (_visibilityApiService_) {
    visibilityApiService = _visibilityApiService_;
  }));

  it('should do something', function () {
    expect(!!visibilityApiService).toBe(true);
  });

});
