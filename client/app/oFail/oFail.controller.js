'use strict';

angular.module('tempApp')
  
  
  .controller('OFailCtrl', function ($timeout, $location) {
     $timeout(function(){
       $location.path('/signup');
     },8000);
   
      
  })
  ;
  