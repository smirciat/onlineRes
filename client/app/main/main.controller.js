'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket,Auth) {
    this.$http = $http;
    this.awesomeThings = [];
    this.isloggedIn=false;
    this.isLoggedIn=Auth.isLoggedIn();
    console.log(this.isLoggedIn);
    this.newRes = {};
    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      socket.syncUpdates('thing', this.awesomeThings);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  addRes() {
    this.newRes['FLIGHT#']="1" + this.newRes.smfltnum;
    console.log(this.newRes);
    if (this.newRes) {
      this.$http.post('/api/reservations', this.newRes);
      this.newRes = {};
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

angular.module('tempApp')
  .controller('MainController', MainController);

})();
