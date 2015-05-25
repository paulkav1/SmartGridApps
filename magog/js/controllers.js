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

app.controller('diagCtrl', function($scope, DataModel, $stateParams){
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
            drawNetwork($scope);
        });

    $scope.reDraw = function() {
        $scope.ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawNetwork($scope);
    };

    $scope.doClick = function (e) {
        var cPos = getCursorPos(e);
        $scope.cX = cPos[0];
        $scope.cY = cPos[1];
        $scope.lcRow = findIcon($scope, cPos[0], cPos[1]);
        drawBackPath($scope);
    };

    $scope.doRightClick = function (e) {
        var cPos = getCursorPos(e);
        $scope.cX = cPos[0];
        $scope.cY = cPos[1];
        $scope.rcRow = findIcon($scope, cPos[0], cPos[1]);
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

app.controller('homeCtrl', function($scope){
});

app.controller('aboutCtrl', function($scope){
});