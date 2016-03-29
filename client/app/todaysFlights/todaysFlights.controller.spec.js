'use strict';

describe('Controller: TodaysFlightsCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var TodaysFlightsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TodaysFlightsCtrl = $controller('TodaysFlightsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
