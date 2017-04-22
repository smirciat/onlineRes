'use strict';
const fs = require('fs');
var files =fs.readdirSync('./server/pdfs');
if (files&&files.length>0) files.splice(0,1);

exports = module.exports = {
  // List of user roles
  userRoles: ['guest', 'user','applicant', 'admin','superadmin'],
  angularMomentConfig: {timezone: 'America/Anchorage'},
  pdfFiles: files,
  tests: [{id:'b3y58e5273a2fc98',name:'Secured Aircraft Check'},
          {id:'vcg58e52936a8a93',name:'Fuel Verification'},
          {id:'ntv58efae259e78e', name:'Vehicle Operations'},
          {id:'vxv58f66f1875cd1', name:'Bay Procedures'},
          {id:'gbm58e5cd0915bdd', name:'Operational Control'}]
};
