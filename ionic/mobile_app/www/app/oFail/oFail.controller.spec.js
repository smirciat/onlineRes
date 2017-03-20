'use strict';

describe('Controller: OFailCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var OFailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OFailCtrl = $controller('OFailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
