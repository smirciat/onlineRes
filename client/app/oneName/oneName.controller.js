'use strict';

angular.module('tempApp')
  .controller('OneNameCtrl', function ($scope) {
    this.date = new Date(Date.now());
  });
