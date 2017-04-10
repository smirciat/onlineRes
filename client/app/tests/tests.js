'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/tests', {
        templateUrl: 'app/tests/tests.html',
        controller: 'TestsCtrl',
        controllerAs: 'test',
        authenticate: 'applicant'
      });
  });
