'use strict';

angular.module('tempApp')
  .controller('SetCtrl',function($http, $scope, $timeout,$interval) {
    var self=this;
    self.newAirport="";
    self.newICAO="";
    this.yellows=JSON.parse(window.localStorage.getItem( 'yellows' )||null);
    this.limits=JSON.parse(window.localStorage.getItem( 'limits' )||null);
    this.airports=JSON.parse(window.localStorage.getItem( 'airports' )||null);
    this.notifications=window.localStorage.getItem( 'notifications' )||"NO";
    self.add=function(){
      if (self.newICAO===""||self.newAirport==="") {
        self.newAirport="";
        self.newICAO="";
        return;
      }
      self.airports.unshift({name:self.newAirport,icao:self.newICAO});
      self.airports.forEach(function(airport){
          airport.clicked="NO";
      });
      window.localStorage.setItem('airports',JSON.stringify(self.airports));
      self.newAirport="";
      self.newICAO="";
    };
    
    self.changeYellow=function(){
      window.localStorage.setItem('yellows',JSON.stringify(self.yellows));
    };
    
    self.changeRed=function(){
      window.localStorage.setItem('limits',JSON.stringify(self.limits));
    };
    
    self.changeNotify=function(){
      window.localStorage.setItem('notifications',self.notifications);
    };
    
  });