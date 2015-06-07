app.controller('chartCtrl', function($scope, DataModel, $stateParams){
    $scope.ajaxLoading = true;
    $scope.sub = $stateParams.id;
    DataModel.getData($scope.sub)
        .then(function(data) {
            $scope.bbox = data.bbox;
            $scope.rows = data.rows;
            $scope.ajaxLoading = false;
            $scope.chart = getTypes($scope);
        });
});

app.controller('diagCtrl', function($scope, DataModel, $stateParams, $modal, $log){
    var canvas = document.getElementById("myCanvas");
    $scope.ctx = canvas.getContext('2d');
    $scope.ajaxLoading = true;
    $scope.sub = $stateParams.id;
    DataModel.getData($scope.sub)
        .then(function(data) {
            $scope.bbox = data.bbox;
            $scope.rows = data.rows;
            $scope.ajaxLoading = false;
            setFilters($scope);
            setupGraphics($scope);
            drawNetwork($scope, 1024, 768);
        });

    var modalInstance;
    $scope.items = [
        { id: 1, name: 'Fantastic' },
        { id: 2, name: 'Helpful' },
        { id: 3, name: 'Not Sure' },
        { id: 4, name: 'Needs Work' },
        { id: 5, name: 'Sucks' }
    ];

    $scope.reDraw = function() {
        $scope.ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawNetwork($scope, 1024, 768);
    };

    $scope.doClick = function (e) {
        var cPos = getCursorPos(e);
        $scope.cX = cPos[0];
        $scope.cY = cPos[1];
        $scope.lcRow = findIcon($scope, cPos[0], cPos[1]);
        $scope.asset = $scope.lcRow.name;
        drawBackPath($scope);
        drawForwardPath($scope);
    };

    $scope.doRightClick = function (e) {
        var cPos = getCursorPos(e);
        $scope.cX = cPos[0];
        $scope.cY = cPos[1];
        $scope.rcRow = findIcon($scope, cPos[0], cPos[1]);

        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: './modals/modalAsset.html?bust=' + Math.random().toString(36).slice(2),
            controller: 'modalCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

app.controller('mapCtrl', function($scope, DataModel, $stateParams){
    $scope.sub = $stateParams.id;
    $scope.ajaxLoading = true;
    DataModel.getData($scope.sub)
        .then(function(data) {
            $scope.bbox = data.bbox;
            $scope.rows = data.rows;
            $scope.ajaxLoading = false;
            setFilters($scope);
            setupLeaflet($scope);
        });
});

app.controller('listCtrl', function($scope, DataModel, $stateParams){
    $scope.sub = $stateParams.id;
    $scope.ajaxLoading = true;
    DataModel.getData($scope.sub)
        .then(function(data) {
            $scope.bbox = data.bbox;
            $scope.rows = data.rows;
            $scope.ajaxLoading = false;
            $scope.myOrder = 'level';
            $scope.ud = false;
        });
});

app.controller('homeCtrl', function($scope, $http){
    return $http.get("http://" + window.location.hostname + ":3000/magog")
        .success(function (data, status, headers, config) {
            $scope.subs = data;
        })
        .error(function (data, status, headers, config) {
            console.log('failed getting data');
    });
});

app.controller('aboutCtrl', function($scope){
});

app.controller('modalCtrl', function($scope, $modalInstance, items) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});