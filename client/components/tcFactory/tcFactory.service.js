'use strict';

angular.module('tempApp')
  .factory('tcFactory', ['$http', function ($http) {
    var date = "3/16/2016";
    var smfltnum = "09A";
    var travelCodes;
    var pilots;
    var aircraft;
    return {
        getData: function (callback) {
            if(travelCodes) {
                callback(travelCodes);
            } else {
                $http.get('/api/travelCodes').success(function(d) {
                    travelCodes = d;
                    callback(d);
                });
            }
        },
        getFlights: function (body,callback) {
            $http.post('/api/flights/o',body).success(function(d) {
                callback(d);
            });
        },
        getPilots: function (callback) {
            if(pilots) {
                callback(pilots);
            } else {
                $http.get('/api/pilotSchs').success(function(d) {
                    callback(pilots = d);
                });
            }
        },
        getAircraft: function (callback) {
            if(aircraft) {
                callback(aircraft);
            } else {
                $http.get('/api/aircraftSchs').success(function(d) {
                    callback(aircraft = d);
                });
            }
        },
        setDate: function(dt){
            date=dt;
        },
        getDate: function(){
            return date;
        },
        setSmfltnum: function(sm){
           smfltnum=sm.toUpperCase();
        },
        getSmfltnum: function(){
            return smfltnum;
        }
    };
}]);
