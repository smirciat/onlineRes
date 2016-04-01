'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/oFail', {
        templateUrl: 'app/oFail/oFail.html',
        controller: 'OFailCtrl'
      });
  });
