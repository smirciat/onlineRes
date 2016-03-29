'use strict';

describe('Controller: OneFlightCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var OneFlightCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OneFlightCtrl = $controller('OneFlightCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
