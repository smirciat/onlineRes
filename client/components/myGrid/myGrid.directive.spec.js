'use strict';

describe('Directive: myGrid', function () {

  // load the directive's module and view
  beforeEach(module('tempApp'));
  beforeEach(module('components/myGrid/myGrid.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-grid></my-grid>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the myGrid directive');
  }));
});
