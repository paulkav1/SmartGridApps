angular.module('faultApp.services', []).factory('Fault', function($resource) {
  return $resource('http://smartgridtools-pakra.rhcloud.com/api/faults/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
});