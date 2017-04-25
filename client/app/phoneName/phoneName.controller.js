'use strict';

angular.module('tempApp')
  .controller('PhoneNameCtrl', function ($scope,$http) {
    this.names=[];
    this.newName={};
    this.getNames = function(){
      $http.get('/api/smsNames').then((response)=>{
        this.names=response.data;
      });
    };
    this.addName = function(){
      $http.post('/api/smsNames',this.newName).then((response)=>{
        this.getNames();
        this.newName={};
      });
    };
    this.getNames();
  });
