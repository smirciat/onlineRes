'use strict';

describe('Controller: FomsCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var FomsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FomsCtrl = $controller('FomsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
