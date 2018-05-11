'use strict';

describe('Controller: MetarCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var MetarCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MetarCtrl = $controller('MetarCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
