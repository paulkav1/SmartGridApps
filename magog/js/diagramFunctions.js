// These are all the functions to draw the network diagram
// and respond to user interaction with it

function setupGraphics($scope){
    var bbox = $scope.bbox;
    $scope.south = bbox[$scope.sub][0][0];
    $scope.west = bbox[$scope.sub][0][1];
    $scope.north = bbox[$scope.sub][1][0];
    $scope.east = bbox[$scope.sub][1][1];
}

function setFilters($scope) {
    $scope.phases = {};
    $scope.phases["A"] = true;
    $scope.phases["B"] = true;
    $scope.phases["C"] = true;
    //$scope.phases["N"] = true;

    $scope.feeders = [];
    for (i = 0; i < $scope.rows.length; i++){
        if ($scope.rows[i].type === 'Feeder' && $scope.rows[i].phase === 'A'){
            var fdr = {f: $scope.rows[i].feederName, state: true}
            $scope.feeders.push(fdr);
        }
    }
}

function drawNetwork($scope, xSize, ySize){
    figureScale($scope, xSize, ySize);

    $scope.icons = [];
    for (var i = 0; i < $scope.rows.length; i++){
        if (matchOnFeeder($scope, i) && matchOnPhase($scope, i)){
            if ($scope.rows[i].type === "ACLineSegment")
                drawLine($scope.ctx, $scope.rows[i], $scope);
            else
                drawNode($scope.ctx, $scope.rows[i], $scope, true);
        }
    }
}

// determine the scale from the viewport size and the bounding box
function figureScale($scope, x1, y1){
    var x2 = $scope.east - $scope.west;
    var y2 = $scope.north - $scope.south;
    $scope.xFactor = x1/x2;
    $scope.yFactor = y1/y2;
}

function matchOnPhase($scope, i){
    var phase = $scope.rows[i].phase;
    if (phase in $scope.phases)
        if ($scope.phases[phase])
            return true;

    return false;
}

function matchOnFeeder($scope, i){
    for (var f = 0; f < $scope.feeders.length; f++){
        if ($scope.rows[i].feederName === $scope.feeders[f].f)
            if ($scope.feeders[f].state === true)
                return true;
    }
    return false;
}

function getCursorPos(e){
    var posx, posy;

    if (e.pageX || e.pageY){
        posx = e.pageX;
        posy = e.pageY - 110;
    }
    else if (e.clientX || e.clientY){
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return [posx, posy];
}

function findIcon($scope, posx, posy){
    var closest = 800000000;
    var closestId;
    var xD, yD, sos;

    for (var i = 0; i < $scope.icons.length; i++) {
        var box = $scope.icons[i];
        // if we click inside a box it's a hit
        if (posx <= box.right && posx >= box.left && posy >= box.top && posy <= box.bottom) {
            $scope.box = box;
            $scope.hit = "exact";
            return findRow(box.id, $scope);
        }
        else{    // closest miss will do
            sos = ((posx - box.x) * (posx - box.x)) + ((posy - box.y) * (posy - box.y));
            if (sos < closest){
                closest = sos;
                closeBox = box;
            }
        }
    }
    $scope.box = closeBox;
    $scope.hit = "close";
    return findRow(closeBox.id, $scope);
}

function drawBackPath($scope){
// for each item in the path list back to the feeder, draw it highlighted
// if there is a previous highlighted path redraw it first
    var path;
    if ($scope.lastPath) {
        path = $scope.lastPath;
        for (var i = path.length; i > 0; i--) {
            var row = findRow(path[i], $scope);
            if (row)
                if (row.type === "ACLineSegment")
                    drawLine($scope.ctx, row, $scope);
                else
                    drawNode($scope.ctx, row, $scope, false);
        }
    }
    path = $scope.lcRow.pathBack;
    $scope.lastPath = path;
    var red = 'rgb(255,0,0)';
    for (var i = path.length; i > 0; i--){
        var row = findRow(path[i], $scope);
        if (row)
            if (row.type === "ACLineSegment")
                drawLineColored($scope.ctx, row, $scope, red);
            else
                drawNodeColored($scope.ctx, row, $scope, red);
    }
};

function drawForwardPath($scope){
// forward path is all the assets that have us in their path
// first we need to get rid of the last one we drew by drawing over it
    if ($scope.lastPathF){
        for (var i = 0; i < $scope.lastPathF.length; i++){
            var row = findRow($scope.lastPathF[i], $scope);
            if (row)
                if (row.type === "ACLineSegment")
                    drawLine($scope.ctx, row, $scope);
                else
                    drawNode($scope.ctx, row, $scope, false);
        }
    }
    $scope.lastPathF = [];
    var orange = 'rgb(255,165,0)';
    for (i = 0; i < $scope.rows.length; i++){
        var row = $scope.rows[i];
        for (var j = 0; j < row.pathBack.length; j++){
            if (row.pathBack[j] === $scope.lcRow.id){
                $scope.lastPathF.push(row.id);
                if (row.type === "ACLineSegment")
                    drawLineColored($scope.ctx, row, $scope, orange);
                else
                    drawNodeColored($scope.ctx, row, $scope, orange);
            }
        }
    }
};

function findRow(id, $scope){
    for (i = 0; i < $scope.rows.length; i++)
        if ($scope.rows[i].id === id)
            return $scope.rows[i];

    return null;
}

function drawNodeColored(ctx, asset, $scope, color){
    try{
        var points = setPoint(asset.points[0][0], asset.points[0][1], $scope);
    }catch(e){
        return;
    }
    if (asset.type === 'Feeder')
        drawAsset(ctx, 20, color, points);
    else if (asset.type === 'Switch - Open' || asset.type === 'Switch - Closed')
        drawAsset(ctx, 8, color, points);
    else if (asset.type === 'TransformerWinding')
        drawAsset(ctx, 7, color, points);
    else if (asset.type === 'Fuse')
        drawAsset(ctx, 7, color, points);
    else
        drawAsset(ctx, 7, color, points);
};

function drawLineColored(ctx, asset, $scope, color){
    drawSegs(ctx, asset, $scope, 2, color);
};

function drawNode(ctx, asset, $scope, makeIconArray){
    try{
        var points = setPoint(asset.points[0][0], asset.points[0][1], $scope);
    }catch(e){
        return;
    }
    if (asset.type === 'Feeder')
        drawAsset(ctx, 20, 'rgb(250,0,0)', points); //red
    else if (asset.type === 'Switch - Open')
        drawAsset(ctx, 8, 'rgb(0,100,200)', points);
    else if (asset.type === 'Switch - Closed')
        drawAsset(ctx, 8, 'rgb(0, 240, 0)', points); //green
    else if (asset.type === 'TransformerWinding')
        drawAsset(ctx, 7, 'rgb(40,50,40)', points); //gray-green
    else if (asset.type === 'Fuse')
        drawAsset(ctx, 7, 'rgb(200,240,20)', points); //orange
    else
        drawAsset(ctx, 7, 'rgb(0,40,220)', points); //blue

    if (makeIconArray){
        var icon = {
            left: points[0] - 5,
            right: points[0] + 5,
            top: points[1] - 5,
            bottom: points[1] + 5,
            x: points[0],
            y: points[1],
            id: asset.id
        };
        $scope.icons.push(icon);
    }
}

function drawAsset(ctx, size, color, points){
    ctx.fillStyle = color;
    ctx.fillRect(points[0] - (size / 2), points[1] - (size / 2), size, size);
}

function drawLine(ctx, asset, $scope){
    if (asset.phases === 'ABC' || asset.phases === 'ABCN' )
        drawSegs(ctx, asset, $scope, 2, 'rgb(0,0,0)')
    else if (asset.phases === 'A')
        drawSegs(ctx, asset, $scope, 2, 'rgb(200,0,0)');
    else if (asset.phases === 'B')
        drawSegs(ctx, asset, $scope, 2, 'rgb(200,0,0)');
    else if (asset.phases === 'C')
        drawSegs(ctx, asset, $scope, 2, 'rgb(0,0,200))');
    else if (asset.phases === 'N')
        drawSegs(ctx, asset, $scope, 2, 'rgb(150,150,150)');
    else
        drawSegs(ctx, asset, $scope, 2, 'rgb(80,50,70)');
};

function drawSegs(ctx, asset, $scope, width, color){
    var p1 = setPoint(asset.points[0][0], asset.points[0][1], $scope);

    for (var j = 0; j < asset.points.length; j++){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(p1[0], p1[1]);
        var p2 = setPoint(asset.points[j][0], asset.points[j][1], $scope);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
        p1 = p2;
    }
}

function setPoint(lat, long, $scope){
    if (!lat || !long)
        return [0,0];
    var x = (long - $scope.west) * $scope.xFactor;
    var y = ($scope.north - lat) * $scope.yFactor;
    return [x, y];
};