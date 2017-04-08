'use strict';

describe('Controller: ViewPdfCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var ViewPdfCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewPdfCtrl = $controller('ViewPdfCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
