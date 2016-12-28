'use strict';

describe('Controller: SearchNameCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var SearchNameCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchNameCtrl = $controller('SearchNameCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
