var app = angular.module('myApp', []);

app.controller('serviceCtrl', function($scope, $http){
    $http.get("http://smartgridtools-pakra.rhcloud.com/api/datamon")
        .success(function(data, status, headers, config) {
            $scope.rows = data;
            for (var i = 0; i < $scope.rows.length; i++){
                if ($scope.rows[i].message.toLowerCase() === "ok")
                    $scope.rows[i].message = null;
                if ($scope.rows[i].message != null)
                    $scope.rows[i].red = true;
            }
        })
        .error(function(data, status, headers, config) {
            alert('fail ' + status);
            $scope.error = headers + status;
        });

    $scope.myOrder = 'id';
    $scope.ud = false;
})