'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/manifest', {
        templateUrl: 'app/manifest/manifest.html',
        controller: 'ManifestCtrl',
        controllerAs: 'man'
      });
  });
