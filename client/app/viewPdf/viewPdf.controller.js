'use strict';

angular.module('tempApp')
  .controller('ViewPdfCtrl', function () {
    this.loading=false;
    this.new=true;
  })
  .directive('embedSrc', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var current = element;
      scope.$watch(function() { return attrs.embedSrc; }, function () {
        var clone = element
                      .clone()
                      .attr('src', attrs.embedSrc);
        current.replaceWith(clone);
        current = clone;
      });
    }
  };
});
