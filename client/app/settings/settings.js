'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/set', {
        templateUrl: 'app/settings/settings.html',
        controller: 'SetCtrl',
        controllerAs:'set'
      });
  });
