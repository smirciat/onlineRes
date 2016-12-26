'use strict';

angular.module('tempApp')
  .controller('PrintCtrl', function ($scope, tcFactory,$window,$timeout,$location) {
    this.four = [1,2,3,4];
    this.sections = tcFactory.getSections();
    $timeout($window.print,0);
    $timeout(function(){
      $location.path('/oneFlight');
    },2);
  });
