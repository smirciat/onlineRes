'use strict';

describe('Controller: PhoneNameCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var PhoneNameCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PhoneNameCtrl = $controller('PhoneNameCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
