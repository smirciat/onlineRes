'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/viewPdf', {
        templateUrl: 'app/viewPdf/viewPdf.html',
        controller: 'ViewPdfCtrl',
        controllerAs: 'pdf',
        authenticate: 'applicant'
      });
  });
