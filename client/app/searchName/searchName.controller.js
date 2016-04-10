'use strict';

angular.module('tempApp')
  .controller('SearchNameCtrl', function ($scope, Modal, tcFactory, $location) {
    this.date = "1/1/2016";//fire for refresh is to alter this.date
    
    this.quickModal = Modal.confirm.quickMessage(response => {
      $location.path('/oneFlight');
    });
    
    this.getName = Modal.confirm.enterData(formData =>{
      if (!formData.data ) {
        this.quickModal("Try again to enter the name");
        return;
      }
      var fullName = formData.data.split(' ');
      if (fullName.length>1) {
        var first = fullName[0];
        var last = fullName[1];
        tcFactory.setName([first, last]);
        this.date = new Date(Date.now());
      }
      else this.quickModal("Try again to enter the name");
    });
    this.getName("Please enter First and Last Name with a space in between.");
  });
