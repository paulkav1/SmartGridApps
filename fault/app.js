angular.module('faultApp', ['ui.router', 'ngResource', 'faultApp.controllers', 'faultApp.services']);
 
angular.module('faultApp').config(function($stateProvider) {
  $stateProvider.state('faults', {
    url: '/faults',
    templateUrl: 'partials/faults.html',
    controller: 'FaultListController'
  }).state('viewFault', {
    url: '/faults/:id/view',
    templateUrl: 'partials/fault-view.html',
    controller: 'FaultViewController'
  }).state('newFault', {
    url: '/faults/new',
    templateUrl: 'partials/fault-add.html',
    controller: 'FaultCreateController'
  }).state('editFault', {
    url: '/faults/:id/edit',
    templateUrl: 'partials/fault-edit.html',
    controller: 'FaultEditController'
  });
}).run(function($state) {
  $state.go('faults');
})