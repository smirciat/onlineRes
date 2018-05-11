'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/metar', {
        templateUrl: 'app/metar/metar.html',
        controller: 'MetarCtrl',
        controllerAs:'metar'
      });
  });
