'use strict';

describe('Controller: PrintCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var PrintCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrintCtrl = $controller('PrintCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
