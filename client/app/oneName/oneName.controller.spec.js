'use strict';

describe('Controller: OneNameCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var OneNameCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OneNameCtrl = $controller('OneNameCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
