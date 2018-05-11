'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/inventory', {
        templateUrl: 'app/inventory/inventory.html',
        controller: 'InventoryCtrl',
        controllerAs: 'inventory',
        authenticate: 'admin'
      });
  });
