'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/print', {
        templateUrl: 'app/print/print.html',
        controller: 'PrintCtrl',
        controllerAs: 'print'
      });
  });
