(function(angular, undefined) {
'use strict';

angular.module('tempApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','applicant','admin','superadmin'],pdfFiles:['SOP-Operational-Control.pdf','SOP-Secured-Aircraft.pdf']})

;
})(angular);