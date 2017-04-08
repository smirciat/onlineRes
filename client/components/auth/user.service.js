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
    adminChangePassword: {
      method: 'PUT',
      params: {
        controller:'resetpassword'
      }
    },
    adminChangeRole: {
      method: 'PUT',
      params: {
        controller:'changerole'
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
