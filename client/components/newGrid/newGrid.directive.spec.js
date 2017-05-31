'use strict';

describe('Directive: newGrid', function () {

  // load the directive's module and view
  beforeEach(module('tempApp'));
  beforeEach(module('components/newGrid/newGrid.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<new-grid></new-grid>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the newGrid directive');
  }));
});
