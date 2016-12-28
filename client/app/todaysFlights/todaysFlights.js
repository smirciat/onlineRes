'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/todaysFlights', {
        templateUrl: 'app/todaysFlights/todaysFlights.html',
        controller: 'TodaysFlightsCtrl',
        controllerAs: 'today',
        authenticate: 'admin'
      });
  });
