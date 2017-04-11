'use strict';

angular.module('tempApp')
  .controller('TestsCtrl', function ($scope,appConfig,Auth,$sce,Modal) {
    this.quickMessage=Modal.confirm.quickMessage();
    this.quickMessage("If the test initializes with the wrong name, please select another test from the pulldown menu, then immediately re-select this test.  If you start a test, please finish it before moving on.");
    var user = Auth.getCurrentUser;
    var url = "https://www.classmarker.com/online-test/start/?quiz=" 
      + appConfig.tests[0].id 
      + "&cm_fn=" + user().name.split(" ")[0] 
      + "&cm_ln=" + user().name.split(" ")[1]
      + "&cm_e=" + user().email
      + "&cm_user_id=" + user()._id;
    this.iframeSrc=$sce.trustAsResourceUrl(url);
  });
