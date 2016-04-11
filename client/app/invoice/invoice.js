'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/invoice', {
        templateUrl: 'app/invoice/invoice.html',
        controller: 'InvoiceCtrl'
      });
  });
