'use strict';

angular.module('tempApp')
  .controller('InvoiceCtrl', function ($scope) {
    this.date = new Date(Date.now());
  });
