'use strict';

angular.module('tempApp')
  .controller('TestsCtrl', function ($scope,appConfig,Auth,$sce,$timeout) {
    var user = Auth.getCurrentUser;
    var dummyUrl = "https://www.classmarker.com/online-test/start/?quiz=asdfasdf";
    var url = "https://www.classmarker.com/online-test/start/?quiz=" 
      + appConfig.tests[0].id 
      + "&cm_fn=" + user().name.split(" ")[0] 
      + "&cm_ln=" + user().name.split(" ")[1]
      + "&cm_e=" + user().email
      + "&cm_user_id=" + user()._id;
    this.iframeSrc=$sce.trustAsResourceUrl(dummyUrl);
    $timeout(()=>{this.iframeSrc=$sce.trustAsResourceUrl(url)},300);
  });
