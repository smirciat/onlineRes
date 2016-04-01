'use strict';

(function() {

function UserResource($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller:'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id:'me'
      }
    },
    getEmails: {
      method: 'GET',
      params: {
        id:'email'
      },
      isArray:true
    },
    changeEmail: {
      method: 'PUT',
      params: {
        controller:'email'
      }
    }
  });
}

angular.module('tempApp.auth')
  .factory('User', UserResource);

})();
