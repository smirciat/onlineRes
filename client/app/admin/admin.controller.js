'use strict';

(function() {

class AdminController {
  constructor(User,Modal,Auth) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.quickModal = Modal.confirm.quickMessage();
    this.Auth=Auth;
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
  
  resetPassword(user){
    this.Auth.adminChangePassword(user._id)
      .then(() => {
            this.quickModal('Password successfully reset.');
          })
          .catch((err) => {
            console.log(err);
          });
  }
}

angular.module('tempApp.admin')
  .controller('AdminController', AdminController);

})();
