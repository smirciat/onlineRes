'use strict';

angular.module('tempApp')
  .controller('OFailCtrl', function ($timeout, $window) {
    $timeout(function(){
      $window.location.href = '/signup';
    },8000);
  });
