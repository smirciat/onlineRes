'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/timeclock', {
        templateUrl: 'app/timeclock/timeclock.html',
        controller: 'TimeclockCtrl',
        controllerAs: 'timeclock',
        authenticate: 'admin'
      });
  });
