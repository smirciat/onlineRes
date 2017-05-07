'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/foms', {
        templateUrl: 'app/foms/foms.html',
        controller: 'FomsCtrl'
      });
  });
