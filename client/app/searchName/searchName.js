'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/searchName', {
        templateUrl: 'app/searchName/searchName.html',
        controller: 'SearchNameCtrl',
        controllerAs: 'search'
      });
  });
