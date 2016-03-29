'use strict';

angular.module('tempApp')
  .controller('OneFlightCtrl', function ($scope, $http, $interval, $q, uiGridConstants) {
    var d=new Date(Date.now());
    this.date = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
    this.smfltnum="09";
    this.times = [];
    this.time={};
    this.time.selected={ref:9,time:"9:00"};
    for (var i=7;i<=19;i++){
      this.times.push({ref:i, time: i + ':00'});
    }
      
    this.getRes= function(){
      //$scope.$apply();
    };
    this.makeSm = function(){
      if (this.time.selected.ref<10) this.smfltnum="0" + this.time.selected.ref;
      else this.smfltnum=this.time.selected.ref.toString();
    };
  });
