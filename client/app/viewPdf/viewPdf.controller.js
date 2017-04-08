'use strict';

angular.module('tempApp')
  .controller('ViewPdfCtrl', function ($scope,$http,appConfig) {
    
    this.data = null; // this is loaded async

    if (appConfig.pdfFiles.length>0){
      $http.get("/pdf?filename=" + appConfig.pdfFiles[0], {
          responseType: 'arraybuffer'
      }).then(response=> {
          this.data = new Uint8Array(response.data);
      });
    }
  });
