'use strict';

describe('Controller: ManifestCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var ManifestCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManifestCtrl = $controller('ManifestCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
