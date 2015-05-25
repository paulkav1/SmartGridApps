function setupLeaflet($scope){
    // make a layer group which will have the map and our diagram
    // get our bounds and pass to map
    // set all scrolling options off for the map
    // get the map bounds which are not the same as what we passed in and reset our bounds
    // then use the canvas_layer function to get a canvas in Leaflet and draw our points on that
    var mba = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
    var mapId = 'paulkav1.kj67p107';
    var points = new L.LayerGroup();
    var streets = L.tileLayer('http://{s}.tiles.mapbox.com/v3/' + mapId + '/{z}/{x}/{y}.png', {attribution:mba});
    var subBox = $scope.bbox[$scope.sub];
    var south = subBox[0][0];
    var west = subBox[0][1];
    var north = subBox[1][0];
    var east = subBox[1][1];
    var centLat = (south + north) / 2;
    var centLong = (west + east) / 2;

    var map = L.map('leaflet', {center: [centLat,centLong], maxBounds: subBox, zoom: 10, zoomControl: false, layers: [streets, points]});
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.fitBounds(subBox);
    var bounds = map.getBounds();

    $scope.south = bounds.getSouth();
    $scope.north = bounds.getNorth();
    $scope.west = bounds.getWest();
    $scope.east = bounds.getEast();

    var gridLayer = L.CanvasLayer.extend({
        render: function() {
            var canvas = this.getCanvas();
            $scope.ctx = canvas.getContext('2d');
            drawNetwork($scope);
        }
    });
    var grid = new gridLayer().addTo(map);
}
