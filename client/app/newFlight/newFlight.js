'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/newFlight', {
        templateUrl: 'app/newFlight/newFlight.html',
        controller: 'NewFlightCtrl',
        controllerAs: 'new',
        authenticate: 'admin'
      });
  });
