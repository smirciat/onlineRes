'use strict';

(function() {

class AdminController {
  constructor($scope,$http) {
    var vm = this;

    vm.messages = [
      {
        'username': 'username1',
        'content': 'Hi!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      }
    ];
  
    vm.username = 'username1';
  
    vm.sendMessage = function(message, username) {
      if(message && message !== '' && username) {
        vm.messages.push({
          'username': username,
          'content': message,
          'date': new Date(Date.now())
        });
      }
      console.log(vm.messages);
    };
    vm.visible = true;
    vm.expandOnNew = true;
  }

}

angular.module('tempApp.admin')
  .controller('AdminController', AdminController);

})();


