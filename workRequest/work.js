var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('hvtCtrl', function($scope, $http){
	$scope.ajaxLoaded = false;
	$http.get("http://localhost:8080/workRequest/dashboard")
	.success(function(data, status, headers, config) {
    	$scope.items = data.hvmodel;
    	$scope.orders = data.orders;
		$scope.ajaxLoaded = true;

		for (var i = 0; i < $scope.items.length; i++){
			var then = new Date($scope.items[i].insertDate).getTime();
			$scope.items[i].days = Math.floor((Date.now() - then) / 86400000);
			$scope.items[i].red = ($scope.items[i].days > 29);
			$scope.items[i].wr = matchTicket($scope.items[i]);
		};
	})
	.error(function(data, status, headers, config) {
		alert('fail');
		$scope.ajaxLoaded = false; 
	});

	
	function matchTicket(item) {
		for (var j = 0; j < $scope.orders.length; j++){
			if ($scope.orders[j].equipId === item.ddb){
				item.comments = $scope.orders[j].comments;				
				return $scope.orders[j].workRequest;
			}
		}
		return null;
	};
})


