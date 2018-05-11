'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/order', {
        templateUrl: 'app/order/order.html',
        controller: 'OrderCtrl',
        controllerAs:'order',
        authenticate:'admin'
      });
  });
