'use strict';

angular.module('tempApp')
  .controller('MaintenanceCtrl', function ($scope) {
      this.days =[
        '6/23/16','6/24/16','6/25/16',
        '6/26/16','6/27/16','6/28/16'
      ];

    this.handleDrop = function(item, bin) {
      //alert('Item ' + item + ' has been dropped into ' + bin);
    }
    
    this.handleDropDelete = function(i, bin) {
      var item = document.getElementById(i);
      angular.element(item).remove();
    }
  });
