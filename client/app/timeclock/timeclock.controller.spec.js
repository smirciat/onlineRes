'use strict';

describe('Controller: TimeclockCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var TimeclockCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TimeclockCtrl = $controller('TimeclockCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
