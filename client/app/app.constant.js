(function(angular, undefined) {
'use strict';

angular.module('tempApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','applicant','admin','superadmin'],angularMomentConfig:{timezone:'America/Anchorage'},pdfFiles:['OPS SPECS 2017-03-21.pdf','SBA Employee Manual.pdf','SBA OPERATIONS Manual Rev23.pdf','SOP Beach Ops 6-10-13.pdf','SOP Fuel Verification 1-18-17 Rev 2.pdf','SOP-Operational-Control.pdf','SOP-Secured-Aircraft.pdf'],tests:[{id:'b3y58e5273a2fc98',name:'Secured Aircraft Check'},{id:'vcg58e52936a8a93',name:'Fuel Verification'},{id:'ntv58efae259e78e',name:'Vehicle Operations'},{id:'vxv58f66f1875cd1',name:'Bay Procedures'},{id:'gbm58e5cd0915bdd',name:'Operational Control'}]})

;
})(angular);