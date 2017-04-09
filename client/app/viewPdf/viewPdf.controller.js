'use strict';

angular.module('tempApp')
  .controller('ViewPdfCtrl', function ($scope,$http,appConfig,$sce) {
    
    this.data = null; // this is loaded async

    if (appConfig.pdfFiles.length>0){
      $http({ url: "/pdf?filename=" + appConfig.pdfFiles[0], 
        method: "GET", 
        headers: { 'Accept': 'application/pdf' }, 
        responseType: 'arraybuffer' })
      .then(response=> {
        var result = new Uint8Array(response.data);
        var currentBlob = new Blob([result], {type: 'application/pdf'});
        var url = URL.createObjectURL(currentBlob);// + '#toolbar=0';
        this.pdfUrl = $sce.trustAsResourceUrl(url);
      });
    }
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
