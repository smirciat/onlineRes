'use strict';
const fs = require('fs');
var files =fs.readdirSync('./server/pdfs');
if (files&&files.length>0) files.splice(0,1);

exports = module.exports = {
  // List of user roles
  userRoles: ['guest', 'user','applicant', 'admin','superadmin'],
  pdfFiles: files,
  tests: [{id:'b3y58e5273a2fc98',name:'Secured Aircraft Check'},
          {id:'asdkjhjasdh',name:'Dummy Test'}]
};
