angular.module('faultApp.controllers', []).controller('FaultListController', function($scope, $state, $window, Fault) {
  $scope.faults = Fault.query(); //fetch all. Issues a GET to /api/movies
 
  $scope.deleteFault = function(fault) { // Delete. Issues a DELETE to /api/movies/:id
      fault.$delete(function() {
        $window.location.href = ''; //redirect to home
      });
  };
}).controller('FaultViewController', function($scope, $stateParams, Fault) {
  $scope.fault = Fault.get({ id: $stateParams.id }); //Get a single .Issues a GET to /api/movies/:id
}).controller('FaultCreateController', function($scope, $state, $stateParams, Fault) {
  $scope.fault = new Fault();  //create new  instance. Properties will be set via ng-model on UI
 
  $scope.addFault = function() { //create a new . Issues a POST to /api/movies
    $scope.fault.$save(function() {
      $state.go('faults'); // on success go back to home i.e. list state.
    });
  };
}).controller('FaultEditController', function($scope, $state, $stateParams, Fault) {
  $scope.updateFault = function() { //Update the edited . Issues a PUT to /api/movies/:id
    $scope.fault.$update(function() {
      $state.go('faults'); // on success go back to home i.e. list state.
    });
  };
 
  $scope.loadFault = function() { //Issues a GET request to get a movie to update
    $scope.fault = Fault.get({ id: $stateParams.id });
  };
 
  $scope.loadFault(); // Load a fault which can be edited on UI
});