'use strict';

describe('Service: gridSettings', function () {

  // load the service's module
  beforeEach(module('tempApp'));

  // instantiate service
  var gridSettings;
  beforeEach(inject(function (_gridSettings_) {
    gridSettings = _gridSettings_;
  }));

  it('should do something', function () {
    expect(!!gridSettings).toBe(true);
  });

});
