'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/oneFlight', {
        templateUrl: 'app/oneFlight/oneFlight.html',
        controller: 'OneFlightCtrl',
        controllerAs: 'one',
        authenticate: 'admin'
      });
  });
