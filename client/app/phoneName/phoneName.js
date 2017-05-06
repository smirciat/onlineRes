'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/phoneName', {
        templateUrl: 'app/phoneName/phoneName.html',
        controller: 'PhoneNameCtrl',
        controllerAs:'name',
        authenticate: 'admin'
      });
  });
