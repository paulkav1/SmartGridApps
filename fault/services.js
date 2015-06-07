var APIHOME;
if (window.location.hostname === 'localhost')
    APIHOME = "http://localhost:8080/api/";
else
    APIHOME = "http://smartgridtools-pakra.rhcloud.com/api/";

angular.module('faultApp.services', []).factory('Fault', function($resource) {
    return $resource(APIHOME + 'faults/:id', { id: '@_id' }, {
        update: {
            method: 'PUT'
        }
    });
});