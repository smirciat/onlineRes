'use strict';

(function() {

class AdminController {
  constructor(User,Modal,Auth,appConfig) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.quickModal = Modal.confirm.quickMessage();
    this.Auth=Auth;
    this.roles = appConfig.userRoles;
    this.role={};
    this.role.selected = "user";
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
  
  resetPassword(user){
    this.Auth.adminChangePassword(user._id)
      .then(() => {
            this.quickModal('Password successfully reset for ' + user.name + ' id: ' + user._id);
          })
          .catch((err) => {
            console.log(err);
          });
  }
  
  changeRole(user){
    var index = this.users.findIndex(x => x._id==user._id);
    this.users[index].role = this.role.selected;
    this.Auth.adminChangeRole(user._id,this.role.selected)
      .then(() => {
            this.quickModal('Role for ' + user.name + ' id: ' + user._id + ' changed to ' + this.role.selected);
          })
          .catch((err) => {
            console.log(err);
          });
  }
}

angular.module('tempApp.admin')
  .controller('AdminController', AdminController);

})();
