'use strict';

describe('Controller: MaintenanceCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var MaintenanceCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaintenanceCtrl = $controller('MaintenanceCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
