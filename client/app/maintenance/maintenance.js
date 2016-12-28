'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/maintenance', {
        templateUrl: 'app/maintenance/maintenance.html',
        controller: 'MaintenanceCtrl',
        controllerAs: 'maintenance'
      });
  });
