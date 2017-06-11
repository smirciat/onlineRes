'use strict';

describe('Controller: NewFlightCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var NewFlightCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewFlightCtrl = $controller('NewFlightCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
