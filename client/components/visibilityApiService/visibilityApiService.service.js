'use strict';

angular.module('tempApp')
  .service('visibilityApiService', function ($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    document.addEventListener("visibilitychange",visibilitychanged);
    document.addEventListener("webkitvisibilitychange", visibilitychanged);
    document.addEventListener("msvisibilitychange", visibilitychanged);
    function visibilitychanged() {
      $rootScope.$broadcast('visibilityChanged', document.hidden || 
                                                 document.webkitHidden || 
                                                 document.mozHidden || 
                                                 document.msHidden);
    }
  });
