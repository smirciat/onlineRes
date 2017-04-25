'use strict';

describe('Controller: SmsLogCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var SmsLogCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SmsLogCtrl = $controller('SmsLogCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
