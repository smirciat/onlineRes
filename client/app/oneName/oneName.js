'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/oneName', {
        templateUrl: 'app/oneName/oneName.html',
        controller: 'OneNameCtrl',
        controllerAs: 'name'
      });
  });
