'use strict';
angular.module('tempApp')
  .controller('ChatController', function($scope,$http,Auth,socket){
    var vm = this;
    var tempArray =[];
    this.visible = true;
    this.expandOnNew = true;
    this.http=$http;
    var messages;
    this.messages=[{username:'a',content:'1'}];
    this.username = Auth.getCurrentUser().name;
    
    $http.get('/api/chats').then(function(response){
      tempArray=response.data;
      messages = tempArray.filter(function(response){
        return true;
      });
      
      socket.syncUpdates('chat', tempArray, function(event, item, array){
        array.sort(function(a,b){
          return a.date<b.date;
        });
        vm.messages = [];
        for (var i=0;i<50;i++) {
          if (array.length>i) vm.messages.push(array[i]);
          else i=50;
        }
      });
      console.log(vm.messages)
      vm.messages = messages;
      console.log(vm.messages)
      return vm.messages;
    });
    
    
    this.sendMessage = function(message, username) {
      if(message && message !== '' && username) {
        var msg = {
          'username': username,
          'content': message,
          'date': new Date(Date.now())
        };
        vm.messages.push(msg);
        console.log(vm.messages);
        //vm.http.post('/api/chats',msg);
        
      }
    };
    
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('chat');
    });
  
});



  