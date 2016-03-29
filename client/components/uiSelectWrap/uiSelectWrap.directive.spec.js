'use strict';

describe('Directive: uiSelectWrap', function () {

  // load the directive's module and view
  beforeEach(module('tempApp'));
  beforeEach(module('components/uiSelectWrap/uiSelectWrap.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ui-select-wrap></ui-select-wrap>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the uiSelectWrap directive');
  }));
});
