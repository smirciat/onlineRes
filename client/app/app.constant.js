(function(angular, undefined) {
'use strict';

angular.module('tempApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','applicant','admin','superadmin'],pdfFiles:['OPS SPECS 2017-03-21.pdf','SBA Employee Manual.pdf','SBA OPERATIONS Manual Rev23.pdf','SOP Beach Ops 6-10-13.pdf','SOP Fuel Verification 1-18-17 Rev 2.pdf','SOP-Operational-Control.pdf','SOP-Secured-Aircraft.pdf'],tests:[{id:'b3y58e5273a2fc98',name:'Secured Aircraft Check'}]})

;
})(angular);